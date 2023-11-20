import { Injectable } from '@nestjs/common';

import { EntityRepository } from '@mikro-orm/core';
import { EntityManager } from '@mikro-orm/postgresql';
import { InjectRepository } from '@mikro-orm/nestjs';

import { PhoneService } from '@adbox/utils';

import { Status } from '@common/enums/status.enum';
import { Channel } from '../enums/channel.enum';

import { PaymentMethod } from '../entities/payment-method.entity';

import { CreatePaymentMethodDto } from '../dto/create-payment-method.dto';

@Injectable()
export class PaymentMethodsService {
  constructor(
    private readonly em: EntityManager,
    @InjectRepository(PaymentMethod)
    private readonly paymentMethodRepository: EntityRepository<PaymentMethod>,
    private readonly phoneService: PhoneService,
  ) { }

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

    const payment = this.paymentMethodRepository.create({
      user: userId,
      accountName,
      accountNumber,
      network,
      channel,
      status: Status.ACTIVE,
      networkCode,
    });

    await this.em.persistAndFlush(payment);

    return payment;
  }

  async findAllByUser(userId: string): Promise<PaymentMethod[]> {
    return await this.paymentMethodRepository.find({ user: userId });
  }

  async findOne(id: string): Promise<PaymentMethod> {
    return await this.paymentMethodRepository.findOne({ id })
  }
}
