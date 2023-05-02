import { Injectable } from '@nestjs/common';

import { ZeepayService } from '@adbox/zeepay';

@Injectable()
export class PaymentsService {
  constructor(private readonly zeepayService: ZeepayService) {}

  initiateCreditPayment() {
    
  }
}
