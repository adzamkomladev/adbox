import { Injectable, Logger } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';

import { CreateRequestContext, EntityRepository, MikroORM, wrap } from '@mikro-orm/core';
import { InjectRepository } from '@mikro-orm/nestjs';
import { EntityManager } from '@mikro-orm/postgresql';

import { ZeepayService } from '@adbox/zeepay';
import { DebitRequest } from '@adbox/zeepay/interfaces/mobile-wallet.interface';
import { TokenService } from '@adbox/utils';

import { WALLET_TOP_UP_INITIATED } from '@common/constants/events.constant';

import { Status } from '@common/enums/status.enum';
import { Activity } from "@app/wallets/enums/activity.enum";

import { Payment } from '../entities/payment.entity';
import { PaymentMethod } from '../entities/payment-method.entity';


import { WalletTopUpInitiatedEvent } from '@app/wallets/events/wallet-top-up-initiated.event';

import { UsersService } from '@app/users/users.service';
import { ConfigService } from '@nestjs/config';
import { PaymentProvider } from '@common/enums/payment.provider.enum';
import { JunipayService } from '@adbox/junipay';
import { Request } from '@adbox/junipay';
import { Channel as JunipayChannel } from '@adbox/junipay';
import { Provider } from '@adbox/junipay';
import { Network } from '../enums/network.enum';
import { Channel } from '../enums/channel.enum';

@Injectable()
export class WalletTopUpInitiatedListener {
  private readonly logger: Logger;

  constructor(
    private readonly config: ConfigService,
    private readonly orm: MikroORM,
    private readonly em: EntityManager,
    private readonly zeepayService: ZeepayService,
    private readonly junipay: JunipayService,
    @InjectRepository(Payment)
    private readonly paymentRepository: EntityRepository<Payment>,
    @InjectRepository(PaymentMethod)
    private readonly paymentMethodRepository: EntityRepository<PaymentMethod>,
    private readonly usersService: UsersService,
    private readonly tokenService: TokenService
  ) {
    this.logger = new Logger(WalletTopUpInitiatedListener.name);
  }

  @OnEvent(WALLET_TOP_UP_INITIATED, { async: true })
  @CreateRequestContext()
  async handleWalletTopUpInitiatedEvent(event: WalletTopUpInitiatedEvent) {
    this.logger.log('WALLET TOP UP INITIATED LISTENER: ', { ...event });

    const payment = await this.createPayment(event);

    const { request, response } = await this.initiatePaymentRequest(payment);

    this.logger.log(`Payment request and response`, request, response);

    await this.updatePayment({
      request,
      response,
      status: Status.PENDING,
      paymentId: payment.id,
    });
  }

  private async createPayment({
    amount,
    paymentMethodId,
    walletId,
    userId,
  }: WalletTopUpInitiatedEvent) {
    const [user, paymentMethod] = await Promise.all([
      this.usersService.findOne(userId),
      this.paymentMethodRepository.findOneOrFail(paymentMethodId),
    ]);

    const payment = this.paymentRepository.create({
      user,
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

  private async initiatePaymentRequest(payment: Payment) {
    const provider = this.config.get<PaymentProvider>('payments.providers.default');

    if (provider === PaymentProvider.ZEEPAY) {
      const request: DebitRequest = {
        amount: payment.amount,
        phone: payment.channelDetails.accountNumber,
        name: payment.channelDetails.accountName,
        reference: payment.reference,
        description: 'WALLET TOP UP',
      };

      const response = await this.zeepayService.debitMobileWallet(request);

      return { response, request };
    }

    if (provider === PaymentProvider.JUNIPAY) {
      const request: Request = {
        description: 'WALLET TOP UP',
        reference: payment.reference,
        channel: this.mapJunipayChannel(payment.channel),
        phoneNumber: payment.channelDetails.accountNumber,
        amount: payment.amount,
        provider: this.mapJunipayProvider(payment.channelDetails.network as Network),
        senderEmail: payment.user?.email || 'adzamkomla.dev@gmail.com'
      };

      const response = await this.junipay.payment(request);

      return { response, request };
    }
  }

  private async updatePayment({ request, response, status, paymentId }) {
    const payment = await this.paymentRepository.findOneOrFail(paymentId);

    wrap(payment).assign({
      status,
      channelResponse: JSON.stringify(response),
      channelRequest: JSON.stringify(request),
    });
    await this.em.persistAndFlush(payment);

    return payment;
  }

  private mapJunipayProvider(network: Network) {
    switch (network) {
      case Network.AIRTEL_TIGO:
        return Provider.AIRTEL_TIGO;
      case Network.MTN:
        return Provider.MTN;
      case Network.VODAFONE:
        return Provider.VODAFONE;
      default:
        return Provider.MTN
    }
  }

  private mapJunipayChannel(channel: Channel) {
    switch (channel) {
      case Channel.MOBILE_WALLET:
        return JunipayChannel.MOBILE_MONEY;
      case Channel.DEBIT_CARD:
      case Channel.CREDIT_CARD:
        return JunipayChannel.CARD;
      default:
        return JunipayChannel.MOBILE_MONEY;
    }
  }
}
