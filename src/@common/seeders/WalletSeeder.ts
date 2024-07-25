import type { EntityManager } from '@mikro-orm/core';
import { Seeder } from '@mikro-orm/seeder';

import { Status } from '../enums/status.enum';

import { User, Wallet } from '../db/entities';

export class WalletSeeder extends Seeder {

    async run(em: EntityManager): Promise<void> {
        const users = await em.findAll(User, {});

        for (let user of users) {
            em.create(Wallet, {
                user,
                balance: 1_000_000,
                status: Status.ACTIVE,
            });
        }
    }
}
