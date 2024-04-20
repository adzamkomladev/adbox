import { HttpStatus, Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { HttpService } from '@nestjs/axios';

import { lastValueFrom } from 'rxjs';

import { GenerateOtpResponse, GenerateRequest, GenerateResponse, Response, VerifyRequest, VerifyResponse } from '../interfaces';

@Injectable()
export class OtpService {
    private readonly logger = new Logger(OtpService.name);

    constructor(
        private readonly http: HttpService,
        private readonly config: ConfigService
    ) { }

    async generate(payload: GenerateRequest): Promise<Response<GenerateResponse>> {
        try {
            const { status, data } = await lastValueFrom(
                this.http.post<GenerateOtpResponse>(
                    this.config.get('arkesel.otp.urls.generate'),
                    {
                        number: payload.sender,
                        message: payload.message || this.config.get('arkesel.otp.message'),
                        sender_id: payload.sender || this.config.get('arkesel.otp.sender'),
                        type: payload.type || this.config.get('arkesel.otp.type'),
                        medium: payload.medium || this.config.get('arkesel.otp.medium'),
                        expiry: payload.expiry || this.config.get<number>('arkesel.otp.expiry'),
                        length: payload.length || this.config.get<number>('arkesel.otp.length'),
                    })
            );

            const success = status === HttpStatus.OK;
            if (!success) {
                data?.code && data?.message ?
                    this.logger.log(`Failed generate OTP request with this code and message: ${data.code} - ${data.message}`)
                    : this.logger.log('This is their fault. Failed to respond properly to this generate OTP request');
            }

            return {
                success,
                data: data ? {
                    code: data.code,
                    message: data.message,
                    ussdCode: data.ussd_code
                } : null
            };
        } catch (e) {
            this.logger.error(`This is our fault. We caused this during generate OTP request - {e.message}`);

            return {
                success: false,
                data: null
            };
        }
    }

    async verify(payload: VerifyRequest): Promise<Response<VerifyResponse>> {
        try {
            const { status, data } = await lastValueFrom(
                this.http.post<VerifyResponse>(
                    this.config.get('arkesel.otp.urls.verify'),
                    {
                        number: payload.phone,
                        code: payload.code
                    }
                )
            );

            const success = status === HttpStatus.OK;
            if (success) {
                data?.code ?
                    this.logger.log(`Failed verify OTP request with this code and message: ${data.code} - ${data.message}`)
                    : this.logger.log('This is their fault. Failed to respond properly to this verify OTP request');

            }

            return {
                success,
                data
            };
        } catch (e) {
            this.logger.error(`This is our fault. We caused this during verify OTP request - ${e.message}`);
            return {
                success: false,
                data: null
            };
        }
    }
}
