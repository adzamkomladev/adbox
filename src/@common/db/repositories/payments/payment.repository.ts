import { Injectable } from '@nestjs/common';

import { EntityManager } from '@mikro-orm/postgresql';

import { TokenService } from '@adbox/utils';

import { Status } from '@common/enums/status.enum';
import { Payment, PaymentMethod, User } from '@common/db/entities';
import { OtlpLogger } from '@common/loggers/otlp.logger';

import { Activity } from "@app/wallets/enums/activity.enum";

@Injectable()
export class PaymentRepository {
    private readonly logger = new OtlpLogger(PaymentRepository.name);

    constructor(
        private readonly em: EntityManager,
        private readonly tokenService: TokenService
    ) { }

    async create(userId: string, walletId: string, paymentMethodId: string, amount: number) {
        const paymentMethod = await this.em.findOne(PaymentMethod, { id: paymentMethodId });

        if (!paymentMethod) return null;

        const payment = this.em.create(Payment, {
            user: this.em.getReference(User, userId),
            walletId,
            amount,
            reference: this.tokenService.generatePaymentRef('ADBOX'),
            status: Status.INITIATED,
            activity: Activity.WALLET_TOP_UP,
            channel: paymentMethod.channel,
            channelDetails: {
                network: paymentMethod.network,
                networkCode: paymentMethod.networkCode,
                accountNumber: paymentMethod.accountNumber,
                accountName: paymentMethod.accountName,
            },
        });

        await this.em.persistAndFlush(payment);

        return payment;
    }

    async update(id: string, { status, channelResponse, channelRequest }: Partial<Payment>) {
        const payment = await this.em.upsert(Payment, { status, channelResponse, channelRequest, id });

        await this.em.flush();

        return payment;
    }
}
