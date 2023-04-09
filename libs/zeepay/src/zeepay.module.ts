import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';

import { ZeepayService } from './zeepay.service';

@Module({
  imports: [
    HttpModule.registerAsync({
      useFactory: async (config: ConfigService) => ({
        timeout: config.get('HTTP_TIMEOUT'),
        maxRedirects: config.get('HTTP_MAX_REDIRECTS'),
      }),
      inject: [ConfigService],
    }),
  ],
  providers: [ZeepayService],
  exports: [ZeepayService],
})
export class ZeepayModule {}
