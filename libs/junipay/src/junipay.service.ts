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
                this.config.get('junipay.payment'),
                { ...payload },
                {
                    headers: {
                        Authorization: `Bearer: ${token}`
                    }
                }
            ).pipe(
                catchError((error: AxiosError) => {
                    this.logger.error(error, 'this is junipay error')
                    this.logger.error(error.response.data);
                    throw 'An error happened!';
                }),
            ),
        );
        this.logger.log(res, 'kdjkfkfkdkfdkjfkdjkfjkdjf');

        return res;
    }
}
