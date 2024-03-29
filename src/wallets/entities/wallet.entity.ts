import {
  Collection,
  Entity,
  Enum,
  OneToMany,
  OneToOne,
  Property,
} from '@mikro-orm/core';

import { Status } from '../../@common/enums/status.enum';

import { BaseEntity } from '../../@common/entities/base.entity';
import { WalletTransaction } from './wallet-transaction.entity';
import { User } from '../../users/entities/user.entity';

@Entity()
export class Wallet extends BaseEntity {
  @OneToOne(() => User, (user) => user.wallet, {
    owner: true,
    nullable: true,
  })
  user!: User;

  @OneToMany(() => WalletTransaction, (transaction) => transaction.wallet)
  transactions = new Collection<WalletTransaction>(this);

  @Property()
  balance: number = 0;

  @Property()
  currency: string = 'GHS';

  @Enum({ items: () => Status })
  status!: Status;
}
