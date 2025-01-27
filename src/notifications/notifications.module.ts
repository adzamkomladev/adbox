import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { CacheModule } from '@nestjs/cache-manager';

import { createKeyv } from '@keyv/redis';
import { Keyv } from 'keyv';
import { CacheableMemory } from 'cacheable';

import { ArkeselModule } from '@adbox/arkesel';

import { OtpService } from './services/otp.service';

@Module({
  imports: [
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
    ArkeselModule
  ],
  providers: [OtpService],
  exports: [OtpService],
})
export class NotificationsModule { }
