import { BadRequestException, Body, Controller, HttpException, Param, Patch } from '@nestjs/common';
import { ApiBadRequestResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger';

import { ResponseMessage } from '../../@common/decorators/response.message.decorator';
import { Auth } from '../../auth/decorators/auth.decorator';
import { User } from '../../auth/decorators/user.decorator';

import { CreateProfile } from '../dto/create.profile.dto';

import { KycService } from '../kyc.service';
import { CreateIdentity } from '../dto/create.identity.dto';
import { CreateBusiness } from '../dto/create.business.dto';

@Controller('kyc')
  @ApiTags('kyc')
export class KycController {
  constructor(private readonly kycService: KycService) { }

  @Auth()
  @Patch('create/profile')
  @ApiOkResponse()
  @ApiBadRequestResponse()
  @ResponseMessage('profile created successfully')
  async createProfile(
    @User('id') userId: string,
    @Body() body: CreateProfile,
  ) {
    try {
      return await this.kycService.createProfile(userId, body);
    } catch (e) {
      if (e instanceof HttpException) {
        throw e;
      }

      throw new BadRequestException(e.message);
    }
  }

  @Auth()
  @Patch('create/identity')
  @ApiOkResponse()
  @ApiBadRequestResponse()
  @ResponseMessage('identity created successfully')
  async createIdentity(
    @User('id') userId: string,
    @Body() body: CreateIdentity,
  ) {
    try {
      return await this.kycService.createIdentity(userId, body);
    } catch (e) {
      if (e instanceof HttpException) {
        throw e;
      }

      throw new BadRequestException(e.message);
    }
  }

  @Auth()
  @Patch('create/business')
  @ApiOkResponse()
  @ApiBadRequestResponse()
  @ResponseMessage('business created successfully')
  async createBusiness(
    @User('id') userId: string,
    @Body() body: CreateBusiness,
  ) {
    try {
      return await this.kycService.createBusiness(userId, body);
    } catch (e) {
      if (e instanceof HttpException) {
        throw e;
      }

      throw new BadRequestException(e.message);
    }
  }
}