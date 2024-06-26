import { Global, Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { MikroOrmModule } from '@mikro-orm/nestjs';

import { Campaign, Interaction, Role, User, Webhook } from '../db/entities';

import { CampaignRepository, InteractionRepository, RoleRepository, UserRepository } from '../db/repositories';

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
      Interaction
    ])
  ],
  providers: [UserRepository, RoleRepository, CampaignRepository, InteractionRepository],
  exports: [UserRepository, RoleRepository, CampaignRepository, InteractionRepository]
})
export class DbModule { }
