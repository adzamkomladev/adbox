import {
    Collection,
    Embedded,
    Entity,
    Filter,
    OneToMany,
    OneToOne,
    Property,
} from '@mikro-orm/core';

import { BaseEntity } from '../base.entity';
import { User } from '../users/user.entity';
import { Attempt } from './attempt.entity';
import { Identity } from './identity.entity';
import { Business } from './business.entity';

@Entity()
export class Kyc extends BaseEntity {
    @OneToOne(() => User, (user) => user.kyc, {
        owner: true,
        nullable: true,
    })
    user?: User;

    @OneToMany(() => Attempt, (attempt) => attempt.kyc)
    attempts = new Collection<Attempt>(this);

    @Property()
    level: number = 1;

    @Property()
    country: string = 'GH';

    @Embedded({ entity: () => Identity, object: true, nullable: true })
    identity?: Identity;

    @Embedded({ entity: () => Business, object: true, nullable: true })
    business?: Business;
}
