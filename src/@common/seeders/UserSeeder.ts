import type { EntityManager } from '@mikro-orm/core';

import { faker } from '@faker-js/faker';
import { Seeder } from '@mikro-orm/seeder';

import { Sex } from '../../users/enums/sex.enum';
import { Status } from '../enums/status.enum';

import { User, Role } from '../db/entities';

export class UserSeeder extends Seeder {

    async run(em: EntityManager): Promise<void> {
        const roles = await em.findAll(Role, {
            where: {
                code: { $in: ['ADMIN', 'SUPER_ADMIN'] }
            }
        });

        for (let i = 0; i < 20; i++) {
            const chosenRole = faker.helpers.arrayElement(roles);

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
                password: 'Abcde12345!',
            });
        }
    }

}
