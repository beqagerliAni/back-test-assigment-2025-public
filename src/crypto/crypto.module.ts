import { Module } from '@nestjs/common';
import { CryptoController } from './crypto.controller';
import { CryptoService } from './crypto.service';
import { OpenaiModule } from 'src/openai/openai.module';
import { CryptoRepository } from './repository/crypto.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CryptoEntity } from './entity/crypto.entity';

@Module({
  imports: [OpenaiModule,TypeOrmModule.forFeature([CryptoEntity])],
  controllers: [CryptoController],
  providers: [CryptoService,CryptoRepository],
})
export class CryptoModule {}
