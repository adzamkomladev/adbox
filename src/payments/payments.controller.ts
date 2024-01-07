import { BadRequestException, Body, Controller, Get, HttpException, Patch, Post } from '@nestjs/common';

import { PaymentsService } from './services/payments.service';
import { PaymentMethodsService } from './services/payment-methods.service';
import { ApiBadRequestResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { Auth } from '../auth/decorators/auth.decorator';
import { User } from '../auth/decorators/user.decorator';
import { CreatePaymentMethodDto } from './dto/create-payment-method.dto';
import { ResponseMessage } from '../@common/decorators/response.message.decorator';
import { User as UserEntity } from '../users/entities/user.entity';

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
  async createPaymentMethod(
    @User() user: UserEntity,
    @Body() body: CreatePaymentMethodDto,
  ) {
    try {
      return await this.paymentMethodsService.create(body, user);
    } catch (e) {
      if (e instanceof HttpException) {
        throw e;
      }

      throw new BadRequestException(e.message);
    }
  }

  @Auth()
  @Get('methods/user')
  @ApiOkResponse()
  @ApiBadRequestResponse()
  @ResponseMessage('payment methods for user retrieved')
  async findAllPaymentMethodsForUser(@User('id') id: string) {
    try {
      return await this.paymentMethodsService.findAllByUser(id);
    } catch (e) {
      if (e instanceof HttpException) {
        throw e;
      }

      throw new BadRequestException(e.message);
    }
  }
}
