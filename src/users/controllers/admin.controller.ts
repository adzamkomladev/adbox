import { BadRequestException, Body, Controller, Get, HttpException, Param, Patch, Post, Query } from '@nestjs/common';
import { ApiBadRequestResponse, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';

import { ResponseMessage } from '../../@common/decorators/response.message.decorator';
import { Auth } from '../../auth/decorators/auth.decorator';

import { QueryDto } from '../dto/query.dto';
import { CreateUserDto } from '../dto/create-user.dto';
import { UpdateStatusDto } from '../dto/update-status.dto';

import { UsersService } from '../services/users.service';
import { RolesService } from '../services/roles.service';
import { OtelMethodCounter } from 'nestjs-otel';

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
    @OtelMethodCounter()
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

    // @Auth()
    @Patch(':id/status/update')
    @ApiOperation({ summary: 'Used to update status of a user' })
    @ApiOkResponse({ description: 'User status has been updated' })
    @ApiBadRequestResponse({ description: 'Failed to update user status' })
    @ResponseMessage('user status has been updated')
    async updateUserStatus(@Param('id') id: string, @Body() body: UpdateStatusDto) {
        try {
            await this.usersService.updateStatus(id, body);
        } catch (e) {
            if (e instanceof HttpException) {
                throw e;
            }

            throw new BadRequestException(e.message);
        }
    }
}
