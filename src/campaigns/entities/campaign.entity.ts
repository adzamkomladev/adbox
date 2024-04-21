import { Entity, Enum, ManyToOne, OneToOne, Property } from '@mikro-orm/core';

import { Status } from '../../@common/enums/status.enum';

import { BaseEntity } from '../../@common/entities/base.entity';
import { User } from '../../users/entities/user.entity';

@Entity()
export class Campaign extends BaseEntity {
  @ManyToOne({ entity: () => User })
  user!: User;

  @Property({ index: true })
  name!: string;

  @Property({ type: 'text', nullable: true })
  description?: string;

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
