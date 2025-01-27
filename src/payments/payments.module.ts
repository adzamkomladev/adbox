import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bullmq';

import { BullBoardModule } from '@bull-board/nestjs';
import { BullMQAdapter } from '@bull-board/api/bullMQAdapter';

import { ZeepayModule } from '@adbox/zeepay';
import { JunipayModule } from '@adbox/junipay';
import { PaystackModule } from '@adbox/paystack';
import { UtilsModule } from '@adbox/utils';

import { UsersModule } from '../users/users.module';

import { PROCESS_PAYMENT_QUEUE } from './constants/queues.constant';

import { PaymentsService } from './services/payments.service';
import { PaymentMethodsService } from './services/payment-methods.service';

import { ProcessPaymentConsumer } from './consumers/process-payment.consumer';

import { WalletTopUpInitiatedListener } from './listeners/wallet-top-up-initiated.listener';
import { ZeepayWebhookReceivedListener } from './listeners/zeepay-webhook-received.listener';
import { PaystackWebhookReceivedListener } from './listeners/paystack-webhook-received.listener';

import { PaymentsController } from './payments.controller';


@Module({
  imports: [
    JunipayModule,
    ZeepayModule,
    PaystackModule,
    UtilsModule,
    UsersModule,
    BullModule.registerQueue({
      name: PROCESS_PAYMENT_QUEUE,
    }),
    BullBoardModule.forFeature({
      name: PROCESS_PAYMENT_QUEUE,
      adapter: BullMQAdapter,
    }),
  ],
  controllers: [PaymentsController],
  providers: [
    PaymentsService,
    WalletTopUpInitiatedListener,
    ZeepayWebhookReceivedListener,
    PaystackWebhookReceivedListener,
    ProcessPaymentConsumer,
    PaymentMethodsService,
  ],
  exports: [PaymentMethodsService]
})
export class PaymentsModule { }
