import { Controller, Post, Body } from '@nestjs/common';

import { WebhooksService } from './webhooks.service';

@Controller('webhooks')
export class WebhooksController {
  constructor(private readonly webhooksService: WebhooksService) {}

  @Post('/zeepay')
  handleZeepay(@Body() createWebhookDto: any) {
    return this.webhooksService.handleZeepay(createWebhookDto);
  }
}
