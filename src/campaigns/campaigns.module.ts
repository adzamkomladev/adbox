import { Module } from '@nestjs/common';

import { MikroOrmModule } from '@mikro-orm/nestjs';

import { Campaign } from './entities/campaign.entity';
import { Interaction } from './entities/interaction.entity';

import { CampaignsService } from './campaigns.service';

import { CampaignsController } from './campaigns.controller';

@Module({
  imports: [MikroOrmModule.forFeature([Campaign, Interaction])],
  controllers: [CampaignsController],
  providers: [CampaignsService]
})
export class CampaignsModule { }
