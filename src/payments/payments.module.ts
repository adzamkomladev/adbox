import { Module } from '@nestjs/common';

import { ZeepayModule } from '@adbox/zeepay';
import { JunipayModule } from '@adbox/junipay';
import { UtilsModule } from '@adbox/utils';

import { UsersModule } from '../users/users.module';


import { PaymentsService } from './services/payments.service';
import { PaymentMethodsService } from './services/payment-methods.service';

import { WalletTopUpInitiatedListener } from './listeners/wallet-top-up-initiated.listener';
import { ZeepayWebhookReceivedListener } from './listeners/zeepay-webhook-received.listener';

import { PaymentsController } from './payments.controller';

@Module({
  imports: [
    JunipayModule,
    ZeepayModule,
    UtilsModule,
    UsersModule,
  ],
  controllers: [PaymentsController],
  providers: [
    PaymentsService,
    WalletTopUpInitiatedListener,
    ZeepayWebhookReceivedListener,
    PaymentMethodsService,
  ],
  exports: [PaymentMethodsService]
})
export class PaymentsModule { }
