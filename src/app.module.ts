import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { OpenaiModule } from './openai/openai.module';
import { CryptoModule } from './crypto/crypto.module';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [ConfigModule.forRoot(), 
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: 'crypto-data.sqlite',
      autoLoadEntities: true,
      synchronize: true,
    }), OpenaiModule, CryptoModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
