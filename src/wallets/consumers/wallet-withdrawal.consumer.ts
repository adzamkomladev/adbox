import { Logger } from '@nestjs/common';
import { Process, Processor } from '@nestjs/bull';
import { EventEmitter2 } from '@nestjs/event-emitter';

import { Job } from 'bull';

import { WALLET_WITHDRAWALS_QUEUE } from '../constants/queues.constant';
import { WALLET_TOP_UP_INITIATED } from '../../@common/constants/events.constant';

import { WalletTopUpJobDto } from '../dto/wallet-top-up-job.dto';

import { WalletTopUpInitiatedEvent } from '../events/wallet-top-up-initiated.event';
import { WalletsService } from '../wallets.service';
import { InjectRepository } from '@mikro-orm/nestjs';
import { Wallet } from '../entities/wallet.entity';
import { EntityManager, EntityRepository } from '@mikro-orm/postgresql';
import { wrap } from '@mikro-orm/core';
import { WalletTransaction } from '../entities/wallet-transaction.entity';
import { TransactionType } from '../enums/transacton-type.enum';
import { Status } from '../../@common/enums/status.enum';
import { v4 as uuid } from 'uuid';
import { ZeepayService } from '../../../libs/zeepay/src';

@Processor(WALLET_WITHDRAWALS_QUEUE)
export class WalletWithdrawalConsumer {
    private readonly logger = new Logger(WalletWithdrawalConsumer.name);

    constructor(
        private readonly zeepay: ZeepayService,
        private readonly em: EntityManager,
        @InjectRepository(Wallet)
        private readonly walletRepository: EntityRepository<Wallet>,
        @InjectRepository(WalletTransaction)
        private readonly walletTransactionRepository: EntityRepository<WalletTransaction>,
        private readonly walletService: WalletsService) { }

    @Process()
    async handleWalletTopUp(job: Job<WalletTopUpJobDto>) {
        this.logger.debug('Start withdrawals...');
        this.logger.debug(job.data);


        const { userId, walletId, amount, paymentMethodId } = job.data;
        const wallet = await this.walletRepository.findOneOrFail({ id: walletId, user: { id: userId } });

        if (!wallet) {
            this.logger.warn('Wallet for withdrawal does not exist', job.data);
            return false;
        }

        if (!this.walletService.canWithdraw(wallet, amount)) {
            this.logger.warn('Withdrawal check failed', job.data);
            return false;
        }

        const reference = uuid();

        try {
            await this.debitWallet(wallet, amount, reference);
        } catch (e) {
            this.logger.error('Failed to perform wallet debit for withdrawal', e);
            return false;
        }

        try {
            await this.debitWallet(wallet, amount, reference);
        } catch (e) {
            this.logger.error('Failed to perform wallet debit for withdrawal', e);
            return false;
        }

        // const hasDisbursed = await this.disburse({ amount, name, phone, description: `Wallet withdrawal of ${amount} GHS`, reference });
        const hasDisbursed = true;
        
        if (!hasDisbursed) {
            try {
                await this.reverseWalletDebit(wallet, reference);

                this.logger.debug('Withdrawal completed');
                return true;
            } catch (e) {
                this.logger.error('Failed to perform wallet debit reversal for withdrawal', e);
                return false;
            }
        }

        try {
            await this.markTransactionAsCompleted(reference);

            this.logger.debug('Withdrawal completed');
            return true;
        } catch (e) {
            this.logger.error('Failed to mark transaction as completed', e);
            return false;
        }
    }

    private async debitWallet(wallet: Wallet, amount: number, reference: string) {
        const walletTransaction = this.walletTransactionRepository.create({
            amount,
            before: wallet.balance,
            after: wallet.balance - amount,
            type: TransactionType.DEBIT,
            status: Status.INITIATED,
            description: `Wallet withdrawal of ${amount} GHS`,
            reference,
        });

        wallet.transactions.add(walletTransaction);

        wrap(wallet).assign({
            balance: wallet.balance - amount,
        });

        await this.em.persistAndFlush(wallet);
    }

    private async reverseWalletDebit(wallet: Wallet, reference: string) {
        const transaction = await this.walletTransactionRepository.findOneOrFail({ reference });

        wrap(transaction).assign({
            status: Status.FAILED
        });

        this.em.persist(transaction);

        wrap(wallet).assign({
            balance: transaction.before
        });

        this.em.persist(wallet);

        await this.em.flush();
    }

    private async disburse(payload: { amount: number, name: string, phone: string, description: string, reference: string }) {
        try {
            const res = await this.zeepay.creditMobileWallet(payload);

            this.logger.log('successful response from zeepay', res);

            return res.code === 200

        } catch (e) {
            this.logger.error('disbursement through zeepay failed', e);

            return false;
        }
    }

    private async markTransactionAsCompleted(reference: string) {
        const transaction = await this.walletTransactionRepository.findOneOrFail({ reference });

        wrap(transaction).assign({
            status: Status.COMPLETED
        });

        await this.em.persistAndFlush(transaction);

    }

}
