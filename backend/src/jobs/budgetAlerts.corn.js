const cron = require('node-cron');
const Budget = require('../models/Budget');
const User = require('../models/User');
const { sendBudgetAlert } = require('../services/notification.service');
const logger = require('../utils/logger');

// Run every hour
cron.schedule('0 * * * *', async () => {
  try {
    logger.info('Running budget alert cron job');
    const budgets = await Budget.find({ isActive: true });

    for (const budget of budgets) {
      const percentage = Math.round((budget.spent / budget.limit) * 100);
      for (const threshold of budget.alertThresholds) {
        if (percentage >= threshold.percentage && !threshold.triggered) {
          const user = await User.findById(budget.userId);
          if (user) await sendBudgetAlert(user, budget, percentage);
          threshold.triggered = true;
        }
      }
      await budget.save();
    }
    logger.info('Budget alert cron completed');
  } catch (err) {
    logger.error('Budget alert cron failed:', err);
  }
});
