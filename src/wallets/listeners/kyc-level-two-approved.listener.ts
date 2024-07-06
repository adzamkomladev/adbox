import { Injectable, Logger } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';

import { CreateRequestContext } from '@mikro-orm/core';

import { KYC_LEVEL_TWO_APPROVED } from '@common/constants/events.constant';

import { KycLevelTwoApprovedEvent } from '../../@common/events';

import { WalletsService } from '../wallets.service';

@Injectable()
export class KycLevelTwoApprovedListener {
    private readonly logger = new Logger(KycLevelTwoApprovedListener.name);

    constructor(private readonly walletsService: WalletsService) { }

    @OnEvent(KYC_LEVEL_TWO_APPROVED, { async: true })
    @CreateRequestContext()
    async handleKycLevelTwoApproved(event: KycLevelTwoApprovedEvent) {
        this.logger.log('DATA RECEIVED', event);

        const { userId } = event;

        await this.walletsService.create({ userId: userId, balance: 0 });

        this.logger.log('HANDLING COMPLETE');
    }
}
