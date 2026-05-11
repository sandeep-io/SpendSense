const Expense = require('../models/Expense');

exports.exportToCSV = async (userId, filters = {}) => {
  const expenses = await Expense.find({ userId, ...filters }).sort({ date: -1 });

  const headers = ['Date', 'Amount', 'Category', 'Merchant', 'Payment Mode', 'Notes'];
  const rows = expenses.map(e => [
    new Date(e.date).toLocaleDateString('en-IN'),
    e.amount,
    e.category,
    e.merchant || '',
    e.paymentMode,
    e.notes || ''
  ]);

  const csv = [headers, ...rows].map(row => row.map(cell => `"${cell}"`).join(',')).join('\n');
  return csv;
};

exports.exportToJSON = async (userId, filters = {}) => {
  const expenses = await Expense.find({ userId, ...filters }).sort({ date: -1 });
  return JSON.stringify(expenses, null, 2);
};
