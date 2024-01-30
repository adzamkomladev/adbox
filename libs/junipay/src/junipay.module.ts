import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { HttpModule } from '@nestjs/axios';

import { UtilsModule } from '@adbox/utils';

import junipayConfig from './configs/junipay.config';
import redisConfig from './configs/redis.config';

import { JunipayService } from './junipay.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [junipayConfig, redisConfig],
      isGlobal: true,
    }),
    HttpModule.registerAsync({
      useFactory: async (config: ConfigService) => ({
        baseURL: config.get('junipay.baseUrl'),
        headers: {
          clientid: config.get('junipay.clientId'),
          'Content-Type': 'application/json'
        }
      }),
      inject: [ConfigService],
    }),
    UtilsModule],
  providers: [JunipayService],
  exports: [JunipayService],
})
export class JunipayModule { }
