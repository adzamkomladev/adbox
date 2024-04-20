import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { ConfigModule, ConfigService } from '@nestjs/config';

import arkeselConfig from './configs/arkesel.config';

import { OtpService } from './services/otp.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [arkeselConfig],
      isGlobal: true,
    }),
    HttpModule.registerAsync({
      useFactory: async (config: ConfigService) => ({
        baseURL: config.get('arkesel.baseUrl'),
        headers: {
          "api-key": config.get('arkesel.key'),
          'Content-Type': 'application/json'
        }
      }),
      inject: [ConfigService],
    }),
  ],
  providers: [OtpService],
  exports: [OtpService],
})
export class ArkeselModule { }
