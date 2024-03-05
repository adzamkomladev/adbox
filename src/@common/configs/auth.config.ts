import { registerAs } from '@nestjs/config';

export default registerAs('auth', () => ({
  jwt: {
    secret: process.env.AUTH_JWT_SECRET,
    expiresIn: process.env.AUTH_JWT_EXPIRES_IN,
    rememberMeExpiresIn: '7d',
    ignoreExpiration: Boolean(process.env.AUTH_JWT_IGNORE_EXPIRATION),
  },
}));
