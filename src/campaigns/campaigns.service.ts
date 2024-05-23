import { BadGatewayException, Injectable, Logger } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bull';

import { EntityManager, FilterQuery, MikroORM, wrap } from '@mikro-orm/core';
import { Queue } from 'bull';

import { CAMPAIGN_INTERACTION_QUEUE } from './constants/queues.constant';

import { Status } from '../@common/enums/status.enum';

import { User } from '../users/entities/user.entity';
import { Campaign } from './entities/campaign.entity';
import { Interaction } from './entities/interaction.entity';

import { CreateCampaignDto } from './dto/create-campaign.dto';
import { UpdateCampaignDto } from './dto/update-campaign.dto';
import { AuthenticatedUser } from '../@common/dto/authenticated.user.dto';
import { Campaign as TimelineCampaign, GetTimelineDto, GetTimelineQueryDto } from './dto/get.timeline.dto';
import { InteractWithCampaignDto } from './dto/interact.with.campaign.dto';

import { UsersService } from '../users/services/users.service';
// import { WalletsService } from '../wallets/wallets.service';

@Injectable()
export class CampaignsService {
  private readonly logger = new Logger(CampaignsService.name);

  constructor(
    @InjectQueue(CAMPAIGN_INTERACTION_QUEUE)
    private readonly campaignInteractionQueue: Queue,
    private readonly em: EntityManager,
    private readonly usersService: UsersService
  ) {
  }

  async create(userId: string, payload: CreateCampaignDto) {

    // const walletBalance = this.walletsService.walletBalance({userId})
    // TODO: Perform balance checks

    const user = await this.em.findOneOrFail(User, { id: userId });

    const campaign = this.em.create(Campaign, {
      name: payload.name,
      description: payload.description,
      demographic: 'GH',
      targetAge: payload.targetAge,
      targetReach: payload.targetReach,
      budget: payload.budget * 100,
      start: payload.start,
      end: payload.end,
      status: Status.ACTIVE,
      asset: payload.link,
      user: user,
      perInteractionCost: payload.budget * 100 / payload.targetReach,
    });

    await this.em.persistAndFlush(campaign);

    // TODO: Publish campaign created event

    return campaign;
  }

  findAll() {
    return `This action returns all campaigns`;
  }

  findOne(id: number) {
    return `This action returns a #${id} campaign`;
  }

  update(id: number, updateCampaignDto: UpdateCampaignDto) {
    return `This action updates a #${id} campaign`;
  }

  remove(id: number) {
    return `This action removes a #${id} campaign`;
  }

  async getTimeline(payload: GetTimelineQueryDto, authUser: AuthenticatedUser): Promise<GetTimelineDto> {
    const page = payload.page || 1;
    const size = payload.size || 20;

    const user = await this.usersService.findOne(authUser.id);

    const filter: FilterQuery<Campaign> = {
      status: Status.ACTIVE,
      targetAge: { $lte: user.age },
      demographic: user.kyc?.country
    };

    const dataQuery = this.em.findAll(
      Campaign,
      {
        where: filter,
        offset: size * (page - 1),
        limit: size,
        orderBy: {
          createdAt: 'desc'
        },
        fields: ['id', 'name', 'description', 'asset', 'status', 'start', 'end']
      }
    );
    const countQuery = this.em.count(
      Campaign,
      filter
    );

    const [data, total] = await Promise.all([dataQuery, countQuery]);

    return {
      data: data as TimelineCampaign[],
      meta: {
        page,
        size,
        total,
        totalPage: Math.ceil(total / size),
      }
    };
  }

  async interactWithCampaign(campaignId: string, payload: InteractWithCampaignDto, authUser: AuthenticatedUser) {

    const campaign = await this.em.findOneOrFail(Campaign, { id: campaignId });

    const interaction = await this.saveInteraction(payload, campaign, authUser);

    await this.campaignInteractionQueue.add({ interactionId: interaction.id });

    return interaction;
  }

  private async saveInteraction(payload: InteractWithCampaignDto, campaign: Campaign, authUser: AuthenticatedUser) {
    let interaction = await this.em.findOne(
      Interaction,
      {
        user: {
          id: authUser.id
        },
        campaign: {
          id: campaign.id
        }
      }
    );

    if (!interaction) {
      interaction = this.em.create(Interaction, {
        campaign,
        user: this.em.getReference(User, authUser.id),
        liked: !!payload.toggleLike,
        views: payload.view ? 1 : 0,
        credit: payload.view ? campaign.perInteractionCost : 0,
      });
    }

    if (interaction) {
      if (payload.toggleLike) {
        interaction = this.likeInteraction(interaction);
      }

      if (payload.view) {
        interaction = this.viewInteraction(interaction, campaign.perInteractionCost);
      }
    }

    this.em.persistAndFlush(interaction);

    return interaction;
  }

  private likeInteraction(interaction: Interaction) {
    wrap(interaction).assign({
      liked: !interaction.liked
    });

    return interaction;
  }

  private viewInteraction(interaction: Interaction, perInteractionCost: number) {
    wrap(interaction).assign({
      views: interaction.views + 1,
      credit: interaction.views === 0 ? perInteractionCost : interaction.credit
    });

    return interaction;
  }
}
