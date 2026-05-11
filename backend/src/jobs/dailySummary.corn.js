const cron = require('node-cron');
const Expense = require('../models/Expense');
const User = require('../models/User');
const { sendEmail, createNotification } = require('../services/notification.service');
const logger = require('../utils/logger');

// Run at 9 PM every day
cron.schedule('0 21 * * *', async () => {
  try {
    logger.info('Running daily summary cron job');
    const users = await User.find({ 'preferences.notifications.email': true });

    for (const user of users) {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1);

      const todayExpenses = await Expense.aggregate([
        { $match: { userId: user._id, date: { $gte: today, $lt: tomorrow } } },
        { $group: { _id: null, total: { $sum: '$amount' }, count: { $sum: 1 } } }
      ]);

      if (todayExpenses.length > 0) {
        const { total, count } = todayExpenses[0];
        const title = `Daily Summary: Spent ₹${total.toFixed(2)} today`;
        const message = `You made ${count} transaction(s) totaling ₹${total.toFixed(2)} today.`;

        await createNotification(user._id, 'daily_summary', title, message);
        await sendEmail(user.email, title, `<p>Hi ${user.name},</p><p>${message}</p>`);
      }
    }
    logger.info('Daily summary cron completed');
  } catch (err) {
    logger.error('Daily summary cron failed:', err);
  }
});
