import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { CacheModule } from '@nestjs/cache-manager';

import { RedisClientOptions } from 'redis';
import * as redisStore from 'cache-manager-redis-store';

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
          store: redisStore,
          url: config.get('redis.url'),
        } as RedisClientOptions),
      inject: [ConfigService],
    }),
    HttpModule.registerAsync({
      useFactory: async (config: ConfigService) => ({}),
      inject: [ConfigService],
    }),
  ],
  providers: [ZeepayService],
  exports: [ZeepayService],
})
export class ZeepayModule {}
