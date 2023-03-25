import { Injectable } from '@nestjs/common';

import { EntityRepository } from '@mikro-orm/core';
import { InjectRepository } from '@mikro-orm/nestjs';

import {Status} from "../@common/enums/status.enum";

import { Wallet } from './entities/wallet.entity';

import { CreateWalletDto } from './dto/create-wallet.dto';
import { FindWalletBalanceDto } from './dto/find-wallet-balance.dto';

import { UsersService } from '../users/users.service';

@Injectable()
export class WalletsService {
  constructor(
    @InjectRepository(Wallet)
    private readonly walletRepository: EntityRepository<Wallet>,
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

  findAll() {
    return `This action returns all wallets`;
  }

  findOne(id: number) {
    return `This action returns a #${id} wallet`;
  }

  remove(id: number) {
    return `This action removes a #${id} wallet`;
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
}
