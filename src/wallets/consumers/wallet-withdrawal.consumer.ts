import { Logger } from '@nestjs/common';
import { Process, Processor } from '@nestjs/bull';

import { wrap } from '@mikro-orm/core';
import { EntityManager, EntityRepository } from '@mikro-orm/postgresql';
import { InjectRepository } from '@mikro-orm/nestjs';
import { Job } from 'bull';
import { v4 as uuid } from 'uuid';

import { ZeepayService } from '@adbox/zeepay';

import { WALLET_WITHDRAWALS_QUEUE } from '../constants/queues.constant';

import { Status } from '@common/enums/status.enum';
import { TransactionType } from '../enums/transaction-type.enum';

import { PaymentMethod } from '@app/@common/db/entities/payments/payment-method.entity';
import { Wallet } from '../../@common/db/entities/wallets/wallet.entity';
import { WalletTransaction } from '../../@common/db/entities/wallets/wallet-transaction.entity';

import { WalletTopUpJobDto } from '../dto/wallet-top-up-job.dto';

import { PaymentMethodsService } from '@app/payments/services/payment-methods.service';
import { WalletsService } from '../wallets.service';
import { WalletRepository } from '../../@common/db/repositories';

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
        private readonly walletRepo: WalletRepository,
        private readonly walletService: WalletsService,
        private readonly paymentMethodsService: PaymentMethodsService) { }

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

        if (!await this.walletRepo.checkWithdrawal({ userId, walletId, amount })) {
            this.logger.warn('Withdrawal check failed', job.data);
            return false;
        }

        let paymentMethod: PaymentMethod;
        try {
            paymentMethod = await this.paymentMethodsService.findOne(paymentMethodId);
        } catch (e) {
            this.logger.error('Payment method for withdrawal does not exist', e);
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

        const hasDisbursed = await this.disburse({ amount, name: paymentMethod.accountName, phone: paymentMethod.accountNumber, description: `Wallet withdrawal of ${amount} GHS`, reference });

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
