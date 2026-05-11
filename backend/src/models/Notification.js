const mongoose = require('mongoose');
const notificationSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  type: {
    type: String,
    enum: [
      'expense_detected',
      'budget_alert',
      'daily_summary',
      'recurring_due',
      'unusual_activity',
      'milestone'
    ],
    required: true
  },
  title: {
    type: String,
    required: true
  },
  message: {
    type: String,
    required: true
  },
  data: {
    type: mongoose.Schema.Types.Mixed  // Additional context (expenseId, budgetId, etc.)
  },
  isRead: {
    type: Boolean,
    default: false
  },
  actionUrl: String,
  createdAt: {
    type: Date,
    default: Date.now,
    expires: 2592000  // Auto-delete after 30 days
  }
});

notificationSchema.index({ userId: 1, createdAt: -1 });

module.exports = mongoose.model('Notification', notificationSchema);
