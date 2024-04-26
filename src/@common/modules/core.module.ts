import { APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';
import { Global, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { CacheModule } from '@nestjs/cache-manager';
import { ScheduleModule } from '@nestjs/schedule';
import { BullModule } from '@nestjs/bull';
import { EventEmitterModule } from '@nestjs/event-emitter';


import { BullBoardModule } from '@bull-board/nestjs';
import { ExpressAdapter } from '@bull-board/express';

import appConfig from '../configs/app.config';
import dbConfig from '../configs/db.config';
import redisConfig from '../configs/redis.config';
import authConfig from '../configs/auth.config';
import paymentsConfig from '../configs/payments.config';
import notificationsConfig from '../configs/notifications.config';

import { TransformInterceptor } from '../interceptors/transform.interceptor';

import { KycLevelGuard } from '../../auth/guards/kyc.level.guard';

@Global()
@Module({
  imports: [
    ConfigModule.forRoot({
      load: [appConfig, dbConfig, redisConfig, authConfig, paymentsConfig, notificationsConfig],
      isGlobal: true,
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
  ],
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: TransformInterceptor,
    }
  ],
})
export class CoreModule { }
