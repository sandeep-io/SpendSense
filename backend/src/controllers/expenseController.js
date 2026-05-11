const Expense = require('../models/Expense');
const Budget = require('../models/Budget');
const { categorizeMerchant } = require('../services/categorization.service');

const normalizeExpenseCategory = (category) => {
  if (!category) return category;

  const normalized = String(category).trim();
  const lower = normalized.toLowerCase();

  // Canonical enum values are defined in Expense model.
  const aliasMap = {
    food: 'Food & Dining',
    'food & dining': 'Food & Dining'
  };

  return aliasMap[lower] || normalized;
};


exports.getExpenses = async (req, res, next) => {
  try {
    const { month, year, category, page = 1, limit = 20 } = req.query;
    const filter = { userId: req.userId };

    if (month && year) {
      const start = new Date(year, month - 1, 1);
      const end = new Date(year, month, 0, 23, 59, 59);
      filter.date = { $gte: start, $lte: end };
    }
    if (category) filter.category = category;

    const total = await Expense.countDocuments(filter);
    const expenses = await Expense.find(filter)
      .sort({ date: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit));

    const totalAmount = await Expense.aggregate([
      { $match: filter },
      { $group: { _id: null, total: { $sum: '$amount' } } }
    ]);

    res.json({
      expenses,
      pagination: { total, page: Number(page), pages: Math.ceil(total / limit) },
      totalAmount: totalAmount[0]?.total || 0
    });
  } catch (err) { next(err); }
};

exports.addExpense = async (req, res, next) => {
  try {
    const { amount, category, merchant, date, notes, paymentMode, tags } = req.body;

    const expense = await Expense.create({
      userId: req.userId,
      amount,
      category: normalizeExpenseCategory(category) || await categorizeMerchant(merchant),
      merchant,
      date: date || new Date(),
      notes,
      paymentMode,
      tags,
      receipt: req.file ? { url: req.file.path } : undefined
    });


    // Update budget spent amount
    await Budget.updateMany(
      { userId: req.userId, isActive: true, category: { $in: [expense.category, null] } },
      { $inc: { spent: amount } }
    );

    res.status(201).json(expense);
  } catch (err) { next(err); }
};

exports.updateExpense = async (req, res, next) => {
  try {
    const expense = await Expense.findOneAndUpdate(
      { _id: req.params.id, userId: req.userId },
      { ...req.body, category: normalizeExpenseCategory(req.body.category), updatedAt: new Date() },
      { new: true, runValidators: true }

    );
    if (!expense) return res.status(404).json({ error: 'Expense not found' });
    res.json(expense);
  } catch (err) { next(err); }
};

exports.deleteExpense = async (req, res, next) => {
  try {
    const expense = await Expense.findOneAndDelete({ _id: req.params.id, userId: req.userId });
    if (!expense) return res.status(404).json({ error: 'Expense not found' });

    // Decrease budget spent
    await Budget.updateMany(
      { userId: req.userId, isActive: true },
      { $inc: { spent: -expense.amount } }
    );

    res.json({ message: 'Expense deleted' });
  } catch (err) { next(err); }
};
