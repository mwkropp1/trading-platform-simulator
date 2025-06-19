import request from 'supertest';
import app from '../../src/app';
import { createTestUser, createTestAsset, generateAuthToken } from '../helpers';
import db from '../../src/db';

describe('Trade API', () => {
  let authToken: string;
  let userId: string;
  let assetId: string;

  beforeAll(async () => {
    const user = await createTestUser();
    userId = user.id;
    authToken = generateAuthToken(user);

    const asset = await createTestAsset({
      symbol: 'BTC',
      type: 'crypto',
      name: 'Bitcoin',
    });
    assetId = asset.id;
  });

  afterAll(async () => {
    await db.destroy();
  });

  describe('POST /api/v1/trades', () => {
    it('should create a buy trade', async () => {
      const response = await request(app)
        .post('/api/v1/trades')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          symbol: 'BTC',
          type: 'crypto',
          quantity: 1.0,
          trade_type: 'buy',
        });

      expect(response.status).toBe(201);
      expect(response.body).toMatchObject({
        user_id: userId,
        asset_id: assetId,
        quantity: 1.0,
        trade_type: 'buy',
      });
    });

    it('should require authentication', async () => {
      const response = await request(app).post('/api/v1/trades').send({
        symbol: 'BTC',
        type: 'crypto',
        quantity: 1.0,
        trade_type: 'buy',
      });

      expect(response.status).toBe(401);
    });
  });
});
