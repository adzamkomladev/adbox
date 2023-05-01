import { Injectable } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';

@Injectable()
export class WebhooksService {
  constructor(private readonly event: EventEmitter2) {}
  handleZeepay(request: any) {
    return 'This action adds a new webhook';
  }
}
