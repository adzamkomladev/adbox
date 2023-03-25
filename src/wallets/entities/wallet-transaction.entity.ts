import { Entity, Enum, ManyToOne, Property } from '@mikro-orm/core';

import { Status } from '../../@common/enums/status.enum';
import { TransactionType } from '../enums/transacton-type.enum';

import { BaseEntity } from '../../@common/entities/base.entity';
import { Wallet } from './wallet.entity';

@Entity()
export class WalletTransaction extends BaseEntity {
  @ManyToOne()
  wallet!: Wallet;

  @Property()
  amount!: number;

  @Property()
  before!: number;

  @Property()
  after!: number;

  @Property()
  reference!: string;

  @Property({ nullable: true })
  description?: string;

  @Enum({ items: () => TransactionType })
  type!: TransactionType;

  @Enum({ items: () => Status })
  status!: Status;
}
