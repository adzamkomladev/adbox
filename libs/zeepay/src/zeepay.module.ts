import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { CacheModule } from '@nestjs/cache-manager';

import { RedisClientOptions } from 'redis';
const redisStore = require('cache-manager-redis-store').redisStore;

import zeepayConfig from './configs/zeepay.config';
import redisConfig from './configs/redis.config';

import { ZeepayService } from './zeepay.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [zeepayConfig, redisConfig],
      isGlobal: true,
    }),
    CacheModule.registerAsync<RedisClientOptions>({
      useFactory: async (config: ConfigService) =>
      ({
        store: redisStore as any,
        url: config.get('redis.url'),
      } as RedisClientOptions),
      inject: [ConfigService],
    }),
    HttpModule.registerAsync({
      useFactory: async (config: ConfigService) => ({
        baseURL: config.get('zeepay.baseUrl')
      }),
      inject: [ConfigService],
    }),
  ],
  providers: [ZeepayService],
  exports: [ZeepayService],
})
export class ZeepayModule { }
