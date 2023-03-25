import {
  Collection,
  Entity,
  OneToMany,
  OneToOne,
  Property,
} from '@mikro-orm/core';

import { BaseEntity } from '../../@common/entities/base.entity';
import { WalletTransaction } from './wallet-transaction.entity';
import { User } from '../../users/entities/user.entity';

@Entity()
export class Wallet extends BaseEntity {
  @OneToOne(() => User, (user) => user.wallet, { orphanRemoval: true })
  user!: User;

  @OneToMany(() => WalletTransaction, (transaction) => transaction.wallet)
  transactions = new Collection<WalletTransaction>(this);

  @Property()
  balance: number = 0;

  @Property()
  currency: string = 'GHS';
}
