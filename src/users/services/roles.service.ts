import { Injectable } from '@nestjs/common';

import { EntityManager } from '@mikro-orm/postgresql';

import { Role } from '../../@common/db/entities';

@Injectable()
export class RolesService {
    constructor(private readonly em: EntityManager) { }

    async findAll() {
        return await this.em.findAll(Role);
    }
}
