import { Entity, Enum, OneToOne, Property } from '@mikro-orm/core';

import { Status } from '../../@common/enums/status.enum';

import { BaseEntity } from '../../@common/entities/base.entity';
import { User } from '../../users/entities/user.entity';

@Entity()
export class Campaign extends BaseEntity {
  @OneToOne(() => User, (user) => user.campaign, { orphanRemoval: true })
  user!: User;

  @Property({ index: true })
  name!: string;

  @Property()
  demographic!: string;

  @Property()
  targetAge!: number;

  @Property()
  targetReach!: number;

  @Property()
  budget!: number;

  @Property()
  link!: string;

  @Property()
  start!: Date;

  @Property()
  end!: Date;

  @Enum({ items: () => Status })
  status!: Status;
}
