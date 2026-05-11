const mongoose = require('mongoose');
const categorySchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
    // null for default categories (shared across users)
  },
  name: {
    type: String,
    required: true
  },
  icon: {
    type: String,
    default: '📌'
  },
  color: {
    type: String,
    default: '#6366f1'
  },
  isDefault: {
    type: Boolean,
    default: false
  },
  merchantKeywords: [String],  // Auto-matching keywords
  createdAt: {
    type: Date,
    default: Date.now
  }
});

categorySchema.index({ userId: 1, name: 1 }, { unique: true });

module.exports = mongoose.model('Category', categorySchema);
