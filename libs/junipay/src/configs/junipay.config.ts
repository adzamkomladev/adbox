import { registerAs } from '@nestjs/config';

export default registerAs('junipay', () => ({
  baseUrl: process.env.JUNIPAY_BASE_URL,
  clientId: process.env.JUNIPAY_CLIENT_ID,
  secret: process.env.JUNIPAY_SECRET,
  callbackUrl: process.env.JUNIPAY_CALLBACK_URL,
  tokenLink: process.env.JUNIPAY_TOKEN_LINK,
  endpoints: {
    payment: '/payment',
    resolve: '/resolve',
    trxStatus: '/checktranstatus',
    transfer: '/transfer',
  },
}));
