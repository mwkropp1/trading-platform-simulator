import { execSync } from 'child_process';
import db from '../../src/db';

async function cleanDatabase() {
  await db('users').del();
}

async function setupTestDatabase() {
  try {
    execSync('tsx ./node_modules/.bin/knex migrate:latest --knexfile knexfile.ts', {
      stdio: 'inherit',
    });
    await cleanDatabase();
  } catch (error) {
    console.error('Failed to setup test database:', error);
    throw error;
  }
}

beforeAll(async () => {
  await setupTestDatabase();
});

beforeEach(async () => {
  await cleanDatabase();
});

afterAll(async () => {
  await db.destroy();
});
