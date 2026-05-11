const mongoose = require('mongoose');
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true
  },
  phone: {
    type: String,
    sparse: true,
    unique: true
  },
  password: {
    type: String,
    required: true,
    minlength: 6
  },
  profilePicture: {
    type: String,
    default: 'https://ui-avatars.com/api/?name=User'
  },
  preferences: {
    currency: { type: String, default: 'INR' },
    language: { type: String, default: 'en' },
    theme: { type: String, enum: ['light', 'dark', 'auto'], default: 'auto' },
    notifications: {
      email: { type: Boolean, default: true },
      push: { type: Boolean, default: true },
      budgetAlerts: { type: Boolean, default: true }
    }
  },
  monthlyIncome: {
    type: Number,
    default: 0
  },
  isVerified: {
    type: Boolean,
    default: false
  },
  refreshTokens: [{
    token: String,
    createdAt: { type: Date, default: Date.now },
    expiresAt: Date
  }],
  createdAt: {
    type: Date,
    default: Date.now
  },
  lastLogin: Date
});

// Indexes (unique: true above already creates these indexes implicitly)
// userSchema.index({ email: 1 });
// userSchema.index({ phone: 1 });

module.exports = mongoose.model('User', userSchema);
