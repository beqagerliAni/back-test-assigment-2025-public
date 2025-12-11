import {
  Controller,
  Get,
  Param,
  Query,
  BadRequestException,
  Sse,
  MessageEvent
} from '@nestjs/common';
import { BaseAgentController } from 'src/base-agent/base-agent.controller';
import { CryptoService } from './crypto.service';
import { Observable } from 'rxjs';

@Controller('crypto')
export class CryptoController extends BaseAgentController {
  constructor(private readonly cryptoService: CryptoService) {
    super(cryptoService);
  }
  @Get(':name/metrics')
  async getCryptoMetrics(
    @Param('name') name: string,
    @Query('vs_currency') vs_currency: string,
    @Query('start_date') start_date: string,
    @Query('end_date') end_date: string,
    @Query('granularity') granularity: 'daily' | 'hourly'| 'minutely',
  ) {
    if (!name) throw new BadRequestException('Path param "name" is required');
    if (!vs_currency)
      throw new BadRequestException('Query param "vs_currency" is required');
    if (typeof start_date !== 'string')
      throw new BadRequestException('Query param "start_date" must be an date');
    if (typeof end_date !== 'string')
      throw new BadRequestException('Query param "end_date" must be an date');

    return await this.cryptoService.getCryptoMetrics({
      name,
      vs_currency,
      start_date,
      end_date,
      granularity,
    });
  }
  
  @Sse('analyze/:threadId')
    analyzeData(
      @Param('threadId') threadId: string,
    ): Promise<Observable<MessageEvent>> {
      return this.cryptoService.analyzeData(threadId);
    }
}
