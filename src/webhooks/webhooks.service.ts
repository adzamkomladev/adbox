import { Injectable } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';

import { ZEEPAY_WEBHOOK_RECEIVED } from '../@common/constants/events.constant';

import { ZeepayWebhookReceivedEvent } from './events/zeepay-webhook-received.event';

@Injectable()
export class WebhooksService {
  constructor(private readonly event: EventEmitter2) { }

  handleZeepay(request: any) {
    const event = new ZeepayWebhookReceivedEvent();
    event.payload = request;
    this.event.emit(ZEEPAY_WEBHOOK_RECEIVED, event);

    return 'This action adds a new webhook';
  }

  handleJunipay(payload: any) {
    console.log('this is junipay webhook: ', payload);
    return 'OK';
  }
}
