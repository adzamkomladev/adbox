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
import { PaymentRepository } from '../../@common/db/repositories';
import { OtlpLogger } from '../../@common/loggers/otlp.logger';

@Injectable()
export class ZeepayWebhookReceivedListener {
  private readonly logger = new OtlpLogger(ZeepayWebhookReceivedListener.name);
  constructor(
    private readonly orm: MikroORM,
    private readonly em: EntityManager,
    private readonly event: EventEmitter2,
    private readonly paymentRepository: PaymentRepository,
  ) {}

  @OnEvent(ZEEPAY_WEBHOOK_RECEIVED, { async: true })
  @CreateRequestContext()
  async handleZeepayWebhookReceivedEvent(event: ZeepayWebhookReceivedEvent) {
    const payment = await this.paymentRepository.updateStatus({ reference: event.payload.reference }, Status.COMPLETED);

    if (!payment) {
      this.logger.debug(`Payment with reference: ${event.payload.reference} failed to update status. Payment could possibly not exist!`);
      return;
    }

    const paymentCompleteEvent = new PaymentCompletedEvent();
    paymentCompleteEvent.paymentId = payment.id;
    paymentCompleteEvent.walletId = payment.walletId;
    paymentCompleteEvent.amount = payment.amount;
    paymentCompleteEvent.activity = payment.activity;

    this.event.emit(PAYMENT_COMPLETED, paymentCompleteEvent);
  }
}
