import { Module } from '@nestjs/common';

import { MikroOrmModule } from '@mikro-orm/nestjs';

import { ZeepayModule } from '@adbox/zeepay';
import { UtilsModule } from '@adbox/utils';

import { UsersModule } from '../users/users.module';

import { Payment } from './entities/payment.entity';
import { PaymentMethod } from './entities/payment-method.entity';
import { ChannelDetails } from './entities/channel-details.enitty';

import { PaymentsService } from './services/payments.service';
import { PaymentMethodsService } from './services/payment-methods.service';

import { WalletTopUpInitiatedListener } from './listeners/wallet-top-up-initiated.listener';
import { ZeepayWebhookReceivedListener } from './listeners/zeepay-webhook-received.listener';

import { PaymentsController } from './payments.controller';

@Module({
  imports: [
    MikroOrmModule.forFeature([Payment, ChannelDetails, PaymentMethod]),
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
