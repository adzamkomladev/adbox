import { Injectable } from '@nestjs/common';

import { InjectRepository } from '@mikro-orm/nestjs';
import { EntityRepository } from '@mikro-orm/postgresql';

import { Role } from '../entities/role.entity';

@Injectable()
export class RolesService {
    constructor(
        @InjectRepository(Role)
        private readonly rolesRepository: EntityRepository<Role>,
    ) { }

    async findAll() {
        return await this.rolesRepository.findAll();
    }
}
