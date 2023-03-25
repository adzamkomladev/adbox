import { Module } from '@nestjs/common';

import { MikroOrmModule } from '@mikro-orm/nestjs';

import { Wallet } from './entities/wallet.entity';
import { WalletTransaction } from './entities/wallet-transaction.entity';

import { WalletsService } from './wallets.service';

import { WalletsController } from './wallets.controller';

@Module({
  imports: [MikroOrmModule.forFeature([Wallet, WalletTransaction])],
  controllers: [WalletsController],
  providers: [WalletsService],
})
export class WalletsModule {}
