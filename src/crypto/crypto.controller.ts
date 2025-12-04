import { Controller, Get, Param, Query, BadRequestException, ParseIntPipe } from '@nestjs/common';
import { BaseAgentController } from 'src/base-agent/base-agent.controller';
import { CryptoService } from './crypto.service';

@Controller('crypto')
export class CryptoController extends BaseAgentController {
  constructor(private readonly cryptoService: CryptoService) {
    super(cryptoService);
  }
  @Get(':name/metrics')
  async getCryptoMetrics(
    @Param('name') name: string,
    @Query('vs_currency') vs_currency: string,
    @Query('days', ParseIntPipe) days: number,
  ) {
    if (!name) throw new BadRequestException('Path param "name" is required');
    if (!vs_currency) throw new BadRequestException('Query param "vs_currency" is required');
    if (typeof days !== 'number' || isNaN(days)) throw new BadRequestException('Query param "days" must be an integer');

    return await this.cryptoService.getCryptoMetrics({ name, vs_currency, days });
   
  }
}
