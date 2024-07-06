import { Entity, Enum, ManyToOne, Property } from '@mikro-orm/core';

import { Status } from '../../../enums/status.enum';

import { BaseEntity } from '../base.entity';
import { WalletTransaction } from './wallet-transaction.entity';
import { User } from '../users/user.entity';

@Entity()
export class WalletTransactionChange extends BaseEntity {
    @ManyToOne({ entity: () => WalletTransaction }) // or use options object
    transaction!: WalletTransaction;

    @ManyToOne({ entity: () => User }) // or use options object
    updatedBy!: User;

    @Enum({ items: () => Status })
    status!: Status;

    @Property()
    startDate: Date = new Date();

    @Property({ nullable: true })
    endDate?: Date;

    @Property({ nullable: true })
    reason?: string;
}
