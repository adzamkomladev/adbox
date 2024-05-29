import {
    Embedded,
    Entity,
    Enum,
    ManyToOne,
    Property,
} from '@mikro-orm/core';

import { Status } from '../../../enums/status.enum';

import { BaseEntity } from '../base.entity';
import { User } from '../users/user.entity';
import { Kyc } from './kyc.entity';
import { Identity } from './identity.entity';
import { Business } from './business.entity';

@Entity()
export class Attempt extends BaseEntity {
    @ManyToOne({ entity: () => Kyc })
    kyc!: Kyc;

    @ManyToOne({ entity: () => User, nullable: true })
    updatedBy?: User;

    @Enum({ items: () => Status })
    status!: Status;

    @Property()
    level: number = 1;

    @Property({ nullable: true })
    reason?: string;

    @Embedded({ entity: () => [Identity, Business], object: true, nullable: true })
    details!: Identity | Business;
}
