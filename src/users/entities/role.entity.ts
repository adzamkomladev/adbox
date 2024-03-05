import {
    Collection,
    Entity,
    OneToMany,
    Property,
} from '@mikro-orm/core';

import { BaseEntity } from '../../@common/entities/base.entity';
import { User } from './user.entity';

@Entity()
export class Role extends BaseEntity {
    @OneToMany(() => User, (user) => user.role)
    users = new Collection<User>(this);

    @Property({ length: 200, index: true })
    name!: string;

    @Property({ columnType: 'text' })
    description!: string;

    @Property({ length: 100, unique: true })
    code!: string;
}
