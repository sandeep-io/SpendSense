const mongoose = require('mongoose');
const budgetSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  type: {
    type: String,
    enum: ['overall', 'category'],
    required: true
  },
  category: {
    type: String,
    required: function() { return this.type === 'category'; }
  },
  limit: {
    type: Number,
    required: true,
    min: 0
  },
  period: {
    type: String,
    enum: ['daily', 'weekly', 'monthly', 'yearly'],
    default: 'monthly'
  },
  startDate: {
    type: Date,
    required: true
  },
  endDate: {
    type: Date,
    required: true
  },
  spent: {
    type: Number,
    default: 0
  },
  alertThresholds: [{
    percentage: { type: Number, min: 0, max: 100 },
    triggered: { type: Boolean, default: false }
  }],
  isActive: {
    type: Boolean,
    default: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Compound index
budgetSchema.index({ userId: 1, type: 1, category: 1 });

// Method to reset monthly budgets
budgetSchema.statics.resetMonthlyBudgets = async function() {
  const now = new Date();
  await this.updateMany(
    { period: 'monthly', endDate: { $lt: now } },
    { 
      spent: 0, 
      'alertThresholds.$[].triggered': false,
      startDate: new Date(now.getFullYear(), now.getMonth(), 1),
      endDate: new Date(now.getFullYear(), now.getMonth() + 1, 0)
    }
  );
};

module.exports = mongoose.model('Budget', budgetSchema);
