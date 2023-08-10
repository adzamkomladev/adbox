import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bull';

import { MikroOrmModule } from '@mikro-orm/nestjs';

import { AuthModule } from '../auth/auth.module';
import { UsersModule } from '../users/users.module';

import {WALLET_TOP_UPS_QUEUE} from "./constants/queues.constant";

import { Wallet } from './entities/wallet.entity';
import { WalletTransaction } from './entities/wallet-transaction.entity';

import { WalletsService } from './wallets.service';

import { WalletTopUpsConsumer } from './consumers/wallet-top-ups.consumer';
import { PaymentCompletedEventListener } from './listeners/payment.completed.listener';

import { WalletsController } from './wallets.controller';

@Module({
  imports: [
    MikroOrmModule.forFeature([Wallet, WalletTransaction]),
    BullModule.registerQueue({
      name: WALLET_TOP_UPS_QUEUE,
    }),
    AuthModule,
    UsersModule,
  ],
  controllers: [WalletsController],
  providers: [
    WalletsService,
    WalletTopUpsConsumer,
    PaymentCompletedEventListener,
  ],
})
export class WalletsModule {}
