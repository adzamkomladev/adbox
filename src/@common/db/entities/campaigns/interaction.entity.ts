import { Entity, ManyToOne, Property } from '@mikro-orm/core';

import { BaseEntity } from '../base.entity';
import { User } from '../users/user.entity';
import { Campaign } from './campaign.entity';

@Entity()
export class Interaction extends BaseEntity {
    @ManyToOne({ entity: () => User })
    user!: User;

    @ManyToOne({ entity: () => Campaign })
    campaign!: Campaign;

    @Property({ default: false })
    liked!: boolean;

    @Property({ default: 0 })
    credit!: number;

    @Property({ default: 0 })
    views!: number;
}
