import { FunctionTool } from 'openai/resources/responses/responses';
import { FunctionName } from '../../enum/FunctionNames.enum';

export const CoinGptFunction: FunctionTool = {
  type: 'function',
  strict: false,
  name: FunctionName.coin,
  description: `This function retrieves the current price information for one cryptocurrencie. 
Provide the coin name (e.g., 'Bitcoin', 'Ethereum'). 
The function returns the market data (price, ATH, exchange tickers, etc.)`,
  parameters: {
    type: 'object',
    properties: {
      name: {
        type: 'string',
        description: "Coin name (e.g. 'Bitcoin,Ethereum')",
      },
    },
    additionalProperties: false,
  },
};
