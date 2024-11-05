import { Controller, Post, Body, HttpCode } from '@nestjs/common';

import { WebhooksService } from './webhooks.service';

@Controller('webhooks')
export class WebhooksController {
  constructor(private readonly webhooksService: WebhooksService) { }

  @Post('/zeepay')
  @HttpCode(200)
  handleZeepay(@Body() body: any) {
    return this.webhooksService.handleZeepay(body);
  }

  @Post('/junipay')
  @HttpCode(200)
  handleJunipay(@Body() body: any) {
    return this.webhooksService.handleJunipay(body);
  }

  @Post('/paystack')
  @HttpCode(200)
  handlePaystack(@Body() body: any) {
    console.log(body);
    return this.webhooksService.handlePaystack(body);
  }
}
