import { Injectable, MessageEvent } from '@nestjs/common';
import { Observable, Subscriber } from 'rxjs';
import { cryptoAgentDefinition } from 'src/agents/crypto-agent/crypto.agent-def';
import { OpenaiService } from 'src/openai/openai.service';

@Injectable()
export abstract class BaseAgentService {
  constructor(private openaiService: OpenaiService,) {}

  async createThread() {
    return await this.openaiService.createThread(cryptoAgentDefinition);
  }
  async getMessage(threadId: string) {
    return await this.openaiService.getMessage(threadId)
  }

  async sendStreamMessage(
    message: string,
    threadId: string,
  ): Promise<Observable<MessageEvent>> {
    return new Observable((subscriber: Subscriber<MessageEvent>) => {
      // we send text with chunks but we also need to track that message in case we whont to save message in db
      // day-4 nah i dont have time at the moment to itegrate database sory
      //  if you whont to see chat conversation just use GET(messages/:threadId)
      let messageChunk = '';

      this.openaiService.responseStreamMessage(
        message,
        cryptoAgentDefinition,
        threadId,
        async (name: string, args: string) => {
          // it will olways return json string
          return cryptoAgentDefinition.functions[name].processor(args);
        },
        {
          onThreadRunCreated: function (): void {
            subscriber.next({
              data: {
                message: 'AI have recivied message and is Processing',
              },
            });
          },
          onDelta: function (textDelta: string): void {
            messageChunk += textDelta;
            subscriber.next({
              data: textDelta,
            });
          },
          //so in the front you whould have an handler on this evnet, it whould show what kind of function gpt uses 
          // to analyze your request and in good deisgn that looks pritty awsome
          onToolCall: function (info: {
            status: 'calling' | 'finished';
            name?: string;
          }): void {
            subscriber.next({
              data: {
                ...info,
              },
            });
          },
          onCompleted: function (): void {
            // i whont add this  next hear its just for you guys to see whats hole response
            subscriber.next({
              data: `${messageChunk}`,
            });
            subscriber.complete();
          },
          onError: function (e: unknown): void {
            subscriber.error(e);
          },
        },
      );
    });
  }
}
