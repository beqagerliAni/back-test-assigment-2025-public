import { AvailableFunctionsType } from './agentFunction.type';

export type AgentDefinition = {
  systemPrompt: string;
  name: string;
  model: string;
  functions: Record<string, AvailableFunctionsType>;
};
