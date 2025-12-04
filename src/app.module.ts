import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { OpenaiModule } from './openai/openai.module';
import { CryptoModule } from './crypto/crypto.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [ConfigModule.forRoot(), OpenaiModule, CryptoModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
