import { Module } from '@nestjs/common';

import { MikroOrmModule } from '@mikro-orm/nestjs';

import { Wallet } from './entities/wallet.entity';
import { WalletTransaction } from './entities/wallet-transaction.entity';

import { WalletsService } from './wallets.service';

import { WalletsController } from './wallets.controller';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [MikroOrmModule.forFeature([Wallet, WalletTransaction]), AuthModule],
  controllers: [WalletsController],
  providers: [WalletsService],
})
export class WalletsModule {}
