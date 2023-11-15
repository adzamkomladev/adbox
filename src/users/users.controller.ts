import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  HttpException,
  BadRequestException,
} from '@nestjs/common';
import { ApiBadRequestResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger';

import { Auth } from '../auth/decorators/auth.decorator';

import { CreateUserDto } from './dto/create-user.dto';
import { SetRoleDto } from './dto/set-role.dto';
import { SetExtraDetailsDto } from './dto/set-extra-details.dto';
import { SetupFirebaseUserDto } from './dto/setup-firebase-user.dto';

import { UsersService } from './users.service';
import { ResponseMessage } from '../@common/decorators/response.message.decorator';

@ApiTags('users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  create(@Body() body: CreateUserDto) {
    return this.usersService.create(body);
  }

  @Get()
  findAll() {
    return this.usersService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(id);
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
  setExtraDetails(@Param('id') id: string, @Body() body: SetExtraDetailsDto) {
    try {
      return this.usersService.setExtraDetails(id, body);
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
  setupFirebaseUser(@Body() body: SetupFirebaseUserDto) {
    try {
      return this.usersService.setupFirebaseUser(body);
    } catch (e) {
      if (e instanceof HttpException) {
        throw e;
      }

      throw new BadRequestException(e.message);
    }
  }
}
