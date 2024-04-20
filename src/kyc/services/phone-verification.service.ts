import { BadRequestException, Injectable } from '@nestjs/common';

import { User } from '../../users/entities/user.entity';

import { VerifyCode } from '../dto/verification/verify.dto';
import { SavePhone } from '../dto/verification/save.phone.dto';

import { OtpService } from '../../notifications/services/otp.service';
import { UsersService } from '../../users/services/users.service';

@Injectable()
export class PhoneVerificationService {

    constructor(
        private readonly usersService: UsersService,
        private readonly otpService: OtpService
    ) { }

    async sendVerificationCode(user: User, type?: string) {
        const { success, code } = await this.otpService.generateOtpForUser({
            phone: user.phone,
            userId: user.id,
        });

        if (!success) {
            throw new BadRequestException('failed to send verification code');
        }

        return { code };
    }

    async verifyVerificationCode(user: User, { code }: VerifyCode) {
        const success = await this.otpService.verifyOtpForUser({
            phone: user.phone,
            userId: user.id,
            code
        });

        if (!success) {
            throw new BadRequestException(`invalid verification code ${code}`);
        }
    }

    async savePhoneNumber(userId: string, { phone }: SavePhone) {
        return await this.usersService.setPhoneNumber(userId, phone);
    }
}
