const router = require('express').Router();
const { authenticate } = require('../middleware/auth.middleware');
const { validateBudget } = require('../middleware/validator');
const { getBudgets, createBudget, updateBudget, deleteBudget } = require('../controllers/budgetController');

router.use(authenticate);
router.get('/', getBudgets);
router.post('/', validateBudget, createBudget);
router.patch('/:id', updateBudget);
router.delete('/:id', deleteBudget);

module.exports = router;
