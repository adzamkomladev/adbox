import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ScheduleModule } from '@nestjs/schedule';

import appConfig from '../configs/app.config';
import { BullModule } from '@nestjs/bull';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [appConfig],
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
  ],
})
export class CoreModule {}
