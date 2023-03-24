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

import { UsersService } from './users.service';

@ApiTags('users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
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
  setRole(@Param('id') id: string, @Body() setRoleDto: SetRoleDto) {
    try {
      return this.usersService.setRole(id, setRoleDto);
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
  setExtraDetails(
    @Param('id') id: string,
    @Body() setExtraDetailsDto: SetExtraDetailsDto,
  ) {
    try {
      return this.usersService.setExtraDetails(id, setExtraDetailsDto);
    } catch (e) {
      if (e instanceof HttpException) {
        throw e;
      }

      throw new BadRequestException(e.message);
    }
  }
}
