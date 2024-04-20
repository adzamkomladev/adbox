import { BadRequestException, Body, Controller, Get, HttpException, Param, Patch, Post, Query } from '@nestjs/common';
import { ApiBadRequestResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger';

import { ResponseMessage } from '../../@common/decorators/response.message.decorator';
import { Auth } from '../../auth/decorators/auth.decorator';
import { User } from '../../auth/decorators/user.decorator';

import { CreateProfile } from '../dto/create.profile.dto';

import { KycService } from '../services/kyc.service';
import { CreateIdentity } from '../dto/create.identity.dto';
import { CreateBusiness } from '../dto/create.business.dto';
import { User as UserEntity } from '../../users/entities/user.entity';
import { PhoneVerificationService } from '../services/phone-verification.service';
import { SavePhone } from '../dto/verification/save.phone.dto';

@Controller('kyc')
  @ApiTags('kyc')
export class KycController {
  constructor(
    private readonly kycService: KycService,
    private readonly phoneVerificationService: PhoneVerificationService,
  ) { }

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
  @Patch('profile/phone')
  @ApiOkResponse()
  @ApiBadRequestResponse()
  @ResponseMessage('phone number has been saved successfully')
  async savePhone(
    @User('id') userId: string,
    @Body() body: SavePhone,
  ) {
    try {
      return await this.phoneVerificationService.savePhoneNumber(userId, body);
    } catch (e) {
      if (e instanceof HttpException) {
        throw e;
      }

      throw new BadRequestException(e.message);
    }
  }

  @Auth()
  @Get('phone/verification/code/send')
  @ApiOkResponse()
  @ApiBadRequestResponse()
  @ResponseMessage('phone verification code sent')
  async sendPhoneVerificationCode(
    @User() user: UserEntity,
    @Query('type') type: string,
  ) {
    try {
      return await this.phoneVerificationService.sendVerificationCode(user, type);
    } catch (e) {
      if (e instanceof HttpException) {
        throw e;
      }

      throw new BadRequestException(e.message);
    }
  }

  @Auth()
  @Post('phone/verification/code/verify')
  @ApiOkResponse()
  @ApiBadRequestResponse()
  @ResponseMessage('code verification successful')
  async verifyVerificationCode(
    @User() user: UserEntity,
    @Body() body: { code: string },
  ) {
    try {
      await this.phoneVerificationService.verifyVerificationCode(user, body);
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