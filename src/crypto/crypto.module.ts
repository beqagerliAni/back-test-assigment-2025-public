import { Module } from '@nestjs/common';
import { CryptoController } from './crypto.controller';
import { CryptoService } from './crypto.service';
import { OpenaiModule } from 'src/openai/openai.module';

@Module({
  imports: [OpenaiModule],
  controllers: [CryptoController],
  providers: [CryptoService],
})
export class CryptoModule {}
