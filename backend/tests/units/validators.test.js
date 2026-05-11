const Joi = require('joi');

// Replicate the register schema from validator.js
const registerSchema = Joi.object({
  name: Joi.string().min(2).max(50).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
  phone: Joi.string().pattern(/^[6-9]\d{9}$/).optional(),
});

describe('Registration Validator', () => {
  test('passes with valid data', () => {
    const { error } = registerSchema.validate({ name: 'Sandeep', email: 'sandeep@test.com', password: 'pass123' });
    expect(error).toBeUndefined();
  });

  test('fails with short name', () => {
    const { error } = registerSchema.validate({ name: 'S', email: 'sandeep@test.com', password: 'pass123' });
    expect(error).toBeDefined();
    expect(error.details[0].message).toMatch(/name/i);
  });

  test('fails with invalid email', () => {
    const { error } = registerSchema.validate({ name: 'Sandeep', email: 'not-an-email', password: 'pass123' });
    expect(error).toBeDefined();
  });

  test('fails with short password', () => {
    const { error } = registerSchema.validate({ name: 'Sandeep', email: 'sandeep@test.com', password: '123' });
    expect(error).toBeDefined();
  });

  test('passes with valid Indian phone', () => {
    const { error } = registerSchema.validate({ name: 'Sandeep', email: 's@t.com', password: 'pass123', phone: '9876543210' });
    expect(error).toBeUndefined();
  });

  test('fails with invalid phone (starts with 1)', () => {
    const { error } = registerSchema.validate({ name: 'Sandeep', email: 's@t.com', password: 'pass123', phone: '1234567890' });
    expect(error).toBeDefined();
  });
});

// Replicate expense schema
const expenseSchema = Joi.object({
  amount: Joi.number().positive().required(),
  category: Joi.string().optional(),
  merchant: Joi.string().max(100).optional(),
  date: Joi.date().max('now').optional(),
  notes: Joi.string().max(200).optional(),
  paymentMode: Joi.string().valid('UPI', 'Card', 'Cash', 'Net Banking', 'Wallet').optional(),
});

describe('Expense Validator', () => {
  test('passes with valid expense', () => {
    const { error } = expenseSchema.validate({ amount: 299, category: 'Food & Dining', paymentMode: 'UPI' });
    expect(error).toBeUndefined();
  });

  test('fails with zero amount', () => {
    const { error } = expenseSchema.validate({ amount: 0 });
    expect(error).toBeDefined();
  });

  test('fails with negative amount', () => {
    const { error } = expenseSchema.validate({ amount: -50 });
    expect(error).toBeDefined();
  });

  test('fails with invalid payment mode', () => {
    const { error } = expenseSchema.validate({ amount: 100, paymentMode: 'Crypto' });
    expect(error).toBeDefined();
  });

  test('fails when notes exceed 200 chars', () => {
    const { error } = expenseSchema.validate({ amount: 100, notes: 'a'.repeat(201) });
    expect(error).toBeDefined();
  });
});
