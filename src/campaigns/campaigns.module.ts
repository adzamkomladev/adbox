import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bull';

import { BullBoardModule } from '@bull-board/nestjs';
import { BullAdapter } from '@bull-board/api/bullAdapter';

import { AuthModule } from '../auth/auth.module';
import { UsersModule } from '../users/users.module';

import { CAMPAIGN_INTERACTION_QUEUE } from './constants/queues.constant';


import { CampaignsService } from './campaigns.service';

import { CampaignGateway } from './gateways/campaign.gateway';

import { CampaignInteractionConsumer } from './consumers/campaign.interaction.consumer';

import { CampaignsController } from './campaigns.controller';

@Module({
  imports: [
    BullModule.registerQueue({
      name: CAMPAIGN_INTERACTION_QUEUE,
    }),
    BullBoardModule.forFeature({
      name: CAMPAIGN_INTERACTION_QUEUE,
      adapter: BullAdapter,
    }),
    AuthModule,
    UsersModule
  ],
  controllers: [CampaignsController],
  providers: [CampaignsService, CampaignGateway, CampaignInteractionConsumer]
})
export class CampaignsModule { }
