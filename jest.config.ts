import type { Config } from '@jest/types';

const config: Config.InitialOptions = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  testMatch: ['**/tests/**/*.test.ts'],
  setupFilesAfterEnv: ['<rootDir>/tests/helpers/dbTestSetup.ts'],
  verbose: true,
  testTimeout: 10000,
  globals: {
    'process.env.NODE_ENV': 'test',
  },
};

export default config;
