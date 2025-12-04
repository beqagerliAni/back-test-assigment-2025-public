import { FunctionTool } from 'openai/resources/responses/responses';
import { FunctionName } from '../../enum/FunctionNames.enum';

export const TrendingCoinGptFunction: FunctionTool = {
  type: 'function',
  strict: false,
  name: FunctionName.trendingCoin,
  description: `This function retrieves real-time trending cryptocurrency data.
Use it to get up-to-date information about the most popular coins, market momentum, and emerging assets.
It provides insights into active cryptocurrencies, market activity, dominance shifts, and overall market trends.
Designed for applications that need fast, accurate, and dynamic crypto trend data.
Ideal for dashboards, analytics tools, trading assistants, and market monitoring features.
Returns consistent, structured data ready for further processing or display.`,
  parameters: {
    type: 'object',
    properties: {},
    additionalProperties: false,
  },
};
