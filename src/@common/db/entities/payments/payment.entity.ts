import {
  Embedded,
  Entity,
  Enum,
  ManyToOne,
  OneToOne,
  Property,
} from '@mikro-orm/core';

import { Status } from '../../../enums/status.enum';
import { Channel } from '../../../../payments/enums/channel.enum';
import { Activity } from '../../../../wallets/enums/activity.enum';

import { BaseEntity } from '../base.entity';
import { ChannelDetails } from './channel-details.entity';
import { WalletTransaction } from '../wallets/wallet-transaction.entity';
import { User } from '../users/user.entity';

@Entity()
export class Payment extends BaseEntity {
  @OneToOne(
    () => WalletTransaction,
    (walletTransaction) => walletTransaction.payment,
    { orphanRemoval: true },
  )
  walletTransaction?: WalletTransaction;

  @ManyToOne({ entity: () => User }) // or use options object
  user!: User;

  @Property({ nullable: true })
  walletId?: string;

  @Property()
  amount: number = 0;

  @Property()
  currency: string = 'GHS';

  @Embedded({ entity: () => ChannelDetails, object: true })
  channelDetails!: ChannelDetails;

  @Enum({ items: () => Channel })
  channel!: Channel;

  @Property()
  reference: string;

  @Property({ nullable: true })
  channelRequest?: string;

  @Property({ nullable: true })
  channelResponse?: string;

  @Enum({ items: () => Status })
  status!: Status;

  @Enum({ items: () => Activity })
  activity!: Activity;
}
