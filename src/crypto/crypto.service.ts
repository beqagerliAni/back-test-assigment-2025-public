import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { cryptoApiClient } from 'src/agents/crypto-agent/apiClient/crypto.api-client';
import { BaseAgentService } from 'src/base-agent/base-agent.service';
import { CoinGeckoMarketChartResponse, CryptoChartPoint } from './intrface/crypto.interface';

@Injectable()
export class CryptoService extends BaseAgentService {
  async getCryptoMetrics(params: {
    name: string;
    vs_currency: string;
    start_date: string,
    end_date: string,
    granularity: string
  }) {
    try {
      let days = 365
      const { name, vs_currency, start_date, end_date } = params;

      switch(params.granularity) {
        case 'hourly':
          days = 90
          break;
        case 'minutely':
          days = 1
          break;
      }

      const response = await cryptoApiClient.get<CoinGeckoMarketChartResponse>(`coins/${name}/market_chart`, {
        params: {
          days,
          vs_currency: vs_currency,
        },
      });
      return this.formatCryptoChartData(response.data,start_date,end_date)
    } catch (err) {
      throw new InternalServerErrorException(
        `Failed to fetch crypto metrics: ${(err as Error).message}`,
      );
    }
  }
formatCryptoChartData(
  apiResponse: CoinGeckoMarketChartResponse,
  start_date: string,
  end_date: string
): CryptoChartPoint[] {
  const { prices, market_caps, total_volumes } = apiResponse;

  const startTime = new Date(start_date).getTime();
  const endTime = new Date(end_date).getTime();

  const chartData: CryptoChartPoint[] = prices
    .map(([timestamp, price], index) => {
      const marketCap = market_caps[index]?.[1] ?? 0;
      const volume = total_volumes[index]?.[1] ?? 0;

      return {
        timestamp,
        time: new Date(timestamp).toISOString().split('T')[0],
        price: Number(price.toFixed(2)),
        marketCap: Number(marketCap.toFixed(0)),
        volume: Number(volume.toFixed(0)),
      };
    })
    .filter(point => point.timestamp >= startTime && point.timestamp <= endTime)
    .map(({ timestamp, ...rest }) => rest);

  return chartData;
}

}
