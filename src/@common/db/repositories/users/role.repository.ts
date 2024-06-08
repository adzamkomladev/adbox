import { Injectable, Logger } from '@nestjs/common';

import { EntityManager } from '@mikro-orm/postgresql';

import { Role } from '../../entities';

@Injectable()
export class RoleRepository {
    private readonly logger = new Logger(RoleRepository.name);

    constructor(private readonly em: EntityManager) { }

    async findAll() {
        return await this.em.findAll(Role);
    }
}
