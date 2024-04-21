import { Inject, Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { CACHE_MANAGER } from '@nestjs/cache-manager';

import { Cache } from 'cache-manager';

import { OtpService as ArkeselOtpService } from '@adbox/arkesel';

import { NotificationsProvider } from '../../@common/enums/notifications.provider.enum';

import { GenerateOtpForUserDto } from '../dto/otp/generate.dto';
import { VerifyOtpForUserDto } from '../dto/otp/verify.dto';


@Injectable()
export class OtpService {
    private readonly logger = new Logger(OtpService.name);

    constructor(
        private readonly config: ConfigService,
        @Inject(CACHE_MANAGER) private readonly cache: Cache,
        private readonly arkeselOtp: ArkeselOtpService
    ) { }

    async generateOtpForUser({ phone, userId }: GenerateOtpForUserDto) {
        try {
            const { success, code } = await this.generateOtp(phone);

            if (!success) {
                return { success, code };
            }

            await this.cache.set(`notifications:otp:${userId}`, { phone, code }, 600000);

            return { success, code }
        } catch (e) {
            this.logger.error(`Failed to generate OTP for user ${userId} and phone ${phone}`);
            return { success: false, code: null };
        }
    }

    async verifyOtpForUser({ phone, code, userId }: VerifyOtpForUserDto) {
        try {
            const res = await this.cache.get<{ phone: string, code: string }>(`notifications:otp:${userId}`);

            if (!res) {
                this.logger.error(`OTP for user ${userId} not found in cache`);
                return false;
            }

            const success = await this.verifyOtp(phone, code);

            if (!success) {
                this.logger.error(`Failed to verify OTP for user ${userId} and phone ${phone} and code ${code}`);
                return false;
            }

            await this.cache.del(`notifications:otp:${userId}`);

            return success;
        } catch (e) {
            this.logger.error(`Failed to verify OTP for user ${userId} and phone ${phone} and code ${code}`);
            return false;
        }
    }

    private async generateOtp(phone: string) {
        const provider = this.config.get<NotificationsProvider>('notifications.otp.default');

        if (provider === NotificationsProvider.ARKESEL) {
            const { success, data } = await this.arkeselOtp.generate({ phone });

            if (!success) {
                this.logger.error(`Failed to generate OTP for phone ${phone}`);
                return { success, code: null };
            }

            return { success, code: data.ussdCode };
        }

        return { success: false, code: null }
    }

    private async verifyOtp(phone: string, code: string) {
        const provider = this.config.get<NotificationsProvider>('notifications.otp.default');

        if (provider === NotificationsProvider.ARKESEL) {
            const { success, data } = await this.arkeselOtp.verify({ code, phone });

            if (!success) {
                this.logger.error(`Failed to verify OTP for phone ${phone} and code ${code}`);
                return success;
            }

            return success
        }

        return true;
    }
}
