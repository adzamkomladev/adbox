import { registerAs } from '@nestjs/config';

export default registerAs('paystack', () => ({
  baseUrl: process.env.PAYSTACK_BASE_URL,
  publicKey: process.env.PAYSTACK_PUBLIC_KEY,
  secretKey: process.env.PAYSTACK_SECRET_KEY,
  callbackUrl: 'https://adbox.yebi.africa/api/v1/payments/callback/paystack',
}));
