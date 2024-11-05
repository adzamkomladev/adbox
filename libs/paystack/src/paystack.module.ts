import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { HttpModule } from '@nestjs/axios';

import paystackConfig from './configs/paystack.config';
import redisConfig from './configs/redis.config';

import { PaystackService } from './paystack.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [paystackConfig, redisConfig],
      isGlobal: true,
    }),
    HttpModule.registerAsync({
      useFactory: async (config: ConfigService) => ({
        baseURL: config.get('paystack.baseUrl'),
        headers: {
          Authorization: `Bearer ${config.get('paystack.secretKey')}`,
          'Content-Type': 'application/json',
        }
      }),
      inject: [ConfigService],
    }),
  ],
  providers: [PaystackService],
  exports: [PaystackService],
})
export class PaystackModule { }
