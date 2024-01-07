import { Module } from '@nestjs/common';

import { PhoneService } from '@adbox/utils/services';
import { TokenService } from './services/token.service';

@Module({
  providers: [PhoneService, TokenService],
  exports: [PhoneService, TokenService],
})
export class UtilsModule { }
