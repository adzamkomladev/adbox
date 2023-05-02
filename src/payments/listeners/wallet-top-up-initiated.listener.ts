import {Injectable, Logger} from '@nestjs/common';
import {OnEvent} from '@nestjs/event-emitter';

import {EntityRepository, wrap} from '@mikro-orm/core';
import {InjectRepository} from '@mikro-orm/nestjs';

import {ZeepayService} from '@adbox/zeepay';

import {WALLET_TOP_UP_INITIATED} from '../../@common/constants/events.constant';

import {Status} from '../../@common/enums/status.enum';

import {Payment} from '../entities/payment.entity';
import {PaymentMethod} from '../entities/payment-method.entity';

import {DebitRequest} from '@adbox/zeepay/interfaces/mobile-wallet.interface';

import {WalletTopUpInitiatedEvent} from '../../wallets/events/wallet-top-up-initiated.event';

import {UsersService} from '../../users/users.service';
import {Activity} from "../../wallets/enums/activity.enum";

@Injectable()
export class WalletTopUpInitiatedListener {
  private readonly logger: Logger;

  constructor(
    private readonly zeepayService: ZeepayService,
    @InjectRepository(Payment)
    private readonly paymentRepository: EntityRepository<Payment>,
    @InjectRepository(PaymentMethod)
    private readonly paymentMethodRepository: EntityRepository<PaymentMethod>,
    private readonly usersService: UsersService,
  ) {
    this.logger = new Logger(WalletTopUpInitiatedListener.name);
  }

  @OnEvent(WALLET_TOP_UP_INITIATED, { async: true })
  async handleWalletTopUpInitiatedEvent(event: WalletTopUpInitiatedEvent) {
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
      reference: 'jdjdkjfkjdf',
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

    await this.paymentRepository.persistAndFlush(payment);

    return payment;
  }

  private async initiatePaymentRequest(payment: Payment) {
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

  private async updatePayment({ request, response, status, paymentId }) {
    const payment = await this.paymentRepository.findOneOrFail(paymentId);

    await wrap(payment).assign({
      status,
      channelResponse: JSON.stringify(response),
      channelRequest: JSON.stringify(request),
    });
    await this.paymentRepository.persistAndFlush(payment);

    return payment;
  }
}
