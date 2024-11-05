import { HttpService } from '@nestjs/axios';
import { HttpStatus, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { catchError, firstValueFrom, map, of } from 'rxjs';

import { Request } from './interfaces';

@Injectable()
export class PaystackService {
    constructor(
        private readonly http: HttpService,
        private readonly config: ConfigService
    ) { }

    async payment({ email, reference, amount, channels }: Request) {
        const payload = {
            amount,
            channels,
            email,
            reference,
            // callback_url: this.config.get('paystack.callbackUrl')
        };

        const { status, authorizationUrl, accessCode } = await firstValueFrom(
            this.http
                .post('transaction/initialize', { ...payload })
                .pipe(
                    catchError((e) => {
                        const { status, message, code } = e;

                        return of({
                            data: {
                                message,
                                code,
                            },
                            status,
                        });
                    }),
                    map((response) => {
                        const { data, status } = response;

                        if (status === 200 && data?.status) {
                            const { authorization_url, access_code, reference } = data?.data;
                            return {
                                requestData: { ...payload },
                                status: data?.status,
                                message: data?.message,
                                authorizationUrl: authorization_url,
                                accessCode: access_code,
                                reference,
                            };
                        }

                        return {
                            requestData: { ...payload },
                            status: false,
                            message: 'initiate payment request failed',
                        };
                    }),
                ),
        );

        return {
            status,
            authorizationUrl,
            accessCode
        };
    }
}
