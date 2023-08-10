import { Injectable, Logger } from '@nestjs/common';
import { CreateCampaignDto } from './dto/create-campaign.dto';
import { UpdateCampaignDto } from './dto/update-campaign.dto';
// import { WalletsService } from '../wallets/wallets.service';

@Injectable()
export class CampaignsService {
  private readonly logger: Logger;

  // constructor(private readonly walletsService: WalletsService) {
  //   this.logger = new Logger(CampaignsService.name);
  // }

  create(userId: string, createCampaignDto: CreateCampaignDto) {

    // const walletBalance = this.walletsService.walletBalance({userId})

    return 'This action adds a new campaign';
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
