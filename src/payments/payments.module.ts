import { Module } from '@nestjs/common';

import { MikroOrmModule } from '@mikro-orm/nestjs';

import { ZeepayModule } from '@adbox/zeepay';

import { UsersModule } from '../users/users.module';

import { Payment } from './entities/payment.entity';
import { PaymentMethod } from './entities/payment-method.entity';
import { ChannelDetails } from './entities/channel-details.enitty';

import { PaymentsService } from './payments.service';

import { WalletTopUpInitiatedListener } from './listeners/wallet-top-up-initiated.listener';
import { ZeepayWebhookReceivedListener } from './listeners/zeepay-webhook-received.listener';

import { PaymentsController } from './payments.controller';

@Module({
  imports: [
    ZeepayModule,
    UsersModule,
    MikroOrmModule.forFeature([Payment, ChannelDetails, PaymentMethod]),
  ],
  controllers: [PaymentsController],
  providers: [
    PaymentsService,
    WalletTopUpInitiatedListener,
    ZeepayWebhookReceivedListener,
  ],
})
export class PaymentsModule {}
