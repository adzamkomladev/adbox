import { Module } from '@nestjs/common';

import { MikroOrmModule } from '@mikro-orm/nestjs';

import { ZeepayModule } from '@adbox/zeepay';
import { JunipayModule } from '@adbox/junipay';
import { UtilsModule } from '@adbox/utils';

import { UsersModule } from '../users/users.module';

import { Payment, PaymentMethod, ChannelDetails } from '../@common/db/entities';

import { PaymentsService } from './services/payments.service';
import { PaymentMethodsService } from './services/payment-methods.service';

import { WalletTopUpInitiatedListener } from './listeners/wallet-top-up-initiated.listener';
import { ZeepayWebhookReceivedListener } from './listeners/zeepay-webhook-received.listener';

import { PaymentsController } from './payments.controller';

@Module({
  imports: [
    MikroOrmModule.forFeature([Payment, ChannelDetails, PaymentMethod]),
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
