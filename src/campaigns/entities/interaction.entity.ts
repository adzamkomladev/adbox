import { Entity, ManyToOne, Property } from '@mikro-orm/core';

import { BaseEntity } from '../../@common/entities/base.entity';
import { User } from '../../users/entities/user.entity';
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
