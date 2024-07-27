import {
  Controller,
  Get,
  Param,
  HttpException,
  BadRequestException,
  Post,
  Body,
  Query,
  Logger,
} from '@nestjs/common';
import { ApiBadRequestResponse, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';

import { User } from '../auth/decorators/user.decorator';
import { Auth } from '../auth/decorators/auth.decorator';
import { ResponseMessage } from '../@common/decorators/response.message.decorator';

import { AuthenticatedUser } from '../auth/dto/authenticated.dto';
import { FundWalletDto } from './dto/fund-wallet.dto';
import { GetAllTransactionsQueryDto } from './dto/get-transactions.dto';

import { WalletsService } from './wallets.service';

@ApiTags('wallets')
@Controller('wallets')
export class WalletsController {
  private readonly logger = new Logger(WalletsController.name);

  constructor(private readonly walletsService: WalletsService) { }

  @Auth()
  @Get(':id/balance')
  @ApiOkResponse()
  @ApiBadRequestResponse()
  @ResponseMessage('wallet balance retrieved')
  async findWalletBalance(@User() user: AuthenticatedUser, @Param('id') id: string) {
    try {
      return await this.walletsService.walletBalance({ id, userId: user.id });
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
  @ResponseMessage('funding of wallet initiated')
  async fundWallet(
    @User() user: AuthenticatedUser,
    @Param('id') id: string,
    @Body() body: FundWalletDto,
  ) {
    try {
      return await this.walletsService.fundWallet(id, user.id, body);
    } catch (e) {
      if (e instanceof HttpException) {
        throw e;
      }

      throw new BadRequestException(e.message);
    }
  }

  @Auth()
  @Post(':id/withdraw')
  @ApiOkResponse()
  @ApiBadRequestResponse()
  @ResponseMessage('wallet withdrawal initiated')
  async withdrawWallet(
    @User() user: AuthenticatedUser,
    @Param('id') id: string,
    @Body() body: FundWalletDto,
  ) {
    try {
      return await this.walletsService.fundWallet(id, user.id, body);
    } catch (e) {
      if (e instanceof HttpException) {
        throw e;
      }

      throw new BadRequestException(e.message);
    }
  }

  @Auth()
  @Get('transactions')
  @ApiOperation({ summary: 'Used to retrieve all wallet transactions of a user' })
  @ApiOkResponse({ description: 'Wallet Transactions retrieved' })
  @ApiBadRequestResponse({ description: 'Failed to retrieve wallet transactions' })
  @ResponseMessage('wallet transactions retrieved')
  async getAllTransactions(
    @User() user: AuthenticatedUser,
    @Query() query: GetAllTransactionsQueryDto,
  ) {
    try {
      return await this.walletsService.getAllTransactions(user.id, query);
    } catch (e) {
      this.logger.error(`Failed to stop campaign with error ==> ${e}`);

      if (e instanceof HttpException) {
        throw e;
      }

      throw new BadRequestException('failed to get all wallet transactions');
    }
  }
}
