import { Injectable } from '@nestjs/common';

import { Channel } from '../enums/channel.enum';
import { Network } from '../enums/network.enum';

@Injectable()
export class PaymentsService {

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
}
