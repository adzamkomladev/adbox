import { registerAs } from '@nestjs/config';

export default registerAs('zeepay', () => ({
  baseUrl: process.env.ZEEPAY_BASE_URL,
  grantType: process.env.ZEEPAY_GRANT_TYPE,
  clientId: process.env.ZEEPAY_CLIENT_ID,
  clientSecret: process.env.ZEEPAY_CLIENT_SECRET,
  username: process.env.ZEEPAY_USERNAME,
  password: process.env.ZEEPAY_PASSWORD,
  callbackUrl: process.env.ZEEPAY_CALLBACK_URL,

  endpoints: {
    authenticate: '/oauth/token',
    mobileWallet: {
      credit: '/instntmny-local/transactions/wallets/credit-wallet',
      debit: '/custom/transactions/tech-maxx/wallets/debit-wallet',
    },
  },
}));
