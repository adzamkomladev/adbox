import { CacheModule, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ScheduleModule } from '@nestjs/schedule';
import { BullModule } from '@nestjs/bull';
import { EventEmitterModule } from '@nestjs/event-emitter';

import type { RedisClientOptions } from 'redis';
import * as redisStore from 'cache-manager-redis-store';

import appConfig from '../configs/app.config';
import dbConfig from '../configs/db.config';
import redisConfig from '../configs/redis.config';
import authConfig from '../configs/auth.config';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [appConfig, dbConfig, redisConfig, authConfig],
      isGlobal: true,
    }),
    ScheduleModule.forRoot(),
    CacheModule.registerAsync<RedisClientOptions>({
      useFactory: async (config: ConfigService) =>
        ({
          store: redisStore,
          url: config.get('redis.url'),
        } as RedisClientOptions),
      inject: [ConfigService],
    }),
    BullModule.forRootAsync({
      useFactory: async (config: ConfigService) => ({
        redis: {
          host: config.get('redis.host'),
          port: config.get<number>('redis.port'),
        },
      }),
      inject: [ConfigService],
    }),
    EventEmitterModule.forRoot(),
  ],
})
export class CoreModule {}
