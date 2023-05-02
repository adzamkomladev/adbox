import { Module } from '@nestjs/common';

import { MikroOrmModule } from '@mikro-orm/nestjs';

import { Webhook } from './entities/webhook.entity';

import { WebhooksService } from './webhooks.service';

import { ZeepayWebhookReceivedListener } from './listeners/zeepay-webhook-received.listener';

import { WebhooksController } from './webhooks.controller';

@Module({
  imports: [MikroOrmModule.forFeature([Webhook])],
  controllers: [WebhooksController],
  providers: [WebhooksService, ZeepayWebhookReceivedListener],
})
export class WebhooksModule {}
