import { Injectable } from '@nestjs/common';
import OpenAI from 'openai';
import { AgentDefinition } from './type/agentDefinition.type';
import { FunctionCallHandler } from './type/functionCallHandler.type';
import { StreamCallbacks } from './interface/callBacks.interface';
import { getFormattedCurrentDate } from 'src/shared/util/formatDate.util';
import { ResponseStreamEvent } from 'openai/resources/responses/responses.js';
import { getGptFunctions } from 'src/shared/util/getFunctions.util';
import { ArgsBuffer } from './type/argsBuffer.type';

@Injectable()
export class OpenaiService {
  private client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

  async createThread(agentDef: AgentDefinition) {
    return await this.client.conversations.create({
      items: [
        { type: 'message', role: 'system', content: agentDef.systemPrompt },
      ],
    });
  }

  async getMessage(threadId: string) {
   const items = await this.client.conversations.items.list(threadId);
   const conversation = items.data.map((item) => {
     if(item.type === 'message') {
      // dont return hole data
       return {
        role: item.role,
        message: item.content[0].type === 'output_text'? item.content[0].text : item.content[0]
       }
     }
   })
   return conversation
  }
  async responseStreamMessage(
    message: string,
    agentDef: AgentDefinition,
    threadId: string,
    functionCallhandler: FunctionCallHandler,
    callBacks: StreamCallbacks,
  ): Promise<void> {
    try {
      const argBuffers: ArgsBuffer = {};
      const date = getFormattedCurrentDate();
      const tools = agentDef.functions
        ? [...getGptFunctions(agentDef.functions)]
        : [];
      const input: Array<
        | { role: 'user'; content: string }
        | { role: 'system'; content: string }
        | { type: 'function_call_output'; call_id: string; output: string }
      > = [
        {
          role: 'user',
          content: `Today's date is ${date}`,
        },
      ];
      input.push({ role: 'user', content: message });
      const MAX_ROUNDS = 5;
      for (let round = 0; round < MAX_ROUNDS; round++) {
        let sawFunctionCall = false;
        const iterable: AsyncIterable<ResponseStreamEvent> =
          this.client.responses.stream({
            conversation: threadId,
            model: agentDef.model,
            input,
            tools,
          }) as AsyncIterable<ResponseStreamEvent>;
        for await (const event of iterable) {
          switch (event.type) {
            case 'response.output_text.delta':
              callBacks.onDelta(event.delta);
              break;
            case 'response.output_item.done': {
              const item = event.item;
              if (item.type === 'function_call') {
                sawFunctionCall = true;
                argBuffers[item.call_id] = {
                  name: item.name,
                  args: item.arguments,
                };
                callBacks.onToolCall({
                  name: item.name,
                  status: 'calling',
                });
              }
              break;
            }
            case 'response.completed': {
              // Only signal completed if there was no function call this round
              if (!sawFunctionCall) callBacks.onCompleted();
            }
            default:
              break;
          }
        }
        // we whont have to use any function call thats it
        if (!sawFunctionCall) return;

        const pendingIds = Object.keys(argBuffers);

        for (const id of pendingIds) {
          const { name, args } = argBuffers[id];
          const fnName = name ?? '';
          const output = await functionCallhandler(fnName, args);
          const stringData =
            typeof output === 'string' ? output : JSON.stringify(output);
          input.push({
            type: 'function_call_output',
            call_id: id,
            output: stringData,
          });
        }

        for (const id of pendingIds) delete argBuffers[id];
      }
      callBacks.onError(new Error('Exceeded MAX_ROUNDS of tool calls'));
    } catch (error) {
      callBacks.onError(error);
    }
  }
}
