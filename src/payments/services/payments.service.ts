import { BadRequestException, Injectable } from '@nestjs/common';

import { Channel } from '../enums/channel.enum';
import { Network } from '../enums/network.enum';
import { AuthenticatedUser } from '@common/dto/authenticated.user.dto';
import { InitiatePaymentDto } from '../dto/initiate-payment.dto';
import { PaymentRepository } from '@common/db/repositories';
import { PaystackService } from '@adbox/paystack';
import { Status } from '../../@common/enums/status.enum';

@Injectable()
export class PaymentsService {

  constructor(
    private readonly paystackService: PaystackService,
    private readonly paymentRepository: PaymentRepository
  ) { }

  getPaymentConfigs() {
    return {
      channels: [
        {
          value: Channel.MOBILE_MONEY,
          name: 'Mobile Money',
          networks: [
            {
              image: 'https://upload.wikimedia.org/wikipedia/commons/a/af/MTN_Logo.svg',
              value: Network.MTN,
              name: 'MTN',
              code: 'GH'
            },
            {
              image: 'https://play-lh.googleusercontent.com/p5SzuoBaIQp65_8iwuCYV2Rqa7KJygSj_ga6dMLQrqVko-w8lWCxVvSVoHEspQZ_nY3Q=w240-h480-rw',
              value: Network.TELECEL,
              name: 'Telecel',
              code: 'GH'
            },
            {
              image: 'https://www.telecomreviewafrica.com/images/stories/2023/06/AirtelTigo_Rebrands_for_Enhanced_Identification_and_Simplicity.jpg',
              value: Network.AIRTEL_TIGO,
              name: 'AirtelTigo',
              code: 'GH'
            },
          ],
        }
      ]
    }
  }

  async initiatePayment(payload: InitiatePaymentDto, authUser: AuthenticatedUser) {
    const payment = await this.paymentRepository.createPaystackPayment(
      authUser.id,
      payload.walletId,
      payload.amount
    );

    if (!payment) throw new BadRequestException('failed to initiate payment');

    const { status, authorizationUrl, accessCode } = await this.paystackService.payment({
      email: authUser.email,
      reference: payment.reference,
      amount: payload.amount,
      channels: ['mobile_money', 'bank', 'card']
    });

    if (!status) {
      await this.paymentRepository.updateStatus(
        {
          reference: payment.reference,
          status: payment.status
        },
        Status.FAILED
      );

      throw new BadRequestException('failed to initiate payment');
    }


    return {
      authorizationUrl,
      accessCode
    };

  }
}
