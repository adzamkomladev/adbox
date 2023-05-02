import {
  BeforeCreate,
  Collection,
  Entity,
  Enum,
  OneToMany,
  OneToOne,
  Property,
} from '@mikro-orm/core';

import * as bcrypt from 'bcrypt';
import { Exclude } from 'class-transformer';

import { Status } from '../../@common/enums/status.enum';
import { Role } from '../../@common/enums/role.enum';
import { Sex } from '../enums/sex.enum';

import { BaseEntity } from '../../@common/entities/base.entity';
import { Wallet } from '../../wallets/entities/wallet.entity';
import { Payment } from '../../payments/entities/payment.entity';
import { PaymentMethod } from '../../payments/entities/payment-method.entity';

@Entity()
export class User extends BaseEntity {
  @OneToOne(() => Wallet, (wallet) => wallet.user, {
    owner: true,
    nullable: true,
  })
  wallet?: Wallet;

  @OneToMany(() => Payment, (payment) => payment.user)
  payments = new Collection<Payment>(this);

  @OneToMany(() => PaymentMethod, (paymentMethod) => paymentMethod.user)
  paymentMethods = new Collection<PaymentMethod>(this);

  @Property({ length: 200, index: true })
  name!: string;

  @Property({ columnType: 'text' })
  avatar!: string;

  @Property({ length: 100, unique: true })
  email!: string;

  @Property({ nullable: true, hidden: true })
  @Exclude()
  password?: string;

  @Property({ columnType: 'date', nullable: true })
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
