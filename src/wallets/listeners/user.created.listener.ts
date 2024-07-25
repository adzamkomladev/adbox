import { Injectable, Logger } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';


import { USER_CREATED } from '@common/constants/events.constant';

import { UserCreatedEvent } from '@app/users/events/user.created.event';

import { WalletsService } from '../wallets.service';

@Injectable()
export class UserCreatedListener {
  private readonly logger = new Logger(UserCreatedListener.name);

  constructor(private readonly walletsService: WalletsService) {}

  @OnEvent(USER_CREATED, { async: true })
  async handleUserCreated(event: UserCreatedEvent) {
    this.logger.log('DATA RECEIVED', event);

    const { user } = event;

    await this.walletsService.create({ userId: user.id, balance: 1_000_000 });

    this.logger.log('HANDLING COMPLETE');
  }
}
