const Budget = require('../models/Budget');

exports.getBudgets = async (req, res, next) => {
  try {
    const budgets = await Budget.find({ userId: req.userId, isActive: true });
    res.json(budgets);
  } catch (err) { next(err); }
};

exports.createBudget = async (req, res, next) => {
  try {
    const { type, category, limit, period, startDate, endDate, alertThresholds } = req.body;
    const budget = await Budget.create({
      userId: req.userId,
      type, category, limit, period,
      startDate: startDate || new Date(),
      endDate: endDate || new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0),
      alertThresholds: alertThresholds || [{ percentage: 80 }, { percentage: 100 }]
    });
    res.status(201).json(budget);
  } catch (err) { next(err); }
};

exports.updateBudget = async (req, res, next) => {
  try {
    const budget = await Budget.findOneAndUpdate(
      { _id: req.params.id, userId: req.userId },
      req.body,
      { new: true }
    );
    if (!budget) return res.status(404).json({ error: 'Budget not found' });
    res.json(budget);
  } catch (err) { next(err); }
};

exports.deleteBudget = async (req, res, next) => {
  try {
    await Budget.findOneAndUpdate(
      { _id: req.params.id, userId: req.userId },
      { isActive: false }
    );
    res.json({ message: 'Budget deactivated' });
  } catch (err) { next(err); }
};
