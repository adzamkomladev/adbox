import {
  Controller,
  Get,

  Param,
  Delete,
  HttpException,
  BadRequestException,
} from '@nestjs/common';
import { ApiBadRequestResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger';

import { User } from '../auth/decorators/user.decorator';
import { Auth } from '../auth/decorators/auth.decorator';

import { WalletsService } from './wallets.service';

@ApiTags('wallets')
@Controller('wallets')
export class WalletsController {
  constructor(private readonly walletsService: WalletsService) {}

  @Get()
  findAll() {
    return this.walletsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.walletsService.findOne(+id);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.walletsService.remove(+id);
  }

  @Auth()
  @Get(':id/balance')
  @ApiOkResponse()
  @ApiBadRequestResponse()
  findWalletBalance(@User('id') userId: string, @Param('id') id: string) {
    try {
      return this.walletsService.walletBalance({ id, userId });
    } catch (e) {
      if (e instanceof HttpException) {
        throw e;
      }

      throw new BadRequestException(e.message);
    }
  }
}
