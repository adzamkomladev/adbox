import { registerAs } from '@nestjs/config';

import { PostgreSqlDriver } from '@mikro-orm/postgresql';

export default registerAs('db', () => ({
  driver: PostgreSqlDriver,
  autoLoadEntities: true,
  dbName: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  host: process.env.DB_HOST,
  port: +process.env.DB_PORT ?? 5432,
  debug: true,
}));
