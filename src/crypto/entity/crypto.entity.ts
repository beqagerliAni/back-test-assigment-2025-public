import { BaseEntity } from 'src/shared/util/baseEntity/baseEntity';
import { Entity, Column, Index } from 'typeorm';

@Entity()
export class CryptoEntity extends BaseEntity {

  @Column()
  time: string

  @Column('float')
  // add index on price so we can find crypto faster
  // user moslty seach crypto with prices
  @Index()
  price: number;

  @Column('float')
  marketCap: number;

  @Column('float')
  volume: number;
}
