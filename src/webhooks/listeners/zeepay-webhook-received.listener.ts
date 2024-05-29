import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';

import { CreateRequestContext, MikroORM } from '@mikro-orm/core';
import { EntityManager } from '@mikro-orm/postgresql';

import { Service } from '../../@common/enums/service.enum';

import { ZEEPAY_WEBHOOK_RECEIVED } from '../../@common/constants/events.constant';

import { Webhook } from '../../@common/db/entities';


@Injectable()
export class ZeepayWebhookReceivedListener {
  constructor(
    private readonly orm: MikroORM,
    private readonly em: EntityManager,
  ) { }

  @OnEvent(ZEEPAY_WEBHOOK_RECEIVED, { async: true })
  @CreateRequestContext()
  async handleZeepayWebhookReceivedEvent(event: any) {
    const webhook = this.em.create(Webhook, {
      data: event.payload,
      service: Service.ZEEPAY,
    });

    await this.em.persistAndFlush(webhook);
  }
}
