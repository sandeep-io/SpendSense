const router = require('express').Router();
const { authenticate } = require('../middleware/auth.middleware');
const { getMonthlySummary, getCategoryBreakdown, getSpendingTrend, getTopMerchants } = require('../controllers/analyticsController');

router.use(authenticate);
router.get('/monthly', getMonthlySummary);
router.get('/categories', getCategoryBreakdown);
router.get('/trend', getSpendingTrend);
router.get('/merchants', getTopMerchants);

module.exports = router;
