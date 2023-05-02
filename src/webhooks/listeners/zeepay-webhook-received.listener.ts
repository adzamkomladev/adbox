import { Injectable } from '@nestjs/common';
import { EntityRepository, UseRequestContext } from '@mikro-orm/core';
import { OnEvent } from '@nestjs/event-emitter';

import { InjectRepository } from '@mikro-orm/nestjs';

import { Service } from '../../@common/enums/service.enum';

import { ZEEPAY_WEBHOOK_RECEIVED } from '../../@common/constants/events.constant';

import { Webhook } from '../entities/webhook.entity';

@Injectable()
export class ZeepayWebhookReceivedListener {
  constructor(
    @InjectRepository(Webhook)
    private readonly webhookRepository: EntityRepository<Webhook>,
  ) {}

  @OnEvent(ZEEPAY_WEBHOOK_RECEIVED, { async: true })
  @UseRequestContext()
  async handleZeepayWebhookReceivedEvent(event: any) {
    const webhook = this.webhookRepository.create({
      data: event.payload,
      service: Service.ZEEPAY,
    });

    await this.webhookRepository.persistAndFlush(webhook);
  }
}
