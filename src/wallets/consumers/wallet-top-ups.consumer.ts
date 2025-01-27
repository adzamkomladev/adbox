import { Logger } from '@nestjs/common';
import { Processor, WorkerHost } from '@nestjs/bullmq';
import { EventEmitter2 } from '@nestjs/event-emitter';

import { Job } from 'bullmq';

import { WALLET_TOP_UP_INITIATED } from '@common/constants/events.constant';
import { WALLET_TOP_UPS_QUEUE } from '../constants/queues.constant';

import { WalletTopUpJobDto } from '../dto/wallet-top-up-job.dto';

import { WalletTopUpInitiatedEvent } from '../events/wallet-top-up-initiated.event';
import { OtlpLogger } from '@common/loggers/otlp.logger';

@Processor(WALLET_TOP_UPS_QUEUE)
export class WalletTopUpsConsumer extends WorkerHost {
  private readonly logger = new OtlpLogger(WalletTopUpsConsumer.name);

  constructor(private readonly event: EventEmitter2) { super(); }

  async process(job: Job<WalletTopUpJobDto>) {
    this.logger.log('Start top up...');

    const { userId, walletId, amount, paymentMethodId } = job.data;

    const event = new WalletTopUpInitiatedEvent();
    event.userId = userId;
    event.walletId = walletId;
    event.amount = amount;
    event.paymentMethodId = paymentMethodId;

    this.event.emit(WALLET_TOP_UP_INITIATED, event);

    this.logger.log('Top up completed');
  }
}
