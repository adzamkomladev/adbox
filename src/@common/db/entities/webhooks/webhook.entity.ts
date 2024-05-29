import { Entity, Enum, Property } from '@mikro-orm/core';

import { Service } from '../../../enums/service.enum';

import { BaseEntity } from '../base.entity';


@Entity()
export class Webhook extends BaseEntity {
  @Property()
  data!: string;

  @Enum({ items: () => Service })
  service!: Service;
}
