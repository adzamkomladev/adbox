import {
  Controller,
  Get,
  Param,
  HttpException,
  BadRequestException,
  Post,
  Body,
} from '@nestjs/common';
import { ApiBadRequestResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger';

import { User } from '../auth/decorators/user.decorator';
import { Auth } from '../auth/decorators/auth.decorator';

import { FundWalletDto } from './dto/fund-wallet.dto';

import { WalletsService } from './wallets.service';

@ApiTags('wallets')
@Controller('wallets')
export class WalletsController {
  constructor(private readonly walletsService: WalletsService) {}

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

  @Auth()
  @Post(':id/fund')
  @ApiOkResponse()
  @ApiBadRequestResponse()
  fundWallet(
    @User('id') userId: string,
    @Param('id') id: string,
    @Body() body: FundWalletDto,
  ) {
    try {
      return this.walletsService.fundWallet(id, userId, body);
    } catch (e) {
      if (e instanceof HttpException) {
        throw e;
      }

      throw new BadRequestException(e.message);
    }
  }
}
