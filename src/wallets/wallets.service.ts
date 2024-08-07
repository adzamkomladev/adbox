import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bull';

import { Queue } from 'bull';

import { WALLET_TOP_UPS_QUEUE, WALLET_WITHDRAWALS_QUEUE } from './constants/queues.constant';

import { Wallet } from '../@common/db/entities/wallets/wallet.entity';

import { CreateWalletDto } from './dto/create-wallet.dto';
import { FindWalletBalanceDto } from './dto/find-wallet-balance.dto';
import { FundWalletDto } from './dto/fund-wallet.dto';
import { WalletTopUpJobDto } from './dto/wallet-top-up-job.dto';
import { GetAllTransactionsDto, GetAllTransactionsQueryDto } from './dto/get-transactions.dto';

import { WalletRepository, WalletTransactionRepository } from '../@common/db/repositories';

@Injectable()
export class WalletsService {
  constructor(
    @InjectQueue(WALLET_TOP_UPS_QUEUE) private topUpsQueue: Queue,
    @InjectQueue(WALLET_WITHDRAWALS_QUEUE) private withdrawalsQueue: Queue,
    private readonly walletRepository: WalletRepository,
    private readonly walletTransactionRepository: WalletTransactionRepository,
  ) { }

  async create({ userId, balance = 0 }: CreateWalletDto) {
    return await this.walletRepository.create({ userId, balance });
  }

  async walletBalance(payload: FindWalletBalanceDto): Promise<Partial<Wallet>> {
    const wallet = await this.walletRepository.getWalletBalance(payload.userId);

    if (!wallet) throw new BadRequestException('failed to get wallet balance of user');

    return wallet;
  }

  async fundWallet(id: string, userId: string, topUpWalletDto: FundWalletDto) {
    const jobData: WalletTopUpJobDto = {
      walletId: id,
      userId,
      ...topUpWalletDto,
    };

    await this.topUpsQueue.add(jobData);

    return jobData;
  }

  async withdrawWallet(id: string, userId: string, topUpWalletDto: FundWalletDto) {
    const canWithdraw = await this.walletRepository.checkWithdrawal({ id, userId, amount: topUpWalletDto.amount });

    if (!canWithdraw) throw new BadRequestException('you cannot withdraw from this wallet');

    const jobData: WalletTopUpJobDto = {
      walletId: id,
      userId,
      ...topUpWalletDto,
    };

    await this.withdrawalsQueue.add(jobData);

    return jobData;
  }

  async getAllTransactions(userId: string, payload: GetAllTransactionsQueryDto): Promise<GetAllTransactionsDto> {
    return await this.walletTransactionRepository.findAllWalletTransactions(userId, payload);
  }
}
