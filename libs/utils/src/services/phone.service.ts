import { Injectable } from '@nestjs/common';

import * as libphonenumber from 'google-libphonenumber';

@Injectable()
export class PhoneService {
  format(phone: string, iso2: string) {
    const phoneUtil = libphonenumber.PhoneNumberUtil.getInstance();
    return phoneUtil.format(
      phoneUtil.parse(phone, iso2),
      libphonenumber.PhoneNumberFormat.E164,
    );
  }
}
