import {
  BadRequestException,
  Body,
  Controller,
  Get,
  HttpException,
  Post,
} from '@nestjs/common';
import { ApiBadRequestResponse, ApiOkResponse, ApiTags, ApiUnauthorizedResponse } from '@nestjs/swagger';

import { User } from './decorators/user.decorator';
import { Auth } from './decorators/auth.decorator';

import { AuthenticateDto } from './dto/authenticate.dto';

import { ResponseMessage } from '@common/decorators/response.message.decorator';

import { AuthService } from './auth.service';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly auth: AuthService) { }

  @Post('authenticate')
  @ApiOkResponse()
  @ApiBadRequestResponse()
  @ApiUnauthorizedResponse()
  @ResponseMessage('authentication successful')
  authenticate(@Body() authenticateDto: AuthenticateDto) {
    try {
      return this.auth.authenticate(authenticateDto);
    } catch (e) {
      if (e instanceof HttpException) {
        throw e;
      }

      throw new BadRequestException(e.message);
    }
  }

  @Auth()
  @Get('me')
  @ResponseMessage('retrieved current auth user')
  me(@User() user) {
    return user;
  }
}
