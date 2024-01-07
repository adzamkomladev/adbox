import { Module } from '@nestjs/common';

import { UtilsModule } from '@adbox/utils';

import { JunipayService } from './junipay.service';

@Module({
  imports: [UtilsModule],
  providers: [JunipayService],
  exports: [JunipayService],
})
export class JunipayModule { }
