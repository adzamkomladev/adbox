import { Entity, ManyToOne, Property } from '@mikro-orm/core';

import { BaseEntity } from '../base.entity';
import { User } from '../users/user.entity';
import { Campaign } from './campaign.entity';

@Entity()
export class Comment extends BaseEntity {
    @ManyToOne({ entity: () => User })
    user!: User;

    @ManyToOne({ entity: () => Campaign })
    campaign!: Campaign;

    @Property()
    value!: string;
}
