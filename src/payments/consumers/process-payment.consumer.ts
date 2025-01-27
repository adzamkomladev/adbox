import { Processor, WorkerHost } from '@nestjs/bullmq';

import { Job } from 'bullmq';

import { PROCESS_PAYMENT_QUEUE } from '../constants/queues.constant';

import { Status } from '@common/enums/status.enum';
import { Activity } from '../../wallets/enums/activity.enum';

import { Payment } from '@common/db/entities';

import { ProcessPaymentDto } from '../dto/process-payment.dto';

import { OtlpLogger } from '@common/loggers/otlp.logger';

import { PaymentRepository, WalletRepository } from '@common/db/repositories';

@Processor(PROCESS_PAYMENT_QUEUE)
export class ProcessPaymentConsumer extends WorkerHost {
    private readonly logger = new OtlpLogger(ProcessPaymentConsumer.name);

    constructor(
        private readonly paymentRepository: PaymentRepository,
        private readonly walletRepository: WalletRepository
    ) { super(); }

    async process(job: Job<ProcessPaymentDto>) {
        try {
            this.logger.log('Start payment process...');

            const { status, reference } = job.data;

            const paymentStatus = this.retrieveStatus(status);

            const payment = await this.paymentRepository.updateStatus({ reference, status: Status.INITIATED }, paymentStatus);

            if (!payment) {
                this.logger.warn('Payment does not exist with reference: {reference}', { reference });
                return;
            }

            await this.handlePaymentAction(payment);
        } catch (error) {
            this.logger.error('Failed to process payment', { error });
        } finally {
            this.logger.log('End payment process...');
        }
    }

    private async handlePaymentAction(payment: Payment) {
        if (payment.activity === Activity.WALLET_TOP_UP) {
            const res = await this.walletRepository.topUpWallet(
                payment.walletId,
                payment.amount,
                0,
                `Wallet top up of ${payment.amount} GHS`,
                payment.id
            );
        }
    }

    private retrieveStatus(status: string) {
        if (status === 'success') {
            return Status.COMPLETED;
        }

        return Status.FAILED;
    }
}
