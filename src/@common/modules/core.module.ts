import { APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';
import { Global, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ScheduleModule } from '@nestjs/schedule';
import { BullModule } from '@nestjs/bull';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import type { RedisClientOptions } from 'redis';

const redisStore = require('cache-manager-redis-store');
import { BullBoardModule } from '@bull-board/nestjs';
import { ExpressAdapter } from '@bull-board/express';

import appConfig from '../configs/app.config';
import dbConfig from '../configs/db.config';
import redisConfig from '../configs/redis.config';
import authConfig from '../configs/auth.config';
import paymentsConfig from '../configs/payments.config';
import notificationsConfig from '../configs/notifications.config';
import throttlerConfig from '../configs/throttler.config';

import { TransformInterceptor } from '../interceptors/transform.interceptor';
import { OtlpLogger } from '../loggers/otlp.logger';
import { CacheModule } from '@nestjs/cache-manager';

@Global()
@Module({
  imports: [
    ConfigModule.forRoot({
      load: [appConfig, dbConfig, redisConfig, authConfig, paymentsConfig, notificationsConfig, throttlerConfig],
      isGlobal: true,
    }),
    ThrottlerModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => config.get<any[]>('throttler.list'),
    }),
    ScheduleModule.forRoot(),

    BullModule.forRootAsync({
      useFactory: async (config: ConfigService) => ({
        redis: {
          host: config.get('redis.host'),
          port: config.get<number>('redis.port'),
        },
      }),
      inject: [ConfigService],
    }),
    BullBoardModule.forRoot({
      route: '/queues',
      adapter: ExpressAdapter,
    }),
    EventEmitterModule.forRoot(),
    CacheModule.registerAsync<RedisClientOptions>({
      useFactory: async (config: ConfigService) => ({
        isGlobal: true,
        store: redisStore,

        // Store-specific configuration:
        host: config.get('redis.host'),
        port: config.get<number>('redis.port'),
      }),
      inject: [ConfigService],

    }),
  ],
  providers: [
    OtlpLogger,
    {
      provide: APP_INTERCEPTOR,
      useClass: TransformInterceptor,
    },
    // {
    //   provide: APP_GUARD,
    //   useClass: ThrottlerGuard
    // }
  ],
  exports: [OtlpLogger, CacheModule]
})
export class CoreModule { }
