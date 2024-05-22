import { Module } from '@nestjs/common';

import { MikroOrmModule } from '@mikro-orm/nestjs';

import { AuthModule } from '../auth/auth.module';
import { UsersModule } from '../users/users.module';

import { Campaign } from './entities/campaign.entity';
import { Interaction } from './entities/interaction.entity';

import { CampaignGateway } from './gateways/campaign.gateway';

import { CampaignsService } from './campaigns.service';

import { CampaignsController } from './campaigns.controller';
import { CAMPAIGN_INTERACTION_QUEUE } from './constants/queues.constant';
import { BullModule } from '@nestjs/bull';
import { BullBoardModule } from '@bull-board/nestjs';
import { BullAdapter } from '@bull-board/api/bullAdapter';
import { CampaignInteractionConsumer } from './consumers/campaign.interaction.consumer';

@Module({
  imports: [
    MikroOrmModule.forFeature([Campaign, Interaction]),
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
