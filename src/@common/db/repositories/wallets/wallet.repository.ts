import { Injectable, Logger } from '@nestjs/common';

import { EntityManager } from '@mikro-orm/postgresql';

import { Wallet } from '../../entities';

@Injectable()
export class WalletRepository {
    private readonly logger = new Logger(WalletRepository.name);

    constructor(private readonly em: EntityManager) { }

    async findAll() {
        return await this.em.findAll(Wallet);
    }
}
