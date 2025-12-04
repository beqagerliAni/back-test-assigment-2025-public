import { AvailableFunctionsType } from 'src/openai/type/agentFunction.type';

export const getGptFunctions = (
  funcs: Record<string, AvailableFunctionsType>,
) => {
  return Object.values(funcs).map((f) => f.gptFunction);
};
