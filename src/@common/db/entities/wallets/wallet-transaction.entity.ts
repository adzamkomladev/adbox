import { Collection, Entity, Enum, ManyToOne, OneToMany, OneToOne, Property } from '@mikro-orm/core';

import { Status } from '../../../enums/status.enum';
import { TransactionType } from '../../../../wallets/enums/transaction-type.enum';

import { BaseEntity } from '../base.entity';
import { Wallet } from './wallet.entity';
import { Payment } from '../payments/payment.entity';
import { WalletTransactionChange } from './wallet-transaction-change.entity';

@Entity()
export class WalletTransaction extends BaseEntity {
  @ManyToOne({ entity: () => Wallet }) // or use options object
  wallet!: Wallet;

  @OneToOne(() => Payment, (payment) => payment.walletTransaction, {
    owner: true,
    nullable: true,
  })
  payment?: Payment;

  @OneToMany(() => WalletTransactionChange, (change) => change.transaction)
  changes = new Collection<WalletTransactionChange>(this);

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
