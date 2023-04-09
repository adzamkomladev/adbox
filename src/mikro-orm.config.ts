export default {
  type: process.env.DB_TYPE || 'postgresql',
  entities: ['dist/**/*.entity.js'],
  entitiesTs: ['src/**/*.entity.ts'],
  dbName: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  host: process.env.DB_HOST,
  port: +process.env.DB_PORT ?? 5432,
  debug: true,
  migrations: {
    path: 'src/@common/migrations',
  },
};
