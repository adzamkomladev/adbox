import { Injectable } from '@nestjs/common';

import { EntityManager } from '@mikro-orm/postgresql';

import { PaymentMethod, User } from '@common/db/entities';

import { OtlpLogger } from '@common/loggers/otlp.logger';


@Injectable()
export class PaymentMethodRepository {
    private readonly logger = new OtlpLogger(PaymentMethodRepository.name);

    constructor(private readonly em: EntityManager) { }

    async findOne(filter: { id: string }) {
        return await this.em.findOne(PaymentMethod, filter);
    }

    async findAll(filter: { user: { id: string; }; }) {
        return await this.em.findAll(PaymentMethod, { where: filter });
    }

    async create(userId: string, data: Partial<PaymentMethod>) {
        const paymentMethod = this.em.create(PaymentMethod, {
            ...data,
            user: this.em.getReference(User, userId),
        });

        await this.em.persistAndFlush(paymentMethod);

        return paymentMethod;
    }
}
