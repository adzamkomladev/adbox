import {
    Embedded,
    Entity,
    Enum,
    ManyToOne,
    Property,
} from '@mikro-orm/core';

import { Status } from '../../@common/enums/status.enum';

import { BaseEntity } from '../../@common/entities/base.entity';
import { User } from '../../users/entities/user.entity';
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

    @Property({ nullable: true })
    reason?: string;

    @Embedded({ entity: () => Identity, object: true, nullable: true })
    identity?: Identity;

    @Embedded({ entity: () => Business, object: true, nullable: true })
    business?: Business;
}