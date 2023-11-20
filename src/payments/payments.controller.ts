import { Body, Controller, Get, Patch, Post } from '@nestjs/common';

import { PaymentsService } from './services/payments.service';
import { PaymentMethodsService } from './services/payment-methods.service';
import { ApiBadRequestResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { Auth } from '../auth/decorators/auth.decorator';
import { User } from '../auth/decorators/user.decorator';
import { CreatePaymentMethodDto } from './dto/create-payment-method.dto';
import { ResponseMessage } from '../@common/decorators/response.message.decorator';

@ApiTags('payments')
@Controller('payments')
export class PaymentsController {
  constructor(
    private readonly paymentsService: PaymentsService,
    private readonly paymentMethodsService: PaymentMethodsService,
  ) { }

  @Auth()
  @Post('methods')
  @ApiOkResponse()
  @ApiBadRequestResponse()
  @ResponseMessage('payment method created')
  createPaymentMethod(
    @User('id') id: string,
    @Body() body: CreatePaymentMethodDto,
  ) {
    return this.paymentMethodsService.create(id, body);
  }

  @Auth()
  @Get('methods/user')
  @ApiOkResponse()
  @ApiBadRequestResponse()
  @ResponseMessage('payment methods for user retrieved')
  findAllPaymentMethodsForUser(@User('id') id: string) {
    return this.paymentMethodsService.findAllByUser(id);
  }
}
