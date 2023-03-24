import { BeforeCreate, Entity, Enum, Property } from '@mikro-orm/core';

import * as bcrypt from 'bcrypt';

import { Status } from '../../@common/enums/status.enum';
import { Role } from '../../@common/enums/role.enum';
import { Sex } from '../enums/sex.enum';

import { BaseEntity } from '../../@common/entities/base.entity';

@Entity()
export class User extends BaseEntity {
  @Property({ length: 200, index: true })
  name!: string;

  @Property()
  avatar!: string;

  @Property({ length: 100, unique: true })
  email!: string;

  @Property({ nullable: true, hidden: true })
  password?: string;

  @Property({ nullable: true })
  dateOfBirth?: Date;

  @Enum({ items: () => Role, nullable: true })
  role?: Role;

  @Enum({ items: () => Sex, nullable: true })
  sex?: Sex;

  @Enum({ items: () => Status })
  status!: Status;

  @BeforeCreate()
  async hashPassword() {
    if (this.password) {
      const salt = await bcrypt.genSalt();

      this.password = await bcrypt.hash(this.password, salt);
    }
  }

  async validatePassword(password: string): Promise<boolean> {
    return await bcrypt.compare(password, this.password);
  }
}
