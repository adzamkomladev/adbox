import { Global, Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { MikroOrmModule } from '@mikro-orm/nestjs';
import { UtilsModule } from '@adbox/utils';

import { Campaign, ChannelDetails, Interaction, Payment, PaymentMethod, Role, User, Wallet, WalletTransaction, WalletTransactionChange, Webhook } from '../db/entities';

import { CampaignRepository, InteractionRepository, PaymentRepository, RoleRepository, UserRepository, WalletRepository, WalletTransactionRepository } from '../db/repositories';

@Global()
@Module({
  imports: [
    UtilsModule,
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
      WalletTransactionChange,
      Payment,
      ChannelDetails,
      PaymentMethod
    ])
  ],
  providers: [
    UserRepository,
    RoleRepository,
    CampaignRepository,
    InteractionRepository,
    WalletRepository,
    WalletTransactionRepository,
    PaymentRepository
  ],
  exports: [
    UserRepository,
    RoleRepository,
    CampaignRepository,
    InteractionRepository,
    WalletRepository,
    WalletTransactionRepository,
    PaymentRepository
  ]
})
export class DbModule { }
