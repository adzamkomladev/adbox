import type { EntityManager } from '@mikro-orm/core';

import { faker } from '@faker-js/faker';
import { Seeder } from '@mikro-orm/seeder';

import { Status } from '../enums/status.enum';
import { Sex } from '../../users/enums/sex.enum';
import { Type } from '../../kyc/enums/type.enum';

import { User } from '../../users/entities/user.entity';
import { Role } from '../../users/entities/role.entity';
import { Kyc } from '../../kyc/entities/kyc.entity';
import { Identity } from '../../kyc/entities/identity.entity';
import { Attempt } from '../../kyc/entities/attempt.entity';

export class KycSeeder extends Seeder {

    async run(em: EntityManager): Promise<void> {

        const roles = await em.findAll(Role, {});
        const publisherRole = roles?.find(role => role.code === 'PUBLISHER');
        const subscriberRole = roles?.find(role => role.code === 'SUBSCRIBER');
        const adminRole = roles?.find(role => role.code === 'ADMIN');
        const superAdminRole = roles?.find(role => role.code === 'SUPER_ADMIN');

        await this.initiatedIdentity(em, publisherRole, subscriberRole);
        await this.completedIdentity(em, publisherRole, subscriberRole);
    }

    async initiatedIdentity(em: EntityManager, publisherRole: Role, subscriberRole: Role): Promise<void> {
        for (let i = 0; i < 40; i++) {
            const identity = new Identity();
            identity.type = Type.NATIONAL_ID;
            identity.front = faker.image.avatar();
            identity.back = faker.image.avatar();
            identity.combined = faker.image.avatar();

            const chosenRole = faker.helpers.arrayElement([publisherRole, subscriberRole]);

            em.create(User, {
                email: faker.internet.email(),
                firstName: faker.person.firstName(),
                lastName: faker.person.lastName(),
                sex: faker.helpers.arrayElement([Sex.MALE, Sex.FEMALE]),
                dateOfBirth: faker.date.birthdate(),
                avatar: faker.image.avatar(),
                role: chosenRole,
                roleTitle: chosenRole.name,
                status: Status.ACTIVE,
                kyc: em.create(Kyc, {
                    country: 'GH',
                    level: 1,
                    attempts: [
                        em.create(Attempt, {
                            identity,
                            status: Status.PENDING,
                        })
                    ]
                })
            });
        }
    }

    async completedIdentity(em: EntityManager, publisherRole: Role, subscriberRole: Role): Promise<void> {
        const admins = await em.findAll(User, { where: { role: { code: 'ADMIN' } } });

        for (let i = 0; i < 10; i++) {
            const identity = new Identity();
            identity.type = Type.NATIONAL_ID;
            identity.front = faker.image.avatar();
            identity.back = faker.image.avatar();
            identity.combined = faker.image.avatar();

            const chosenRole = faker.helpers.arrayElement([publisherRole, subscriberRole]);
            const chosenAdmin = faker.helpers.arrayElement(admins);

            em.create(User, {
                email: faker.internet.email(),
                firstName: faker.person.firstName(),
                lastName: faker.person.lastName(),
                sex: faker.helpers.arrayElement([Sex.MALE, Sex.FEMALE]),
                dateOfBirth: faker.date.birthdate(),
                avatar: faker.image.avatar(),
                role: chosenRole,
                roleTitle: chosenRole.name,
                status: Status.ACTIVE,
                kyc: em.create(Kyc, {
                    country: 'GH',
                    level: 2,
                    identity,
                    attempts: [
                        em.create(Attempt, {
                            identity,
                            status: Status.COMPLETED,
                            reason: 'This user is verified',
                            updatedBy: chosenAdmin
                        })
                    ]
                })
            });
        }
    }
}
