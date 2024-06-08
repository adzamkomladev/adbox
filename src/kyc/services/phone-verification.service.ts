import { BadRequestException, Injectable, Logger } from '@nestjs/common';

import { User } from '../../@common/db/entities/users/user.entity';

import { VerifyCode } from '../dto/verification/verify.dto';
import { SavePhone } from '../dto/verification/save.phone.dto';

import { OtpService } from '../../notifications/services/otp.service';
import { UsersService } from '../../users/services/users.service';
import { UserRepository } from '../../@common/db/repositories';

@Injectable()
export class PhoneVerificationService {
    private readonly logger = new Logger(PhoneVerificationService.name);

    constructor(
        private readonly userRepository: UserRepository,
        private readonly otpService: OtpService
    ) { }

    async sendVerificationCode(user: User, type?: string) {
        const fullUserDetails = await this.userRepository.findOneById(user.id);
        const { success, code } = await this.otpService.generateOtpForUser({
            phone: fullUserDetails.phone,
            userId: user.id,
        });

        if (!success) {
            throw new BadRequestException('failed to send verification code');
        }

        return { code };
    }

    async verifyVerificationCode(user: User, { code }: VerifyCode) {
        const fullUserDetails = await this.userRepository.findOneById(user.id);

        const success = await this.otpService.verifyOtpForUser({
            phone: fullUserDetails.phone,
            userId: user.id,
            code
        });

        if (!success) {
            throw new BadRequestException(`invalid verification code ${code}`);
        }

        try {
            const res = await this.userRepository.markPhoneAsVerified(user.id);

            if (!res) throw new Error('Failed to mark phone as verified');
        } catch (e) {
            this.logger.error(`failed to mark user phone as verified ${e}`);
            throw new BadRequestException('failed to verify code');
        }
    }

    async savePhoneNumber(userId: string, { phone }: SavePhone) {
        const user = await this.userRepository.savePhone(userId, phone);

        if (!user) {
            throw new BadRequestException('failed to save phone number');
        }

        return await this.sendVerificationCode(user, 'sms');
    }
}
