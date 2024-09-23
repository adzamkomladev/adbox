import { Injectable } from '@nestjs/common';
import { EventEmitter2, OnEvent } from '@nestjs/event-emitter';

import { CreateRequestContext, MikroORM } from '@mikro-orm/core';
import { EntityManager } from '@mikro-orm/postgresql';

import { Activity } from '../enums/activity.enum';

import { PAYMENT_COMPLETED } from '@common/constants/events.constant';

import { PaymentCompletedEvent } from '@app/payments/events/payment-completed.event';

import { WalletRepository } from '@common/db/repositories';

import { OtlpLogger } from '@common/loggers/otlp.logger';

@Injectable()
export class PaymentCompletedEventListener {
  private readonly logger = new OtlpLogger(PaymentCompletedEventListener.name);

  constructor(
    private readonly orm: MikroORM,
    private readonly em: EntityManager,
    private readonly event: EventEmitter2,
    private readonly walletRepository: WalletRepository
  ) {
  }

  @OnEvent(PAYMENT_COMPLETED, { async: true })
  @CreateRequestContext()
  async handlePaymentCompletedEvent(event: PaymentCompletedEvent) {
    if (event.activity === Activity.WALLET_TOP_UP) {
      const res = await this.walletRepository.topUpWallet(
        event.walletId, event.amount, 0, `Wallet top up of ${event.amount} GHS`, event.paymentId
      );

      if (!res) {
        this.logger.debug(`Failed to complete wallet top up payment of amount: GHS ${event.amount} unto wallet with wallet id: ${event.walletId}`);
        return;
      }
    }

    // TODO: Send out event that the wallet has been topped up successfully
  }
}
