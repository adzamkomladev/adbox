import {
  BeforeCreate,
  Collection,
  Entity,
  Enum,
  ManyToOne,
  OneToMany,
  OneToOne,
  Property,
} from '@mikro-orm/core';

import * as bcrypt from 'bcrypt';
import { Exclude } from 'class-transformer';

import { Status } from '../../@common/enums/status.enum';
import { Sex } from '../enums/sex.enum';

import { BaseEntity } from '../../@common/entities/base.entity';
import { Wallet } from '../../wallets/entities/wallet.entity';
import { Payment } from '../../payments/entities/payment.entity';
import { PaymentMethod } from '../../payments/entities/payment-method.entity';
import { Campaign } from '../../campaigns/entities/campaign.entity';
import { Role } from './role.entity';
import { Kyc } from '../../kyc/entities/kyc.entity';
import { Attempt } from '../../kyc/entities/attempt.entity';
import { Interaction } from '../../campaigns/entities/interaction.entity';

@Entity()
export class User extends BaseEntity {
  @ManyToOne(() => Role)
  role!: Role;

  @OneToOne(() => Kyc, (kyc) => kyc.user, { orphanRemoval: true })
  kyc!: Kyc;

  @OneToMany(() => Attempt, (attempt) => attempt.updatedBy)
  updatedAttempts = new Collection<Attempt>(this);

  @OneToMany(() => Campaign, (campaign) => campaign.user)
  createdCampaigns = new Collection<Campaign>(this);

  @OneToMany(() => Interaction, (interaction) => interaction.user)
  campaignInteractions = new Collection<Interaction>(this);

  @OneToOne(() => Wallet, (wallet) => wallet.user, { orphanRemoval: true })
  wallet?: Wallet;

  @OneToMany(() => Payment, (payment) => payment.user)
  payments = new Collection<Payment>(this);

  @OneToMany(() => PaymentMethod, (paymentMethod) => paymentMethod.user)
  paymentMethods = new Collection<PaymentMethod>(this);

  @Property({ nullable: true, hidden: true })
  @Exclude()
  firebaseId?: string;

  @Property({ length: 100, index: true, nullable: true })
  firstName?: string;

  @Property({ length: 100, index: true, nullable: true })
  lastName?: string;

  @Property({ columnType: 'text' })
  avatar!: string;

  @Property({ length: 100, unique: true })
  email!: string;

  @Property({ length: 20, nullable: true })
  phone?: string;

  @Property({ nullable: true })
  phoneVerifiedAt?: Date;

  @Property({ nullable: true, hidden: true })
  @Exclude()
  password?: string;

  @Property({ columnType: 'date', nullable: true })
  dateOfBirth?: Date;

  @Enum({ items: () => Sex, nullable: true })
  sex?: Sex;

  @Property({ length: 100, nullable: true })
  roleTitle!: string;

  @Enum({ items: () => Status })
  status!: Status;


  @Property({ persist: false })
  get age() {
    return (new Date()).getFullYear() - this.dateOfBirth.getFullYear();
  }

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
