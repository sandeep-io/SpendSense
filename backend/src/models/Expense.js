const mongoose = require('mongoose');
const expenseSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  amount: {
    type: Number,
    required: true,
    min: 0
  },
  category: {
    type: String,
    required: true,
    enum: [
      'Food & Dining',
      'Shopping',
      'Transportation',
      'Healthcare',
      'Entertainment',
      'Bills & Utilities',
      'Education',
      'Investments',
      'Gifts & Donations',
      'Others'
    ]
  },
  subcategory: {
    type: String
  },
  merchant: {
    type: String,
    trim: true
  },
  paymentMode: {
    type: String,
    enum: ['UPI', 'Card', 'Cash', 'Net Banking', 'Wallet'],
    default: 'Cash'
  },
  date: {
    type: Date,
    required: true,
    default: Date.now
  },
  notes: {
    type: String,
    maxlength: 200
  },
  isRecurring: {
    type: Boolean,
    default: false
  },
  recurringId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'RecurringExpense'
  },
  tags: [String],
  receipt: {
    url: String,
    ocrText: String
  },
  source: {
    type: String,
    enum: ['manual', 'sms', 'receipt_scan', 'import'],
    default: 'manual'
  },
  smsData: {
    rawText: String,
    parsedAt: Date
  },
  isConfirmed: {
    type: Boolean,
    default: true  // false for SMS-detected, pending confirmation
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: Date
});

// Indexes for fast queries
expenseSchema.index({ userId: 1, date: -1 });
expenseSchema.index({ userId: 1, category: 1 });
expenseSchema.index({ userId: 1, merchant: 1 });

// Virtual for month/year
expenseSchema.virtual('month').get(function() {
  return this.date.getMonth() + 1;
});

expenseSchema.virtual('year').get(function() {
  return this.date.getFullYear();
});

module.exports = mongoose.model('Expense', expenseSchema);
