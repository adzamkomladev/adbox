import { Entity, Enum, ManyToOne, Property } from '@mikro-orm/core';

import { Status } from '../../@common/enums/status.enum';
import { Channel } from '../enums/channel.enum';
import { Network } from '../enums/network.enum';

import { BaseEntity } from '../../@common/entities/base.entity';
import { User } from '../../users/entities/user.entity';

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
