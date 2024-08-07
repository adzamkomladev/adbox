import { BadRequestException, Body, Controller, Get, HttpException, Param, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { ApiBadRequestResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger';

import { ResponseMessage } from '../../@common/decorators/response.message.decorator';
import { Auth } from '../../auth/decorators/auth.decorator';
import { User } from '../../auth/decorators/user.decorator';

import { User as UserEntity } from '../../@common/db/entities/users/user.entity';

import { CreateProfile } from '../dto/create.profile.dto';
import { CreateIdentity } from '../dto/create.identity.dto';
import { CreateBusiness } from '../dto/create.business.dto';
import { SavePhone } from '../dto/verification/save.phone.dto';
import { VerifyCode } from '../dto/verification/verify.dto';
import { SendVerificationCode } from '../dto/verification/send.verification.code.dto';

import { KycService } from '../services/kyc.service';
import { PhoneVerificationService } from '../services/phone-verification.service';
import { AuthenticatedUser } from '../../@common/dto/authenticated.user.dto';
import { Throttle } from '@nestjs/throttler';

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
    @User() user: AuthenticatedUser,
    @Body() body: CreateProfile,
  ) {
    try {
      return await this.kycService.createProfile(user.id, body);
    } catch (e) {
      if (e instanceof HttpException) {
        throw e;
      }

      throw new BadRequestException(e.message);
    }
  }

  @Throttle({ default: { limit: 1, ttl: 60000 } })
  @Auth()
  @Patch('profile/phone')
  @ApiOkResponse()
  @ApiBadRequestResponse()
  @ResponseMessage('phone number has been saved successfully')
  async savePhone(
    @User() user: AuthenticatedUser,
    @Body() body: SavePhone,
  ) {
    try {
      return await this.phoneVerificationService.savePhoneNumber(user.id, body);
    } catch (e) {
      if (e instanceof HttpException) {
        throw e;
      }

      throw new BadRequestException(e.message);
    }
  }

  @Throttle({ default: { limit: 1, ttl: 60000 } })
  @Auth()
  @Get('phone/verification/code/send')
  @ApiOkResponse()
  @ApiBadRequestResponse()
  @ResponseMessage('phone verification code sent')
  async sendPhoneVerificationCode(
    @User() user: UserEntity,
    @Query() query: SendVerificationCode,
  ) {
    try {
      return await this.phoneVerificationService.sendVerificationCode(user, query?.type);
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
    @Body() body: VerifyCode,
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
    // @KycLevels([KycLevel.THREE, KycLevel.FOUR])
    // @UseGuards(PhoneVerifiedGuard)
  @Patch('create/identity')
  @ApiOkResponse()
  @ApiBadRequestResponse()
  @ResponseMessage('identity created successfully')
  async createIdentity(
    @User() user: AuthenticatedUser,
    @Body() body: CreateIdentity,
  ) {
    try {
      return await this.kycService.createIdentity(user.id, body);
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
    @User() user: AuthenticatedUser,
    @Body() body: CreateBusiness,
  ) {
    try {
      return await this.kycService.createBusiness(user.id, body);
    } catch (e) {
      if (e instanceof HttpException) {
        throw e;
      }

      throw new BadRequestException(e.message);
    }
  }
}