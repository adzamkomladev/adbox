import { BadRequestException, Body, Controller, Get, HttpException, Param, Patch, Query } from '@nestjs/common';
import { ApiBadRequestResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger';

import { ResponseMessage } from '../../@common/decorators/response.message.decorator';
import { User } from '../../auth/decorators/user.decorator';
import { Auth } from '../../auth/decorators/auth.decorator';

import { UpdateStatus } from '../dto/update.status.dto';
import { QueryDto } from '../dto/query.dto';

import { KycService } from '../services/kyc.service';

@Controller('admin/kyc')
@ApiTags('admin kyc')
export class AdminController {
  constructor(private readonly kycService: KycService) { }

  // @Auth()
  @Get()
  @ApiOkResponse()
  @ApiBadRequestResponse()
  @ResponseMessage('all kycs retrieved')
  async findAllKyc(@Query() query: QueryDto) {
    try {
      return await this.kycService.findAllKyc(query);
    } catch (e) {
      if (e instanceof HttpException) {
        throw e;
      }

      throw new BadRequestException(e.message);
    }
  }

  @Auth()
  @Patch(':id/status/update')
  @ApiOkResponse()
  @ApiBadRequestResponse()
  @ResponseMessage('status updated successfully')
  async updateStatus(
    @Param('id') id: string,
    @Body() body: UpdateStatus,
    @User('id') userId: string
  ) {
    try {
      return await this.kycService.updateStatus(id, userId, body);
    } catch (e) {
      if (e instanceof HttpException) {
        throw e;
      }

      throw new BadRequestException(e.message);
    }
  }
}
