import { Embeddable, Enum, Property } from '@mikro-orm/core';

import { DetailsType } from '../enums/details.type.enum';

@Embeddable({ abstract: true, discriminatorColumn: 'type' })
export abstract class Details {
    @Enum(() => DetailsType)
    type!: DetailsType;

    @Property()
    level!: number;
}