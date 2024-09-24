import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { OnEvent } from '@nestjs/event-emitter';

import { CreateRequestContext, MikroORM } from '@mikro-orm/core';
import { EntityManager } from '@mikro-orm/postgresql';

import { ZeepayService } from '@adbox/zeepay';
import { DebitRequest } from '@adbox/zeepay/interfaces/mobile-wallet.interface';
import { Request, JunipayService, Provider, Channel as JunipayChannel } from '@adbox/junipay';

import { WALLET_TOP_UP_INITIATED } from '@common/constants/events.constant';

import { Status } from '@common/enums/status.enum';
import { PaymentProvider } from '@common/enums/payment.provider.enum';
import { Network } from '../enums/network.enum';
import { Channel } from '../enums/channel.enum';

import { Payment } from '@common/db/entities';


import { WalletTopUpInitiatedEvent } from '@app/wallets/events/wallet-top-up-initiated.event';

import { PaymentRepository } from '@common/db/repositories';
import { OtlpLogger } from '@common/loggers/otlp.logger';

@Injectable()
export class WalletTopUpInitiatedListener {
  private readonly logger = new OtlpLogger(WalletTopUpInitiatedListener.name);

  constructor(
    private readonly config: ConfigService,
    private readonly orm: MikroORM,
    private readonly em: EntityManager,
    private readonly zeepayService: ZeepayService,
    private readonly junipay: JunipayService,
    private readonly paymentRepository: PaymentRepository,

  ) { }

  @OnEvent(WALLET_TOP_UP_INITIATED, { async: true })
  @CreateRequestContext()
  async handleWalletTopUpInitiatedEvent(event: WalletTopUpInitiatedEvent) {
    this.logger.debug('WALLET TOP UP INITIATED LISTENER: ', { ...event });

    const createdPayment = await this.paymentRepository.create(
      event.userId, event.walletId, event.paymentMethodId, event.amount
    );

    if (!createdPayment) {
      this.logger.log('Payment not created');
      this.logger.debug('WALLET TOP UP INITIATED LISTENER COMPLETED: ');

      return;
    }

    const { request, response } = await this.initiatePaymentRequest(createdPayment);

    if (!(response as any).isSuccessful) {
      this.logger.error('Payment request failed', { request, response });

      await this.paymentRepository.update(createdPayment.id, {
        status: Status.FAILED,
        channelResponse: JSON.stringify(response),
        channelRequest: JSON.stringify(request),
      });
    } else {
      await this.paymentRepository.update(createdPayment.id, {
        status: Status.PENDING,
        channelResponse: JSON.stringify(response),
        channelRequest: JSON.stringify(request),
      });
    }

    this.logger.debug('WALLET TOP UP INITIATED LISTENER COMPLETED: ');

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
        amount: payment.amount / 100,
        provider: this.mapJunipayProvider(payment.channelDetails.network as Network),
        senderEmail: payment.user?.email || 'adzamkomla.dev@gmail.com'
      };

      const response = await this.junipay.payment(request);

      return { response, request };
    }
  }

  private mapJunipayProvider(network: Network) {
    switch (network) {
      case Network.AIRTEL_TIGO:
        return Provider.AIRTEL_TIGO;
      case Network.MTN:
        return Provider.MTN;
      case Network.TELECEL:
        return Provider.TELECEL;
      default:
        return Provider.MTN
    }
  }

  private mapJunipayChannel(channel: Channel) {
    switch (channel) {
      case Channel.MOBILE_MONEY:
        return JunipayChannel.MOBILE_MONEY;
      case Channel.DEBIT_CARD:
      case Channel.CREDIT_CARD:
        return JunipayChannel.CARD;
      default:
        return JunipayChannel.MOBILE_MONEY;
    }
  }
}
