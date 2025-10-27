import request from 'supertest';
import createApp from '../app';
import AppDataSource from '../config/data-source';
import { User } from '../entities/User';
import jwt from 'jsonwebtoken';

let app: any;

beforeAll(async () => {
  process.env.NODE_ENV = 'test';
  // initialize data source (sqlite in-memory)
  if (!AppDataSource.isInitialized) {
    await AppDataSource.initialize();
  }
  // synchronize schema (fresh)
  await AppDataSource.synchronize(true);

  app = await createApp();
});

afterAll(async () => {
  if (AppDataSource.isInitialized) {
    await AppDataSource.destroy();
  }
});

describe('Tasks API (integration)', () => {
  let token: string;

  beforeAll(async () => {
    const userRepo = AppDataSource.getRepository(User);
    const user = userRepo.create({ email: 'test@example.com', name: 'Test User', googleId: 'test-sub' } as Partial<User>);
    await userRepo.save(user);

    token = jwt.sign({ sub: user.id, email: user.email }, process.env.JWT_SECRET || 'dev_jwt_secret_change_me');
  });

  test('GET /api/tasks initially empty', async () => {
    const res = await request(app).get('/api/tasks').set('Authorization', `Bearer ${token}`);
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  test('POST /api/tasks creates and returns task', async () => {
    const createRes = await request(app)
      .post('/api/tasks')
      .set('Authorization', `Bearer ${token}`)
      .send({ title: 'Integration Task', description: 'desc', scheduledAt: '2025-10-27T10:00:00' });

    expect(createRes.status).toBe(201);
    expect(createRes.body.title).toBe('Integration Task');

    const listRes = await request(app).get('/api/tasks').set('Authorization', `Bearer ${token}`);
    expect(listRes.status).toBe(200);
    expect(listRes.body.some((t: any) => t.title === 'Integration Task')).toBe(true);
  });
});
