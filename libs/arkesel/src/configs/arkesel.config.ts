import { registerAs } from '@nestjs/config';

export default registerAs('arkesel', () => ({
  baseUrl: process.env.ARKESEL_BASE_URL,
  key: process.env.ARKESEL_KEY,
  otp: {
    sender: process.env.ARKESEL_OTP_SENDER,
    message: process.env.ARKESEL_OTP_MESSAGE,
    medium: process.env.ARKESEL_OTP_MEDIUM,
    type: process.env.ARKESEL_OTP_TYPE,
    expiry: +process.env.ARKESEL_OTP_EXPIRY,
    length: +process.env.ARKESEL_OTP_LENGTH,
    urls: {
      generate: '/otp/generate',
      verify: '/otp/verify',
    }
  }
}));