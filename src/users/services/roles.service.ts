import { Injectable } from '@nestjs/common';

import { RoleRepository } from '../../@common/db/repositories';


@Injectable()
export class RolesService {
    constructor(private readonly roleRepository: RoleRepository) { }

    async findAll() {
        return await this.roleRepository.findAll();
    }
}
