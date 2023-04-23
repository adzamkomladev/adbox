import { Module } from '@nestjs/common';

import { ZeepayModule } from '@adbox/zeepay';

import { UsersModule } from '../users/users.module';

import { PaymentsService } from './payments.service';

import { PaymentsController } from './payments.controller';

@Module({
  imports: [ZeepayModule, UsersModule],
  controllers: [PaymentsController],
  providers: [PaymentsService],
})
export class PaymentsModule {}
