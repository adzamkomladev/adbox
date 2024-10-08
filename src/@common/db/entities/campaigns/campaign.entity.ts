import { Collection, Entity, Enum, ManyToOne, OneToMany, Property } from '@mikro-orm/core';

import { Status } from '../../../enums/status.enum';

import { BaseEntity } from '../base.entity';
import { User } from '../users/user.entity';
import { Interaction } from './interaction.entity';
import { Comment } from './comment.entity';

@Entity()
export class Campaign extends BaseEntity {
  @ManyToOne({ entity: () => User })
  user!: User;

  @OneToMany(() => Interaction, (interaction) => interaction.campaign)
  interactions = new Collection<Interaction>(this);

  @OneToMany(() => Comment, (comment) => comment.campaign)
  comments = new Collection<Comment>(this);

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

  @Property({ default: 0 })
  fee!: number;

  @Property()
  perInteractionCost!: number;

  @Property()
  asset!: string;

  @Property()
  start!: Date;

  @Property()
  end!: Date;

  @Enum({ items: () => Status })
  status!: Status;

  @Property({ default: 0 })
  likes!: number;

  @Property({ default: 0 })
  views!: number;
}
