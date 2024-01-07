import { Inject, Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { HttpService } from '@nestjs/axios';

import { catchError, firstValueFrom } from 'rxjs';
import { AxiosError } from 'axios';
import { Cache } from 'cache-manager';

import { AuthResponse } from '@adbox/zeepay/interfaces/auth.interface';
import {
  CreditRequest,
  CreditResponse,
  DebitRequest,
  DebitResponse,
} from '@adbox/zeepay/interfaces/mobile-wallet.interface';

@Injectable()
export class ZeepayService {
  private readonly logger: Logger;

  constructor(
    private readonly http: HttpService,
    private readonly config: ConfigService,
    @Inject(CACHE_MANAGER) private readonly cache: Cache,
  ) {
    this.logger = new Logger(ZeepayService.name);
  }

  async authenticate(): Promise<AuthResponse> {
    const { data } = await firstValueFrom(
      this.http
        .post(
          '/oauth/token',
          {
            grant_type: this.config.get('zeepay.grantType'),
            client_id: this.config.get('zeepay.clientId'),
            client_secret: this.config.get('zeepay.clientSecret'),
            username: this.config.get('zeepay.username'),
            password: this.config.get('zeepay.password'),
          },
          {
            headers: await this.retrieveHeadersForAuth(),
          },
        )
        .pipe(
          catchError((error: AxiosError) => {
            this.logger.error(error, 'this is zepay error')
            this.logger.error(error.response.data);
            throw 'An error happened!';
          }),
        ),
    );
    return {
      tokenType: data.token_type,
      expiresIn: data.expires_in,
      accessToken: data.access_token,
      refreshToken: data.refresh_token,
    };
  }

  async creditMobileWallet({
    amount,
    name,
    phone,
    description,
    reference,
  }: CreditRequest): Promise<CreditResponse> {
    const { data } = await firstValueFrom(
      this.http
        .post(
          this.config.get('zeepay.endpoints.mobileWallet.credit'),
          {
            customerName: name,
            mno: 'Zeepay',
            amount: `${amount}`,
            msisdn: phone,
            description,
            reference,
          },
          {
            headers: await this.retrieveHeaders(),
          },
        )
        .pipe(
          catchError((error: AxiosError) => {
            this.logger.error(error.response.data);
            throw 'An error happened crediting mobile wallet!';
          }),
        ),
    );

    return {
      code: data.code,
      zeepayId: data.zeepay_id,
      amount: +data.amount,
      message: data.message,
    };
  }

  async debitMobileWallet({
    amount,
    name,
    phone,
    description,
    reference,
  }: DebitRequest): Promise<DebitResponse> {
    const { data } = await firstValueFrom(
      this.http
        .post(
          this.config.get('zeepay.endpoints.mobileWallet.debit'),
          {
            customerName: name,
            mno: 'Zeepay',
            amount: `${amount}`,
            msisdn: phone,
            description,
            reference,
            callback_url: this.config.get('zeepay.callbackUrl'),
          },
          {
            headers: await this.retrieveHeaders(),
          },
        )
        .pipe(
          catchError((error: AxiosError) => {
            this.logger.error(error);
            throw 'An error happened debiting mobile wallet!';
          }),
        ),
    );

    return {
      code: data.code,
      zeepayId: data.zeepay_id,
      amount: +data.amount,
      message: data.message,
    };
  }

  private async retrieveAccessToken() {
    const accessToken = await this.cache.get<string>('zeepay.accessToken');
    if (accessToken) {
      return accessToken;
    }

    const {
      accessToken: newAccessToken,
      refreshToken,
      expiresIn,
    } = await this.authenticate();

    await this.cache.set('zeepay.accessToken', newAccessToken, expiresIn);
    await this.cache.set('zeepay.refreshToken', refreshToken, expiresIn);

    return newAccessToken;
  }

  private async retrieveHeaders() {
    const accessToken = await this.retrieveAccessToken();

    return {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    };
  }

  private async retrieveHeadersForAuth() {
    return {
      'Content-Type': 'application/x-www-form-urlencoded',
    };
  }
}
