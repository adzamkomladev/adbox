import { Module } from '@nestjs/common';

import { WebhooksService } from './webhooks.service';

import { ZeepayWebhookReceivedListener } from './listeners/zeepay-webhook-received.listener';

import { WebhooksController } from './webhooks.controller';

@Module({
  controllers: [WebhooksController],
  providers: [WebhooksService, ZeepayWebhookReceivedListener],
})
export class WebhooksModule {}
