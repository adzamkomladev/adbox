import { Module } from '@nestjs/common';
import { JunipayService } from './junipay.service';

@Module({
  providers: [JunipayService],
  exports: [JunipayService],
})
export class JunipayModule {}
