import { Injectable, Logger } from '@nestjs/common';
import { CreateCampaignDto } from './dto/create-campaign.dto';
import { UpdateCampaignDto } from './dto/update-campaign.dto';
import { EntityManager, FilterQuery, MikroORM } from '@mikro-orm/core';
import { User } from '../users/entities/user.entity';
import { Campaign } from './entities/campaign.entity';
import { Status } from '../@common/enums/status.enum';
import { AuthenticatedUser } from '../@common/dto/authenticated.user.dto';
import { GetTimelineDto } from './dto/get.timeline.dto';
import { UsersService } from '../users/services/users.service';
// import { WalletsService } from '../wallets/wallets.service';

@Injectable()
export class CampaignsService {
  private readonly logger = new Logger(CampaignsService.name);

  constructor(
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

  async getTimeline(payload: GetTimelineDto, authUser: AuthenticatedUser) {
    const page = payload.page || 1;
    const size = payload.size || 20;

    const user = await this.usersService.findOne(authUser.id);

    const age = (new Date()).getFullYear() - user.dateOfBirth.getFullYear();

    const filter: FilterQuery<Campaign> = {
      status: Status.ACTIVE,
      targetAge: { $lte: age },
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
        }
      }
    );
    const countQuery = this.em.count(
      Campaign,
      filter
    );

    const [data, total] = await Promise.all([dataQuery, countQuery]);

    return {
      data,
      meta: {
        page,
        size,
        total,
        totalPage: Math.ceil(total / size),
      }
    };
  }
}
