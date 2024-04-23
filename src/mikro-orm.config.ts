import 'dotenv/config';
import { defineConfig } from "@mikro-orm/postgresql";
import { Migrator } from '@mikro-orm/migrations';
import { SeedManager } from '@mikro-orm/seeder';

export default defineConfig({
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
    disableForeignKeys: false
  },
  seeder: {
    path: 'src/@common/seeders',
    defaultSeeder: 'DatabaseSeeder', // default seeder class name
  },
  extensions: [Migrator, SeedManager]
});
