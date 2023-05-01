import { Entity, Property } from '@mikro-orm/core';

import { BaseEntity } from '../../@common/entities/base.entity';

@Entity()
export class Webhook extends BaseEntity {
  @Property()
  data!: string;
}
