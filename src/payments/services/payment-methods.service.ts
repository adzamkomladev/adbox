import { BadRequestException, Injectable } from '@nestjs/common';

import { PhoneService } from '@adbox/utils';

import { Status } from '@common/enums/status.enum';
import { Channel } from '../enums/channel.enum';

import { PaymentMethod } from '@common/db/entities';

import { CreatePaymentMethodDto } from '../dto/create-payment-method.dto';

import { PaymentMethodRepository } from '@common/db/repositories';

@Injectable()
export class PaymentMethodsService {
  constructor(
    private readonly paymentMethodRepository: PaymentMethodRepository,
    private readonly phoneService: PhoneService,
  ) { }

  async create(
    {
      accountName,
      accountNumber,
      network,
      channel,
      networkCode,
    }: CreatePaymentMethodDto,
    userId: string
  ) {
    if (channel === Channel.MOBILE_MONEY) {
      accountNumber = this.phoneService.format(accountNumber, networkCode);
    }

    const paymentMethod = await this.paymentMethodRepository.create(userId, {
      accountName: accountName,
      accountNumber: accountNumber,
      network: network,
      channel: channel,
      status: Status.ACTIVE,
      networkCode: networkCode
    });

    if (!paymentMethod) throw new BadRequestException('failed to create payment method');

    return paymentMethod;
  }

  async findAllByUser(userId: string): Promise<PaymentMethod[]> {
    return await this.paymentMethodRepository.findAll({ user: { id: userId } });
  }

  async findOne(id: string): Promise<PaymentMethod> {
    return await this.paymentMethodRepository.findOne({ id })
  }
}
