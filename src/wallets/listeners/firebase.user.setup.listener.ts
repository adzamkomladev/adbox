import { Injectable, Logger } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';

import { CreateRequestContext } from '@mikro-orm/core';

import { FIREBASE_USER_SETUP } from '@common/constants/events.constant';

import { FirebaseUserSetupEvent } from '@app/users/events/firebase-user-setup.event';

import { WalletsService } from '../wallets.service';

@Injectable()
export class FirebaseUserSetupListener {
  private readonly logger = new Logger(FirebaseUserSetupListener.name);

  constructor(private readonly walletsService: WalletsService) {}

  @OnEvent(FIREBASE_USER_SETUP, { async: true })
  @CreateRequestContext()
  async handleFirebaseUserSetup(event: FirebaseUserSetupEvent) {
    this.logger.log('DATA RECEIVED', event);

    const { hasWallet, walletBalance, userId } = event;

    if (!hasWallet) {
      await this.walletsService.create({ userId, balance: walletBalance || 0 });
    }

    this.logger.log('HANDLING COMPLETE');
  }
}
