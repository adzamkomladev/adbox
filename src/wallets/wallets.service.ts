import { Injectable } from '@nestjs/common';
import { CreateWalletDto } from './dto/create-wallet.dto';
import { UpdateWalletDto } from './dto/update-wallet.dto';
import { EntityRepository } from '@mikro-orm/core';
import { Wallet } from './entities/wallet.entity';
import { FindWalletBalanceDto } from './dto/find-wallet-balance.dto';

@Injectable()
export class WalletsService {
  constructor(private readonly walletRepository: EntityRepository<Wallet>) {}
  create(createWalletDto: CreateWalletDto) {
    return 'This action adds a new wallet';
  }

  findAll() {
    return `This action returns all wallets`;
  }

  findOne(id: number) {
    return `This action returns a #${id} wallet`;
  }

  update(id: number, updateWalletDto: UpdateWalletDto) {
    return `This action updates a #${id} wallet`;
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
