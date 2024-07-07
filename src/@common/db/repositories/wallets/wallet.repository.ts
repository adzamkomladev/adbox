import { Injectable, Logger } from '@nestjs/common';

import { EntityManager, wrap } from '@mikro-orm/postgresql';
import * as uniqid from 'uniqid';

import { Wallet, WalletTransaction, WalletTransactionChange } from '../../entities';
import { TransactionType } from '../../../../wallets/enums/transaction-type.enum';
import { Status } from '../../../enums/status.enum';

@Injectable()
export class WalletRepository {
    private readonly logger = new Logger(WalletRepository.name);

    constructor(private readonly em: EntityManager) { }

    async findAll() {
        return await this.em.findAll(Wallet);
    }

    async deductFromWallet(userId: string, amount: number, fee: number, reason: string) {
        const wallet = await this.em.findOne(Wallet, { user: { id: userId } });

        if (!wallet) {
            this.logger.error(`Failed to find wallet of user with id: ${userId}`);
            return null;
        }

        const totalAmountToWithdraw = amount + fee;
        if (wallet.balance < totalAmountToWithdraw) {
            this.logger.error(`The user's balance is insufficient to withdraw ${totalAmountToWithdraw} from their ${wallet.currency} wallet`);
            return null;
        }

        const balanceBefore = wallet.balance;
        const balanceAfter = wallet.balance - totalAmountToWithdraw;

        wrap(wallet).assign({ balance: wallet.balance - totalAmountToWithdraw });

        const transaction = this.em.create(WalletTransaction, {
            before: balanceBefore,
            after: balanceAfter,
            amount,
            fee,
            type: TransactionType.DEBIT,
            status: Status.COMPLETED,
            reference: uniqid('ADBOX-'),
            description: reason,
            wallet
        });

        const change = this.em.create(WalletTransactionChange, {
            status: Status.COMPLETED,
            transaction,
            reason
        });

        await this.em.persistAndFlush([wallet, transaction, change]);

        return { wallet, transaction, change };
    }

    async linkTransaction(transactionId: string, linkId: string) {
        const res = await this.em.nativeUpdate(WalletTransaction, { id: transactionId }, { linkId });

        return res > 0;
    }
}
