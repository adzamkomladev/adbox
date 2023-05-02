import { Entity, Enum, Property } from '@mikro-orm/core';

import { Service } from '../../@common/enums/service.enum';

import { BaseEntity } from '../../@common/entities/base.entity';

@Entity()
export class Webhook extends BaseEntity {
  @Property()
  data!: string;

  @Enum({ items: () => Service })
  service!: Service;
}
