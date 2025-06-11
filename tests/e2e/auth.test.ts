import request from 'supertest';
import app from '../../src/app';
import db from '../../src/db';

describe('Auth Routes', () => {
  beforeEach(async () => {
    await db('users').del();
  });

  afterAll(async () => {
    await db.destroy();
  });

  describe('POST /api/v1/auth/register', () => {
    it('should register a new user', async () => {
      const response = await request(app).post('/api/v1/auth/register').send({
        username: 'testuser',
        email: 'test@example.com',
        password: 'Password123',
      });

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('token');
      expect(response.body.user).toHaveProperty('username', 'testuser');
      expect(response.body.user).not.toHaveProperty('password_hash');
    });
  });
});
