import { GptFunctionProcessor } from 'src/openai/type/gptFunctionProcessor.type';
import { CoinInterface } from './interface/coinJson.interface';
import { cryptoApiClient } from '../../apiClient/crypto.api-client';
import { CoinResponseInterface } from './interface/coinResponse.interface';
import { checkProperty } from 'src/shared/util/checkProperty.util';

export const CoinFunctionProcessor: GptFunctionProcessor = async (
  gptArgs: string,
) => {
  try {
    const priceJson = JSON.parse(gptArgs) as CoinInterface;
    const validate = checkProperty(priceJson,['name'])
    if(validate.erros.length) {
      return JSON.stringify(validate.erros)
    }
    priceJson.name = priceJson.name.toLocaleLowerCase();
    const response = await cryptoApiClient.get<CoinResponseInterface>(
      `coins/${priceJson.name}`,
    );
    const coin = response.data;
    const coinInfo = {
      id: coin.id,
      market_cap_rank: coin.market_cap_rank,
      sentiment_votes_up_percentage: coin.sentiment_votes_up_percentage,
      sentiment_votes_down_percentage: coin.sentiment_votes_down_percentage,
      market_data: {
        gel: coin.market_data?.current_price?.gel ?? null,
        eur: coin.market_data?.current_price?.eur ?? null,
        usd: coin.market_data?.current_price?.usd ?? null,
      },
    };

    return JSON.stringify(coinInfo);
  } catch (error) {
    console.error(error);
    return 'thea wos error when fetching data';
  }
};
