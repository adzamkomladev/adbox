import { BadRequestException, Body, Controller, Get, HttpException, Post } from '@nestjs/common';
import { ApiBadRequestResponse, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';

import { Auth } from '@app/auth/decorators/auth.decorator';
import { User } from '@app/auth/decorators/user.decorator';
import { ResponseMessage } from '@common/decorators/response.message.decorator';

import { CreatePaymentMethodDto } from './dto/create-payment-method.dto';
import { AuthenticatedUser } from '@common/dto/authenticated.user.dto';

import { OtlpLogger } from '@common/loggers/otlp.logger';
import { PaymentMethodsService } from './services/payment-methods.service';
import { PaymentsService } from './services/payments.service';

@ApiTags('payments')
@Controller('payments')
export class PaymentsController {
  private readonly logger = new OtlpLogger(PaymentsController.name);

  constructor(
    private readonly paymentsService: PaymentsService,
    private readonly paymentMethodsService: PaymentMethodsService
  ) { }

  @Auth()
  @Post('methods')
  @ApiOperation({ summary: 'Used to create payment method for authenticated user' })
  @ApiOkResponse({ description: 'Payment method created' })
  @ApiBadRequestResponse({ description: 'Failed to create payment method' })
  @ResponseMessage('payment method created')
  async createPaymentMethod(
    @User() user: AuthenticatedUser,
    @Body() body: CreatePaymentMethodDto,
  ) {
    try {
      return await this.paymentMethodsService.create(body, user.id);
    } catch (e) {
      this.logger.error(`Failed to create payment method with error ==> ${e}`);

      if (e instanceof HttpException) {
        throw e;
      }

      throw new BadRequestException('failed to create payment method');
    }
  }

  @Auth()
  @Get('methods/user')
  @ApiOperation({ summary: 'Used to retrieve payment methods of authenticated user' })
  @ApiOkResponse({ description: 'Payment methods for user retrieved' })
  @ApiBadRequestResponse({ description: 'Failed to retrieve payment methods for user' })
  @ResponseMessage('payment methods for user retrieved')
  async findAllPaymentMethodsForUser(@User() user: AuthenticatedUser) {
    try {
      return await this.paymentMethodsService.findAllByUser(user.id);
    } catch (e) {
      this.logger.error(`Failed to retrieve payment methods for user with error ==> ${e}`);

      if (e instanceof HttpException) {
        throw e;
      }

      throw new BadRequestException('failed to retrieve payment methods for user');
    }
  }

  @Auth()
  @Get('configs')
  @ApiOperation({ summary: 'Used to retrieve all payment configs' })
  @ApiOkResponse({ description: 'Payment configs retrieved' })
  @ApiBadRequestResponse({ description: 'Failed to retrieve payment configs' })
  @ResponseMessage('payment configs retrieved')
  getPaymentConfigs() {
    try {
      return this.paymentsService.getPaymentConfigs();
    } catch (e) {
      this.logger.error(`Failed to retrieve payment configs with error ==> ${e}`);

      if (e instanceof HttpException) {
        throw e;
      }

      throw new BadRequestException('failed to retrieve payment configs');
    }
  }
}
