import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';


import { InjectRepository } from '@mikro-orm/nestjs';
import { EntityRepository, CreateRequestContext, MikroORM } from '@mikro-orm/core';
import { EntityManager } from '@mikro-orm/postgresql';


import { Service } from '../../@common/enums/service.enum';

import { ZEEPAY_WEBHOOK_RECEIVED } from '../../@common/constants/events.constant';

import { Webhook } from '../entities/webhook.entity';

@Injectable()
export class ZeepayWebhookReceivedListener {
  constructor(
    private readonly orm: MikroORM,
    private readonly em: EntityManager,
    @InjectRepository(Webhook)
    private readonly webhookRepository: EntityRepository<Webhook>,
  ) {}

  @OnEvent(ZEEPAY_WEBHOOK_RECEIVED, { async: true })
  @CreateRequestContext()
  async handleZeepayWebhookReceivedEvent(event: any) {
    const webhook = this.webhookRepository.create({
      data: event.payload,
      service: Service.ZEEPAY,
    });

    await this.em.persistAndFlush(webhook);
  }
}
