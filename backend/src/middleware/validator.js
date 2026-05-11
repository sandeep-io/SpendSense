const Joi = require('joi');

const validate = (schema) => (req, res, next) => {
  const { error } = schema.validate(req.body, { abortEarly: false });
  if (error) {
    return res.status(400).json({ error: error.details.map(d => d.message).join(', ') });
  }
  next();
};

exports.validateRegister = validate(Joi.object({
  name: Joi.string().min(2).max(50).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
  phone: Joi.string().pattern(/^[6-9]\d{9}$/).optional()
}));

exports.validateLogin = validate(Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required()
}));

exports.validateExpense = validate(Joi.object({
  amount: Joi.number().positive().required(),
  category: Joi.string().optional(),
  merchant: Joi.string().max(100).optional(),
  date: Joi.date().max('now').optional(),
  notes: Joi.string().max(200).optional(),
  paymentMode: Joi.string().valid('UPI', 'Card', 'Cash', 'Net Banking', 'Wallet').optional(),
  tags: Joi.array().items(Joi.string()).optional()
}));

exports.validateBudget = validate(Joi.object({
  type: Joi.string().valid('overall', 'category').required(),
  category: Joi.string().when('type', { is: 'category', then: Joi.required() }),
  limit: Joi.number().positive().required(),
  period: Joi.string().valid('daily', 'weekly', 'monthly', 'yearly').optional(),
  startDate: Joi.date().optional(),
  endDate: Joi.date().optional(),
  alertThresholds: Joi.array().items(Joi.object({ percentage: Joi.number().min(0).max(100) })).optional()
}));
