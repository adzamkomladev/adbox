import { Injectable, Logger } from '@nestjs/common';
import { EventEmitter2, OnEvent } from '@nestjs/event-emitter';

import { InjectRepository } from '@mikro-orm/nestjs';
import { EntityRepository, CreateRequestContext, wrap, MikroORM } from '@mikro-orm/core';
import { EntityManager } from '@mikro-orm/postgresql';

import { TransactionType } from '../enums/transaction-type.enum';
import { Status } from '../../@common/enums/status.enum';
import { Activity } from '../enums/activity.enum';

import { PAYMENT_COMPLETED } from '../../@common/constants/events.constant';

import { Wallet } from '../entities/wallet.entity';
import { WalletTransaction } from '../entities/wallet-transaction.entity';

import { PaymentCompletedEvent } from '../../payments/events/payment-completed.event';

@Injectable()
export class PaymentCompletedEventListener {
  private readonly logger: Logger;

  constructor(
    private readonly orm: MikroORM,
    private readonly em: EntityManager,
    private readonly event: EventEmitter2,
    @InjectRepository(Wallet)
    private readonly walletRepository: EntityRepository<Wallet>,
    @InjectRepository(WalletTransaction)
    private readonly walletTransactionRepository: EntityRepository<WalletTransaction>,
  ) {
    this.logger = new Logger(PaymentCompletedEventListener.name);
  }

  @OnEvent(PAYMENT_COMPLETED, { async: true })
  @CreateRequestContext()
  async handlePaymentCompletedEvent(event: PaymentCompletedEvent) {
    if (event.activity === Activity.WALLET_TOP_UP) {
      await this.topUpWallet(event);
      return;
    }

    // TODO: Send out event that the wallet has been topped up successfully
  }

  private async topUpWallet(event: PaymentCompletedEvent) {
    const wallet = await this.walletRepository.findOne({
      id: event.walletId,
    });

    const walletTransaction = this.walletTransactionRepository.create({
      amount: event.amount,
      before: wallet.balance,
      after: wallet.balance + event.amount,
      type: TransactionType.CREDIT,
      status: Status.COMPLETED,
      description: `Wallet top up of ${event.amount} GHS`,
      reference: 'kdjfkdjfd',
      payment: event.paymentId,
    });

    wallet.transactions.add(walletTransaction);

    wrap(wallet).assign({
      balance: wallet.balance + event.amount,
    });

    await this.em.persistAndFlush(wallet);
  }
}
