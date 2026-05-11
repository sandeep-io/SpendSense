const Notification = require('../models/Notification');
const nodemailer = require('nodemailer');
const logger = require('../utils/logger');

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: process.env.EMAIL_PORT,
  auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS }
});

exports.createNotification = async (userId, type, title, message, data = {}) => {
  try {
    return await Notification.create({ userId, type, title, message, data });
  } catch (err) {
    logger.error('Notification creation failed:', err);
  }
};

exports.sendEmail = async (to, subject, html) => {
  try {
    await transporter.sendMail({ from: process.env.EMAIL_USER, to, subject, html });
    logger.info(`Email sent to ${to}`);
  } catch (err) {
    logger.error('Email send failed:', err);
  }
};

exports.sendBudgetAlert = async (user, budget, percentage) => {
  const title = `Budget Alert: ${budget.category || 'Overall'} at ${percentage}%`;
  const message = `You've used ${percentage}% of your ${budget.period} budget of ₹${budget.limit}.`;
  await exports.createNotification(user._id, 'budget_alert', title, message, { budgetId: budget._id });

  if (user.preferences?.notifications?.email) {
    await exports.sendEmail(user.email, title, `<p>${message}</p>`);
  }
};
