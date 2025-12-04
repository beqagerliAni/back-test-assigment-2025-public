import { FunctionTool } from 'openai/resources/responses/responses.js';
import { GptFunctionProcessor } from './gptFunctionProcessor.type';

export type AvailableFunctionsType = {
  processor: GptFunctionProcessor;
  gptFunction: FunctionTool;
};
