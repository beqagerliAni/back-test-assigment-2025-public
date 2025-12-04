import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { cryptoApiClient } from 'src/agents/crypto-agent/apiClient/crypto.api-client';
import { BaseAgentService } from 'src/base-agent/base-agent.service';

@Injectable()
export class CryptoService extends BaseAgentService {
  async getCryptoMetrics(params: {
    name: string;
    vs_currency: string;
    days: number;
  }) {
    const { name, vs_currency, days } = params;
    const response = await cryptoApiClient.get(`coins/${name}/market_chart`, {
      params: {
        days: days,
        vs_currency: vs_currency
      }
    })
    return response.data
    } catch (err) {
      throw new InternalServerErrorException(
        `Failed to fetch crypto metrics: ${(err as Error).message}`,
      );
    }
}
