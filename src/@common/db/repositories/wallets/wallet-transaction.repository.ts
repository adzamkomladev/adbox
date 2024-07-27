import { Injectable, Logger } from '@nestjs/common';

import { EntityManager } from '@mikro-orm/postgresql';

import { WalletTransaction } from '../../entities';


@Injectable()
export class WalletTransactionRepository {
    private readonly logger = new Logger(WalletTransactionRepository.name);

    constructor(private readonly em: EntityManager) { }

    async findAllWalletTransactions(userId: string, { page = 1, size = 10 }: any) {
        const [transactions, total] = await this.em.findAndCount(
            WalletTransaction,
            { wallet: { user: { id: userId } } },
            {
                fields: ['id', 'amount', 'fee', 'reference', 'type', 'status', 'description', 'createdAt'],
                limit: size,
                offset: (page - 1) * size
            }
        );

        return {
            transactions,
            meta: {
                total,
                page: +page,
                size: +size,
                totalPages: Math.ceil(total / size)
            }
        };
    }
}
