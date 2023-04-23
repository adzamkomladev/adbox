import { Logger } from '@nestjs/common';
import { Process, Processor } from '@nestjs/bull';
import {EventEmitter2} from "@nestjs/event-emitter";

import { Job } from 'bull';

import { WALLET_TOP_UPS_QUEUE } from '../constants/queues.constant';

import { WalletTopUpJobDto } from '../dto/wallet-top-up-job.dto';

@Processor(WALLET_TOP_UPS_QUEUE)
export class WalletTopUpsConsumer {
  private readonly logger: Logger;

  constructor(private readonly event: EventEmitter2) {
    this.logger = new Logger(WalletTopUpsConsumer.name);
  }

  @Process()
  handleWalletTopUp(job: Job<WalletTopUpJobDto>) {
    this.logger.debug('Start top up...');
    this.logger.debug(job.data);
    this.logger.debug('Top up completed');
  }
}
