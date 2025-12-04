import { AvailableFunctionsType } from 'src/openai/type/agentFunction.type';
import { CoinFunctionProcessor } from './functions/coin/coin.function-processor';
import { FunctionName } from './enum/FunctionNames.enum';
import { CoinGptFunction } from './functions/coin/coin.gpt-function';
import { TrendingCoinGptFunction } from './functions/trending-coin/trendingCoin.gpt-function';
import { TrendingCoinFunctionProcessor } from './functions/trending-coin/trendingCoin.function.processor';

export const cryptoAgentFunctions: Record<string, AvailableFunctionsType> = {
  [FunctionName.coin]: {
    gptFunction: CoinGptFunction,
    processor: CoinFunctionProcessor,
  },
  [FunctionName.trendingCoin]: {
    gptFunction: TrendingCoinGptFunction,
    processor: TrendingCoinFunctionProcessor,
  },
};
