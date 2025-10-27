import request from 'supertest';
import createApp from '../app';
import AppDataSource from '../config/data-source';
import jwt from 'jsonwebtoken';

jest.mock('google-auth-library', () => {
  return {
    OAuth2Client: jest.fn().mockImplementation(() => {
      return {
        verifyIdToken: jest.fn().mockResolvedValue({
          getPayload: () => ({ sub: 'google-sub', email: 'a@test.com', name: 'A Test' }),
        }),
      };
    }),
  };
});

describe('Auth route (unit)', () => {
  let app: any;

  beforeAll(async () => {
    process.env.NODE_ENV = 'test';
    if (!AppDataSource.isInitialized) await AppDataSource.initialize();
    await AppDataSource.synchronize(true);
    app = await createApp();
  });

  afterAll(async () => {
    if (AppDataSource.isInitialized) await AppDataSource.destroy();
  });

  test('POST /api/auth/google returns token and user', async () => {
    const res = await request(app).post('/api/auth/google').send({ token: 'dummy' });
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('token');
    expect(res.body).toHaveProperty('user');
  });
});
