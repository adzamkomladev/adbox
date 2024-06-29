import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bull';

import { Queue } from 'bull';

import { CAMPAIGN_INTERACTION_QUEUE } from './constants/queues.constant';

import { CreateCampaignDto } from './dto/create-campaign.dto';
import { UpdateCampaignDto } from './dto/update-campaign.dto';
import { AuthenticatedUser } from '../@common/dto/authenticated.user.dto';
import { GetTimelineDto, GetTimelineQueryDto } from './dto/get.timeline.dto';
import { InteractWithCampaignDto } from './dto/interact.with.campaign.dto';

import { CampaignRepository, InteractionRepository } from '../@common/db/repositories';
import { GetCreatedCampaignsDto, GetCreatedCampaignsQueryDto } from './dto/get-created-campaigns.dto';

@Injectable()
export class CampaignsService {
  private readonly logger = new Logger(CampaignsService.name);

  constructor(
    @InjectQueue(CAMPAIGN_INTERACTION_QUEUE)
    private readonly campaignInteractionQueue: Queue,
    private readonly campaignRepository: CampaignRepository,
    private readonly interactionRepository: InteractionRepository,
  ) { }

  async create(userId: string, payload: CreateCampaignDto) {

    // const walletBalance = this.walletsService.walletBalance({userId})

    const campaign = await this.campaignRepository.create(userId, payload);

    if (!campaign) throw new BadRequestException('failed to create campaign');

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
    const timeline = await this.campaignRepository.getUserTimeline(authUser.id, payload);

    if (!timeline) throw new BadRequestException('failed to get user timeline');

    return timeline;
  }

  async interactWithCampaign(campaignId: string, payload: InteractWithCampaignDto, authUser: AuthenticatedUser) {
    const res = await this.interactionRepository.saveInteraction(authUser.id, campaignId, payload);

    if (!res) throw new BadRequestException('failed to interact with campaign');

    const { campaign, interaction } = res;

    await this.campaignInteractionQueue.add({ campaignId: campaign.id });

    return interaction;
  }

  async getCreatedCampaigns(payload: GetCreatedCampaignsQueryDto, authUser: AuthenticatedUser): Promise<GetCreatedCampaignsDto> {
    const timeline = await this.campaignRepository.getCreatedCampaigns(authUser.id, payload);

    if (!timeline) throw new BadRequestException('failed to get created campaigns');

    return timeline;
  }

  async pauseCampaign(campaignId: string, authUser: AuthenticatedUser) {
    const campaign = await this.campaignRepository.pauseCampaign(campaignId, authUser.id);

    if (!campaign) throw new Error(`failed to retrieve campaign with id: ${campaignId} and status: active`);
  }

  async unPauseCampaign(campaignId: string, authUser: AuthenticatedUser) {
    const campaign = await this.campaignRepository.unPauseCampaign(campaignId, authUser.id);

    if (!campaign) throw new Error(`failed to retrieve campaign with id: ${campaignId} and status: paused`);
  }

  async stopCampaign(campaignId: string, authUser: AuthenticatedUser) {
    const campaign = await this.campaignRepository.stopCampaign(campaignId, authUser.id);

    if (!campaign) throw new Error(`failed to retrieve campaign with id: ${campaignId} and status: active or paused`);

    // CAMPAIGN STOPPED EVENT EMITTED OR QUEUED
  }

  async checkIfCampaignBelongsToUser(campaignId: string, authUser: AuthenticatedUser) {
    const campaign = await this.campaignRepository.findOneByIdAndOwner(campaignId, authUser.id);

    return !!campaign;
  }
}
