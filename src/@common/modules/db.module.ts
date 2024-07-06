import { Global, Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { MikroOrmModule } from '@mikro-orm/nestjs';

import { Campaign, Interaction, Role, User, Wallet, WalletTransaction, WalletTransactionChange, Webhook } from '../db/entities';

import { CampaignRepository, InteractionRepository, RoleRepository, UserRepository, WalletRepository } from '../db/repositories';

@Global()
@Module({
  imports: [
    MikroOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: async (config: ConfigService) => ({
        ...config.get('db'),
      }),
    }),
    MikroOrmModule.forFeature([
      User,
      Role,
      Webhook,
      Campaign,
      Interaction,
      Wallet,
      WalletTransaction,
      WalletTransactionChange
    ])
  ],
  providers: [UserRepository, RoleRepository, CampaignRepository, InteractionRepository, WalletRepository],
  exports: [UserRepository, RoleRepository, CampaignRepository, InteractionRepository, WalletRepository]
})
export class DbModule { }
