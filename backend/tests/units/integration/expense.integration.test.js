/**
 * Integration tests for Expense routes.
 */

const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../../../src/app');

const TEST_USER = {
  name: 'Expense Tester',
  email: `expense_test_${Date.now()}@spendsense.test`,
  password: 'testpassword123',
};

let accessToken;
let createdExpenseId;

beforeAll(async () => {
  const uri = process.env.MONGODB_URI_TEST || 'mongodb://localhost:27017/spendsense_test';
  await mongoose.connect(uri);

  // Register and get token
  const res = await request(app).post('/api/auth/register').send(TEST_USER);
  accessToken = res.body.accessToken;
});

afterAll(async () => {
  await mongoose.connection.collection('users').deleteMany({ email: TEST_USER.email });
  if (createdExpenseId) {
    await mongoose.connection.collection('expenses').deleteMany({ _id: new mongoose.Types.ObjectId(createdExpenseId) });
  }
  await mongoose.disconnect();
});

describe('POST /api/expenses', () => {
  it('creates an expense', async () => {
    const res = await request(app)
      .post('/api/expenses')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({ amount: 250, category: 'Food & Dining', merchant: 'Zomato', paymentMode: 'UPI', date: new Date().toISOString() });

    expect(res.status).toBe(201);
    expect(res.body.amount).toBe(250);
    expect(res.body.category).toBe('Food & Dining');
    createdExpenseId = res.body._id;
  });

  it('rejects expense without amount', async () => {
    const res = await request(app)
      .post('/api/expenses')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({ category: 'Shopping' });
    expect(res.status).toBe(400);
  });

  it('rejects unauthenticated request', async () => {
    const res = await request(app).post('/api/expenses').send({ amount: 100 });
    expect(res.status).toBe(401);
  });
});

describe('GET /api/expenses', () => {
  it('returns list of expenses', async () => {
    const res = await request(app)
      .get('/api/expenses')
      .set('Authorization', `Bearer ${accessToken}`);
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('expenses');
    expect(Array.isArray(res.body.expenses)).toBe(true);
  });

  it('filters by month and year', async () => {
    const now = new Date();
    const res = await request(app)
      .get(`/api/expenses?month=${now.getMonth() + 1}&year=${now.getFullYear()}`)
      .set('Authorization', `Bearer ${accessToken}`);
    expect(res.status).toBe(200);
    expect(res.body.expenses.length).toBeGreaterThan(0);
  });
});

describe('PATCH /api/expenses/:id', () => {
  it('updates an expense', async () => {
    const res = await request(app)
      .patch(`/api/expenses/${createdExpenseId}`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send({ amount: 300, notes: 'Updated note' });
    expect(res.status).toBe(200);
    expect(res.body.amount).toBe(300);
  });

  it('returns 404 for non-existent expense', async () => {
    const fakeId = new mongoose.Types.ObjectId();
    const res = await request(app)
      .patch(`/api/expenses/${fakeId}`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send({ amount: 100 });
    expect(res.status).toBe(404);
  });
});

describe('DELETE /api/expenses/:id', () => {
  it('deletes an expense', async () => {
    const res = await request(app)
      .delete(`/api/expenses/${createdExpenseId}`)
      .set('Authorization', `Bearer ${accessToken}`);
    expect(res.status).toBe(200);
    createdExpenseId = null;
  });

  it('returns 404 for already-deleted expense', async () => {
    const fakeId = new mongoose.Types.ObjectId();
    const res = await request(app)
      .delete(`/api/expenses/${fakeId}`)
      .set('Authorization', `Bearer ${accessToken}`);
    expect(res.status).toBe(404);
  });
});
