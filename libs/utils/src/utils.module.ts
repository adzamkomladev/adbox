import { Module } from '@nestjs/common';

import { PhoneService } from '@adbox/utils/services';

@Module({
  providers: [ PhoneService],
  exports: [PhoneService],
})
export class UtilsModule {}
