import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { CacheModule } from '@nestjs/cache-manager';

import { createKeyv } from '@keyv/redis';
import { Keyv } from 'keyv';
import { CacheableMemory } from 'cacheable';

import zeepayConfig from './configs/zeepay.config';
import redisConfig from './configs/redis.config';

import { ZeepayService } from './zeepay.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [zeepayConfig, redisConfig],
      isGlobal: true,
    }),
    CacheModule.registerAsync({
      useFactory: async (config: ConfigService) => {
        return {
          stores: [
            new Keyv({
              store: new CacheableMemory({ ttl: 60000, lruSize: 5000 }),
            }),
            createKeyv(config.get('redis.url')),
          ],
        };
      },
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
