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

@Processor(WALLET_WITHDRAWALS_QUEUE)
export class WalletWithdrawalConsumer {
    private readonly logger = new Logger(WalletWithdrawalConsumer.name);

    constructor(
        private readonly em: EntityManager,
        @InjectRepository(Wallet)
        private readonly walletRepository: EntityRepository<Wallet>,
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
            this.logger.warn(`Withdrawal check failed`, job.data);
            return false;
        }


        this.logger.debug('Top up completed');
    }

    private debitWallet(walletId: string) {

    }

}
