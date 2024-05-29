import { Injectable } from '@nestjs/common';
import { EventEmitter2, OnEvent } from '@nestjs/event-emitter';

import { InjectRepository } from '@mikro-orm/nestjs';
import { EntityRepository, CreateRequestContext, wrap, MikroORM } from '@mikro-orm/core';
import { EntityManager } from '@mikro-orm/postgresql';

import { Status } from '../../@common/enums/status.enum';

import {
  PAYMENT_COMPLETED,
  ZEEPAY_WEBHOOK_RECEIVED,
} from '../../@common/constants/events.constant';

import { Payment } from '../../@common/db/entities/payments/payment.entity';

import { ZeepayWebhookReceivedEvent } from '../../webhooks/events/zeepay-webhook-received.event';
import { PaymentCompletedEvent } from '../events/payment-completed.event';

@Injectable()
export class ZeepayWebhookReceivedListener {
  constructor(
    private readonly orm: MikroORM,
    private readonly em: EntityManager,
    private readonly event: EventEmitter2,
    @InjectRepository(Payment)
    private readonly paymentRepository: EntityRepository<Payment>,
  ) {}

  @OnEvent(ZEEPAY_WEBHOOK_RECEIVED, { async: true })
  @CreateRequestContext()
  async handleZeepayWebhookReceivedEvent(event: ZeepayWebhookReceivedEvent) {
    const payment = await this.paymentRepository.findOne({
      reference: event.payload.reference,
    });

    if (!payment) {
      return;
    }

    wrap(payment).assign({ status: Status.COMPLETED });

    await this.em.flush();

    const paymentCompleteEvent = new PaymentCompletedEvent();
    paymentCompleteEvent.paymentId = payment.id;
    paymentCompleteEvent.walletId = payment.walletId;
    paymentCompleteEvent.amount = payment.amount;
    paymentCompleteEvent.activity = payment.activity;

    this.event.emit(PAYMENT_COMPLETED, paymentCompleteEvent);
  }
}
