// routes/expense.routes.js
const router = require('express').Router();
const { authenticate } = require('../middleware/auth.middleware');
const { 
  getExpenses, 
  addExpense, 
  updateExpense, 
  deleteExpense 
} = require('../controllers/expenseController');

// All routes require authentication
router.use(authenticate);

router.get('/', getExpenses);          // GET /api/expenses?month=4&year=2025
router.post('/', addExpense);          // POST /api/expenses
router.patch('/:id', updateExpense);   // PATCH /api/expenses/:id
router.delete('/:id', deleteExpense);  // DELETE /api/expenses/:id

module.exports = router;