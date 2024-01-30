import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { TokenService } from '@adbox/utils';
import { Request } from './interfaces/payment.interface';
import { HttpService } from '@nestjs/axios';
import { catchError, firstValueFrom } from 'rxjs';
import { Type } from '@adbox/utils';
import { AxiosError } from 'axios';

@Injectable()
export class JunipayService {
    private readonly logger = new Logger(JunipayService.name);

    constructor(
        private readonly http: HttpService,
        private readonly config: ConfigService,
        private readonly token: TokenService) { }

    async payment({ amount, provider, phoneNumber, senderEmail, description, channel, reference }: Request) {
        const payload = {
            amount,
            tot_amnt: amount,
            provider,
            phoneNumber,
            channel,
            senderEmail,
            description,
            foreignID: reference,
            callbackUrl: this.config.get('junipay.callbackUrl')
        };
        const token = this.token.generateJwtToken(payload, Type.JUNIPAY)

        const res = await firstValueFrom(
            this.http.post(
                this.config.get('junipay.endpoints.payment'),
                { ...payload },
                {
                    headers: {
                        Authorization: `Bearer: ${token}`
                    }
                }
            ).pipe(
                catchError((error: AxiosError) => {
                    console.log(error, 'this is junipay error')
                    console.log(error.response.data);
                    throw 'An error happened!';
                }),
            ),
        );
        console.log(res, 'THIS IS THE RESULTS FOR PAYMENT');

        return res;
    }
}
