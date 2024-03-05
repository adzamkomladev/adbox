import type { EntityManager } from '@mikro-orm/core';
import { Seeder } from '@mikro-orm/seeder';
import { Role } from '../../users/entities/role.entity';

export class RoleSeeder extends Seeder {

  async run(em: EntityManager): Promise<void> {

    em.create(Role, {
      name: 'Super Admin',
      description: 'This user has access to every part of the system',
      code: 'SUPER_ADMIN',
    });
    em.create(Role, {
      name: 'Admin',
      description: 'This user has access to every part of the system but not more than the super admin',
      code: 'ADMIN',
    });
    em.create(Role, {
      name: 'Subscriber',
      description: 'This user is a subscriber and only has access to watch videos',
      code: 'SUBSCRIBER',
    });
    em.create(Role, {
      name: 'Publisher',
      description: 'This user can publish and maintain campaigns on the system',
      code: 'PUBLISHER',
    });
  }

}
