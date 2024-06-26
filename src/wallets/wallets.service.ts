import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bull';

import { Queue } from 'bull';
import { EntityRepository } from '@mikro-orm/core';
import { InjectRepository } from '@mikro-orm/nestjs';
import { EntityManager } from '@mikro-orm/postgresql';

import { WALLET_TOP_UPS_QUEUE, WALLET_WITHDRAWALS_QUEUE } from './constants/queues.constant';

import { Status } from '@common/enums/status.enum';

import { Wallet } from '../@common/db/entities/wallets/wallet.entity';
import { WalletTransaction } from '../@common/db/entities/wallets/wallet-transaction.entity';

import { CreateWalletDto } from './dto/create-wallet.dto';
import { FindWalletBalanceDto } from './dto/find-wallet-balance.dto';
import { FundWalletDto } from './dto/fund-wallet.dto';
import { WalletTopUpJobDto } from './dto/wallet-top-up-job.dto';

import { UsersService } from '../users/services/users.service';

@Injectable()
export class WalletsService {
  constructor(
    private readonly em: EntityManager,
    @InjectQueue(WALLET_TOP_UPS_QUEUE) private topUpsQueue: Queue,
    @InjectQueue(WALLET_WITHDRAWALS_QUEUE) private withdrawalsQueue: Queue,
    @InjectRepository(Wallet)
    private readonly walletRepository: EntityRepository<Wallet>,
    @InjectRepository(WalletTransaction)
    private readonly walletTransactionRepository: EntityRepository<WalletTransaction>,
    private readonly usersService: UsersService,
  ) { }

  async create({ userId, balance = 0 }: CreateWalletDto) {
    const user = await this.usersService.findOne(userId);

    const wallet = this.walletRepository.create({
      user,
      balance,
      status: Status.ACTIVE,
    });

    await this.em.persistAndFlush(wallet);

    return wallet;
  }

  async walletBalance(payload: FindWalletBalanceDto): Promise<Partial<Wallet>> {
    return await this.walletRepository.findOneOrFail(
      { ...payload },
      {
        fields: ['id', 'balance', 'currency'],
      },
    );
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
    const wallet = await this.walletRepository.findOneOrFail({ id, user: { id: userId } });

    if (!this.canWithdraw(wallet, topUpWalletDto.amount)) {
      throw new BadRequestException('you cannot withdraw from this wallet');
    }

    const jobData: WalletTopUpJobDto = {
      walletId: id,
      userId,
      ...topUpWalletDto,
    };

    await this.withdrawalsQueue.add(jobData);

    return jobData;
  }

   canWithdraw(wallet: Wallet, amount: number) {
    if (wallet.balance < amount) {
      return false;
    }

    if (wallet.status === Status.BLOCKED) {
      return false;
    }

    return true;
  }
}
