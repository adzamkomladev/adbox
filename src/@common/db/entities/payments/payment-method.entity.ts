import { Entity, Enum, ManyToOne, Property } from '@mikro-orm/core';

import { Status } from '../../../enums/status.enum';
import { Channel } from '@app/payments/enums/channel.enum';
import { Network } from '@app/payments/enums/network.enum';

import { BaseEntity } from '../base.entity';
import { User } from '../users/user.entity';

@Entity()
export class PaymentMethod extends BaseEntity {
  @ManyToOne({ entity: () => User }) // or use options object
  user!: User;

  @Property()
  currency: string = 'GHS';

  @Enum({ items: () => Channel })
  channel!: Channel;

  @Enum({ items: () => Network })
  network!: Network;

  @Property()
  networkCode!: string;

  @Property()
  accountNumber!: string;

  @Property()
  accountName!: string;

  @Enum({ items: () => Status })
  status!: Status;
}
