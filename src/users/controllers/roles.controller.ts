import { BadRequestException, Controller, Get, HttpException } from '@nestjs/common';
import { ApiBadRequestResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger';

import { Auth } from '../../auth/decorators/auth.decorator';
import { ResponseMessage } from '../../@common/decorators/response.message.decorator';

import { RolesService } from '../services/roles.service';

@ApiTags('roles')
@Controller('roles')
export class RolesController {
    constructor(private readonly rolesService: RolesService) { }

    // @Auth()
    @Get()
    @ApiOkResponse()
    @ApiBadRequestResponse()
    @ResponseMessage('all roles')
    findAll() {
        try {
            return this.rolesService.findAll();
        } catch (e) {
            if (e instanceof HttpException) {
                throw e;
            }

            throw new BadRequestException(e.message);
        }
    }
}
