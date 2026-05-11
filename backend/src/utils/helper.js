exports.getMonthRange = (month, year) => {
  const start = new Date(year, month - 1, 1);
  const end = new Date(year, month, 0, 23, 59, 59);
  return { start, end };
};

exports.formatCurrency = (amount, currency = 'INR') =>
  new Intl.NumberFormat('en-IN', { style: 'currency', currency }).format(amount);

exports.getPreviousMonth = (month, year) => {
  if (month === 1) return { month: 12, year: year - 1 };
  return { month: month - 1, year };
};

exports.calculatePercentageChange = (current, previous) => {
  if (previous === 0) return 100;
  return Math.round(((current - previous) / previous) * 100);
};
