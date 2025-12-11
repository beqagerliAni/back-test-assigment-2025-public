import { InjectRepository } from '@nestjs/typeorm';
import { CryptoEntity } from '../entity/crypto.entity';
import { Repository } from 'typeorm';
import { CryptoChartPoint } from '../intrface/crypto.interface';

export class CryptoRepository {
  constructor(
    @InjectRepository(CryptoEntity)
    private cryptoRepository: Repository<CryptoEntity>,
  ) {}
  async saveOfUpdate(cryptoChart: CryptoChartPoint[]) {
    return await this.cryptoRepository
      .createQueryBuilder()
      .insert()
      .into(CryptoEntity)
      .values(cryptoChart)
      .orUpdate(['price', 'marketCap', 'volume'])
      .execute();
  }
  async getData() {
    // so we should get top 10 worst and best prices and give it to the ai
    const data = await this.cryptoRepository.find({
      order: { price: 'ASC' },
      take: 10,
    });
    return {
      worst10: data.slice(0, 10),
      best10: data.slice(-10),
    }
  }
}
