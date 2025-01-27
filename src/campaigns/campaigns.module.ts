import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bullmq';

import { BullBoardModule } from '@bull-board/nestjs';
import { BullMQAdapter } from "@bull-board/api/bullMQAdapter";

import { AuthModule } from '../auth/auth.module';
import { UsersModule } from '../users/users.module';

import { CAMPAIGN_INTERACTION_QUEUE } from './constants/queues.constant';


import { CampaignsService } from './campaigns.service';

import { CampaignGateway } from './gateways/campaign.gateway';

import { CampaignInteractionConsumer } from './consumers/campaign.interaction.consumer';

import { CampaignsController } from './campaigns.controller';
import { CampaignOwnerGuard } from './guards/campaign-owner.guard';

@Module({
  imports: [
    BullModule.registerQueue({
      name: CAMPAIGN_INTERACTION_QUEUE,
    }),
    BullBoardModule.forFeature({
      name: CAMPAIGN_INTERACTION_QUEUE,
      adapter: BullMQAdapter,
    }),
    AuthModule,
    UsersModule
  ],
  controllers: [CampaignsController],
  providers: [CampaignsService, CampaignGateway, CampaignInteractionConsumer, CampaignOwnerGuard]
})
export class CampaignsModule { }
