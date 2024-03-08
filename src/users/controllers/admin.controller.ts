import { BadRequestException, Body, Controller, Get, HttpException, Post, Query } from '@nestjs/common';
import { ApiBadRequestResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger';

import { ResponseMessage } from '../../@common/decorators/response.message.decorator';
import { Auth } from '../../auth/decorators/auth.decorator';

import { QueryDto } from '../dto/query.dto';
import { CreateUserDto } from '../dto/create-user.dto';

import { UsersService } from '../services/users.service';
import { RolesService } from '../services/roles.service';

@ApiTags('users admin')
@Controller('admin/users')
export class AdminController {
    constructor(
        private readonly usersService: UsersService,
        private readonly rolesService: RolesService
    ) { }

    // @Auth()
    @Get('roles')
    @ApiOkResponse()
    @ApiBadRequestResponse()
    @ResponseMessage('all roles')
    findAllRoles() {
        try {
            return this.rolesService.findAll();
        } catch (e) {
            if (e instanceof HttpException) {
                throw e;
            }

            throw new BadRequestException(e.message);
        }
    }

    // @Auth()
    @Get()
    @ApiOkResponse()
    @ApiBadRequestResponse()
    @ResponseMessage('admin users retrieved')
    async findAllUsers(@Query() query: QueryDto) {
        try {
            return await this.usersService.findAllAdmin(query);
        } catch (e) {
            if (e instanceof HttpException) {
                throw e;
            }

            throw new BadRequestException(e.message);
        }
    }

    @Post()
    @ApiOkResponse()
    @ApiBadRequestResponse()
    @ResponseMessage('admin user created')
    createAdmin(@Body() body: CreateUserDto) {
        try {
            return this.usersService.createAdmin(body);
        } catch (e) {
            if (e instanceof HttpException) {
                throw e;
            }

            throw new BadRequestException(e.message);
        }
    }
}
