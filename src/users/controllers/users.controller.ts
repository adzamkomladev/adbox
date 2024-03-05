import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  HttpException,
  BadRequestException,
  Query,
} from '@nestjs/common';
import { ApiBadRequestResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger';

import { Auth } from '../../auth/decorators/auth.decorator';

import { CreateUserDto } from '../dto/create-user.dto';
import { SetRoleDto } from '../dto/set-role.dto';
import { SetExtraDetailsDto } from '../dto/set-extra-details.dto';
import { SetupFirebaseUserDto } from '../dto/setup-firebase-user.dto';

import { UsersService } from '../services/users.service';
import { ResponseMessage } from '../../@common/decorators/response.message.decorator';
import { QueryDto } from '../dto/query.dto';

@ApiTags('users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) { }

  @Post()
  create(@Body() body: CreateUserDto) {
    return this.usersService.create(body);
  }

  @Post('admin')
  @ApiOkResponse()
  @ApiBadRequestResponse()
  @ResponseMessage('admin user created')
  createAdmin(@Body() body: CreateUserDto) {
    return this.usersService.createAdmin(body);
  }


  @Get()
  findAll() {
    return this.usersService.findAll();
  }

  @Get('admin')
  @ApiOkResponse()
  @ApiBadRequestResponse()
  @ResponseMessage('admin users retrieved')
  async findAllAdmin(@Query() query: QueryDto) {
    try {
      return await this.usersService.findAllAdmin(query);
    } catch (e) {
      if (e instanceof HttpException) {
        throw e;
      }

      throw new BadRequestException(e.message);
    }
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    try {
      return await this.usersService.findOne(id);
    } catch (e) {
      if (e instanceof HttpException) {
        throw e;
      }

      throw new BadRequestException(e.message);
    }
  }

  @Auth()
  @Patch(':id/role')
  @ApiOkResponse()
  @ApiBadRequestResponse()
  @ResponseMessage('role set')
  setRole(@Param('id') id: string, @Body() body: SetRoleDto) {
    try {
      return this.usersService.setRole(id, body);
    } catch (e) {
      if (e instanceof HttpException) {
        throw e;
      }

      throw new BadRequestException(e.message);
    }
  }

  @Auth()
  @Patch(':id/extra-details')
  @ApiOkResponse()
  @ApiBadRequestResponse()
  @ResponseMessage('extra details set')
  async setExtraDetails(@Param('id') id: string, @Body() body: SetExtraDetailsDto) {
    try {
      return await this.usersService.setExtraDetails(id, body);
    } catch (e) {
      if (e instanceof HttpException) {
        throw e;
      }

      throw new BadRequestException(e.message);
    }
  }

  @Post('setup/firebase/user')
  @ApiOkResponse()
  @ApiBadRequestResponse()
  @ResponseMessage('firebase user setup')
  async setupFirebaseUser(@Body() body: SetupFirebaseUserDto) {
    try {
      return await this.usersService.setupFirebaseUser(body);
    } catch (e) {
      if (e instanceof HttpException) {
        throw e;
      }

      throw new BadRequestException(e.message);
    }
  }
}
