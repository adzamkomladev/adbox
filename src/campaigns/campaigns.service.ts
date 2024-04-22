import { Injectable, Logger } from '@nestjs/common';
import { CreateCampaignDto } from './dto/create-campaign.dto';
import { UpdateCampaignDto } from './dto/update-campaign.dto';
import { EntityManager, MikroORM } from '@mikro-orm/core';
import { User } from '../users/entities/user.entity';
import { Campaign } from './entities/campaign.entity';
import { Status } from '../@common/enums/status.enum';
// import { WalletsService } from '../wallets/wallets.service';

@Injectable()
export class CampaignsService {
  private readonly logger = new Logger(CampaignsService.name);

  constructor(
    private readonly orm: MikroORM,
    private readonly em: EntityManager,
  ) {
    this.logger = new Logger(CampaignsService.name);
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
}
