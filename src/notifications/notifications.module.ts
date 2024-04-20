import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { CacheModule } from '@nestjs/cache-manager';

import type { RedisClientOptions } from 'redis';
import * as redisStore from 'cache-manager-redis-store';

import { ArkeselModule } from '@adbox/arkesel';

import { OtpService } from './services/otp.service';

@Module({
  imports: [
    CacheModule.registerAsync<RedisClientOptions>({
      useFactory: async (config: ConfigService) =>
      ({
        isGlobal: true,
        store: redisStore.redisStore as any,
        url: config.get('redis.url'),
      } as RedisClientOptions),
      inject: [ConfigService],
    }),
    ArkeselModule
  ],
  providers: [OtpService],
  exports: [OtpService],
})
export class NotificationsModule { }
