const express = require('express');
const cors = require('cors');
const { errorHandler } = require('./middleware/errorHandler');
const { rateLimiter } = require('./middleware/rateLimiter');

// Route imports
const authRoutes = require('./routes/auth.routes');
const expenseRoutes = require('./routes/expense.routes');
const budgetRoutes = require('./routes/budget.route');
const analyticsRoutes = require('./routes/analytics.routes');

const app = express();

// Middleware
app.use(cors({ origin: process.env.CLIENT_URL, credentials: true }));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(rateLimiter);

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/expenses', expenseRoutes);
app.use('/api/budgets', budgetRoutes);
app.use('/api/analytics', analyticsRoutes);

// Root route
app.get('/', (req, res) => {
  res.json({
    status: 'ok',
    service: 'SpendSense API',
    version: '1.0.0',
    endpoints: {
      auth: '/api/auth',
      expenses: '/api/expenses',
      budgets: '/api/budgets',
      analytics: '/api/analytics',
      health: '/health',
    },
  });
});

// Health check
app.get('/health', (req, res) => res.json({ status: 'ok', service: 'SpendSense API' }));

// 404 handler for unknown routes
app.use((req, res) => {
  res.status(404).json({
    status: 'error',
    message: `Route ${req.method} ${req.originalUrl} not found`,
  });
});

// Error handler (must be last)
app.use(errorHandler);

module.exports = app;
