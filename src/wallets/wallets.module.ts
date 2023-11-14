import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bull';

import { MikroOrmModule } from '@mikro-orm/nestjs';
import { BullBoardModule } from '@bull-board/nestjs';
import { BullAdapter } from '@bull-board/api/bullAdapter';

import { AuthModule } from '../auth/auth.module';
import { UsersModule } from '../users/users.module';
import { PaymentsModule } from '../payments/payments.module';

import { WALLET_TOP_UPS_QUEUE, WALLET_WITHDRAWALS_QUEUE } from './constants/queues.constant';

import { Wallet } from './entities/wallet.entity';
import { WalletTransaction } from './entities/wallet-transaction.entity';

import { WalletsService } from './wallets.service';

import { WalletTopUpsConsumer } from './consumers/wallet-top-ups.consumer';
import { PaymentCompletedEventListener } from './listeners/payment.completed.listener';
import { UserCreatedListener } from './listeners/user.created.listener';

import { WalletsController } from './wallets.controller';

@Module({
  imports: [
    MikroOrmModule.forFeature([Wallet, WalletTransaction]),
    BullModule.registerQueue({
      name: WALLET_TOP_UPS_QUEUE,
    }),
    BullModule.registerQueue({
      name: WALLET_WITHDRAWALS_QUEUE,
    }),
    BullBoardModule.forFeature({
      name: WALLET_TOP_UPS_QUEUE,
      adapter: BullAdapter,
    }),
    BullBoardModule.forFeature({
      name: WALLET_WITHDRAWALS_QUEUE,
      adapter: BullAdapter,
    }),
    AuthModule,
    UsersModule,
    PaymentsModule
  ],
  controllers: [WalletsController],
  providers: [
    WalletsService,
    WalletTopUpsConsumer,
    PaymentCompletedEventListener,
    UserCreatedListener,
  ],
})
export class WalletsModule { }
