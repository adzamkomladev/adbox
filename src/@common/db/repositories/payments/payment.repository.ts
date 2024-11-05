import { Injectable } from '@nestjs/common';

import { EntityManager, wrap } from '@mikro-orm/postgresql';

import { TokenService } from '@adbox/utils';

import { Status } from '@common/enums/status.enum';
import { Payment, PaymentMethod, User } from '@common/db/entities';
import { OtlpLogger } from '@common/loggers/otlp.logger';

import { Activity } from "@app/wallets/enums/activity.enum";
import { Channel } from '../../../../payments/enums/channel.enum';

@Injectable()
export class PaymentRepository {
    private readonly logger = new OtlpLogger(PaymentRepository.name);

    constructor(
        private readonly em: EntityManager,
        private readonly tokenService: TokenService
    ) { }

    async findOne(filter: { reference: string, status?: Status }) {
        return await this.em.findOne(Payment, filter);
    }
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

    async createPaystackPayment(userId: string, walletId: string, amount: number) {
        const payment = this.em.create(Payment, {
            user: this.em.getReference(User, userId),
            walletId,
            amount,
            reference: this.tokenService.generatePaymentRef('ADBOX'),
            status: Status.INITIATED,
            activity: Activity.WALLET_TOP_UP,
            channel: Channel.MOBILE_MONEY,
            channelDetails: {
                network: 'paystack',
                networkCode: 'paystack',
                accountNumber: 'paystack',
                accountName: 'paystack'
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

    async updateStatus(filter: { reference: string, status?: Status }, status: Status) {
        const em = this.em.fork();

        const payment = await em.findOne(Payment, filter);

        if (!payment) return null;

        wrap(payment).assign({ status });

        await em.persistAndFlush(payment);

        return payment;
    }
}
