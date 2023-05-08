import { Injectable } from '@nestjs/common';

import { InjectRepository } from '@mikro-orm/nestjs';
import { EntityRepository } from '@mikro-orm/core';

import { PaymentMethod } from '../entities/payment-method.entity';
import { CreatePaymentMethodDto } from '../dto/create-payment-method.dto';
import { Status } from '../../@common/enums/status.enum';
import { PhoneService } from '@adbox/utils';
import { Channel } from '../enums/channel.enum';

@Injectable()
export class PaymentMethodsService {
  constructor(
    @InjectRepository(PaymentMethod)
    private readonly paymentRepository: EntityRepository<PaymentMethod>,
    private readonly phoneService: PhoneService,
  ) {}

  async create(
    userId: string,
    {
      accountName,
      accountNumber,
      network,
      channel,
      networkCode,
    }: CreatePaymentMethodDto,
  ) {
    if (channel === Channel.MOBILE_WALLET) {
      accountNumber = this.phoneService.format(accountNumber, networkCode);
    }

    const payment = this.paymentRepository.create({
      user: userId,
      accountName,
      accountNumber,
      network,
      channel,
      status: Status.ACTIVE,
      networkCode,
    });

    await this.paymentRepository.persistAndFlush(payment);

    return payment;
  }

  async findAllByUser(userId: string): Promise<PaymentMethod[]> {
    return this.paymentRepository.find({ user: userId });
  }
}
