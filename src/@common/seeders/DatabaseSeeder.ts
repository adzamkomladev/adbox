import { EntityManager } from '@mikro-orm/core';
import { Seeder } from '@mikro-orm/seeder';

import { RoleSeeder } from './RoleSeeder';
import { UserSeeder } from './UserSeeder';
import { KycSeeder } from './KycSeeder';

export class DatabaseSeeder extends Seeder {

    run(em: EntityManager): Promise<void> {
        return this.call(em, [
            RoleSeeder,
            UserSeeder,
            KycSeeder,
        ]);
    }
}