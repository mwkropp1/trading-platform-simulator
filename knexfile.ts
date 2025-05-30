import type { Knex } from 'knex';
import dotenv from 'dotenv';

dotenv.config({
  path: process.env.NODE_ENV === 'test' ? '.env.test' : '.env',
});

const config: { [key: string]: Knex.Config } = {
  development: {
    client: 'pg',
    connection: {
      host: process.env.DB_HOST,
      port: Number(process.env.DB_PORT || 5432),
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
    },
    migrations: {
      directory: './migrations',
      extension: 'ts',
    },
  },
  test: {
    client: 'pg',
    connection: {
      host: process.env.TEST_DB_HOST,
      port: Number(process.env.TEST_DB_PORT || 5432),
      user: process.env.TEST_DB_USER,
      password: process.env.TEST_DB_PASSWORD,
      database: process.env.TEST_DB_NAME,
    },
    migrations: {
      directory: './migrations',
      extension: 'ts',
    },
  },
};

export default config;
