import { registerAs } from '@nestjs/config';

export default registerAs('app', () => ({
  host: process.env.APP_HOST,
  port: process.env.PORT || 8080,
  name: 'Adbox',
  url: `${process.env.APP_HOST}:${process.env.PORT}`
}));