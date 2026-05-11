/**
 * Integration tests for Auth routes.
 * Requires a running MongoDB instance (use MongoDB Memory Server for CI).
 * 
 * To run: cd backend && npm test
 */

const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../../../src/app');

const TEST_USER = {
  name: 'Test User',
  email: `test_${Date.now()}@spendsense.test`,
  password: 'testpassword123',
};

let accessToken;
let refreshToken;

beforeAll(async () => {
  // Connect to a test DB
  const uri = process.env.MONGODB_URI_TEST || 'mongodb://localhost:27017/spendsense_test';
  await mongoose.connect(uri);
});

afterAll(async () => {
  // Clean up test user
  await mongoose.connection.collection('users').deleteMany({ email: TEST_USER.email });
  await mongoose.disconnect();
});

describe('POST /api/auth/register', () => {
  it('creates a new user and returns tokens', async () => {
    const res = await request(app).post('/api/auth/register').send(TEST_USER);
    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty('accessToken');
    expect(res.body).toHaveProperty('refreshToken');
    expect(res.body.user.email).toBe(TEST_USER.email);
    accessToken = res.body.accessToken;
    refreshToken = res.body.refreshToken;
  });

  it('rejects duplicate email', async () => {
    const res = await request(app).post('/api/auth/register').send(TEST_USER);
    expect(res.status).toBe(409);
    expect(res.body).toHaveProperty('error');
  });

  it('rejects missing fields', async () => {
    const res = await request(app).post('/api/auth/register').send({ email: 'no@pass.com' });
    expect(res.status).toBe(400);
  });
});

describe('POST /api/auth/login', () => {
  it('logs in with correct credentials', async () => {
    const res = await request(app).post('/api/auth/login').send({
      email: TEST_USER.email,
      password: TEST_USER.password,
    });
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('accessToken');
    accessToken = res.body.accessToken;
    refreshToken = res.body.refreshToken;
  });

  it('rejects wrong password', async () => {
    const res = await request(app).post('/api/auth/login').send({
      email: TEST_USER.email,
      password: 'wrongpassword',
    });
    expect(res.status).toBe(401);
  });

  it('rejects unknown email', async () => {
    const res = await request(app).post('/api/auth/login').send({
      email: 'nobody@nowhere.com',
      password: 'somepassword',
    });
    expect(res.status).toBe(401);
  });
});

describe('GET /api/auth/profile', () => {
  it('returns profile with valid token', async () => {
    const res = await request(app)
      .get('/api/auth/profile')
      .set('Authorization', `Bearer ${accessToken}`);
    expect(res.status).toBe(200);
    expect(res.body.email).toBe(TEST_USER.email);
  });

  it('returns 401 without token', async () => {
    const res = await request(app).get('/api/auth/profile');
    expect(res.status).toBe(401);
  });

  it('returns 401 with invalid token', async () => {
    const res = await request(app)
      .get('/api/auth/profile')
      .set('Authorization', 'Bearer invalid.token.here');
    expect(res.status).toBe(401);
  });
});

describe('POST /api/auth/refresh', () => {
  it('issues new access token', async () => {
    const res = await request(app).post('/api/auth/refresh').send({ refreshToken });
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('accessToken');
  });

  it('rejects invalid refresh token', async () => {
    const res = await request(app).post('/api/auth/refresh').send({ refreshToken: 'bad.token' });
    expect(res.status).toBe(401);
  });
});
