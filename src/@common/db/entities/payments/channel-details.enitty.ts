import { Embeddable, Property } from '@mikro-orm/core';

@Embeddable()
export class ChannelDetails {
  @Property()
  accountNumber!: string;

  @Property()
  accountName!: string;

  @Property()
  network!: string;

  @Property()
  networkCode!: string;
}
