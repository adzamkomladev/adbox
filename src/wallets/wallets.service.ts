import { Injectable } from '@nestjs/common';

import { EntityRepository } from '@mikro-orm/core';
import { InjectRepository } from '@mikro-orm/nestjs';
import { InjectQueue } from '@nestjs/bull';

import { Queue } from 'bull';

import { Status } from '../@common/enums/status.enum';

import { Wallet } from './entities/wallet.entity';
import { WalletTransaction } from './entities/wallet-transaction.entity';

import { CreateWalletDto } from './dto/create-wallet.dto';
import { FindWalletBalanceDto } from './dto/find-wallet-balance.dto';

import { UsersService } from '../users/users.service';
import { TopUpWalletDto } from './dto/top-up-wallet.dto';
import { WALLET_TOP_UPS_QUEUE } from './constants/queues.constant';
import { WalletTopUpJobDto } from './dto/wallet-top-up-job.dto';

@Injectable()
export class WalletsService {
  constructor(
    @InjectQueue(WALLET_TOP_UPS_QUEUE) private topUpsQueue: Queue,
    @InjectRepository(Wallet)
    private readonly walletRepository: EntityRepository<Wallet>,
    @InjectRepository(WalletTransaction)
    private readonly walletTransactionRepository: EntityRepository<WalletTransaction>,
    private readonly usersService: UsersService,
  ) {}
  async create({ userId }: CreateWalletDto) {
    const user = await this.usersService.findOne(userId);

    const wallet = this.walletRepository.create({
      user,
      balance: 0,
      status: Status.ACTIVE,
    });

    await this.walletRepository.persistAndFlush(wallet);

    return wallet;
  }
  walletBalance(
    findWalletBalance: FindWalletBalanceDto,
  ): Promise<Partial<Wallet>> {
    return this.walletRepository.findOneOrFail(
      { ...findWalletBalance },
      {
        fields: ['id', 'balance', 'currency'],
      },
    );
  }

  async topUpWallet(id: string, topUpWalletDto: TopUpWalletDto) {
    const jobData: WalletTopUpJobDto = { walletId: id, ...topUpWalletDto };

    await this.topUpsQueue.add(jobData);

    return jobData;
  }
}
