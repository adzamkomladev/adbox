import { Injectable, Logger } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';

import { CreateRequestContext } from '@mikro-orm/core';

import { CAMPAIGN_CREATED } from '@common/constants/events.constant';

import { CampaignCreatedEvent } from '../../@common/events';

import { WalletRepository } from '../../@common/db/repositories';

@Injectable()
export class CampaignCreatedListener {
    private readonly logger = new Logger(CampaignCreatedListener.name);

    constructor(private readonly walletRepository: WalletRepository) { }

    @OnEvent(CAMPAIGN_CREATED, { async: true })
    @CreateRequestContext()
    async handleCampaignCreated(event: CampaignCreatedEvent) {
        this.logger.log('DATA RECEIVED', event);

        const { transactionId, campaignId } = event;

        const res = await this.walletRepository.linkTransaction(transactionId, campaignId);

        if (!res) this.logger.error(`Failed to link campaign with id ${campaignId} to transaction with id ${transactionId}`);

        this.logger.log('HANDLING COMPLETE');
    }
}
