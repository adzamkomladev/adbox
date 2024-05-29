import { Injectable } from '@nestjs/common';

import { EntityRepository } from '@mikro-orm/core';
import { EntityManager } from '@mikro-orm/postgresql';
import { InjectRepository } from '@mikro-orm/nestjs';

import { PhoneService } from '@adbox/utils';

import { Status } from '@common/enums/status.enum';
import { Channel } from '../enums/channel.enum';

import { PaymentMethod } from '../../@common/db/entities/payments/payment-method.entity';

import { CreatePaymentMethodDto } from '../dto/create-payment-method.dto';
import { User } from '../../@common/db/entities/users/user.entity';

@Injectable()
export class PaymentMethodsService {
  constructor(
    private readonly em: EntityManager,
    @InjectRepository(PaymentMethod)
    private readonly paymentMethodRepository: EntityRepository<PaymentMethod>,
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
    user: User
  ) {
    if (channel === Channel.MOBILE_WALLET) {
      accountNumber = this.phoneService.format(accountNumber, networkCode);
    }

    const payment = new PaymentMethod();
    payment.accountName = accountName,
      payment.accountNumber = accountNumber,
      payment.network = network,
      payment.channel = channel,
      payment.status = Status.ACTIVE,
      payment.networkCode = networkCode,
      payment.user = user;

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
