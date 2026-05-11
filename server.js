require('dotenv').config();
const app = require('./backend/src/app');
const connectDB = require('./backend/src/config/database');
const logger = require('./backend/src/utils/logger');

// Cron Jobs
require('./backend/src/jobs/budgetAlerts.corn');
require('./backend/src/jobs/dailySummary.corn');

const PORT = process.env.PORT || 5000;

connectDB().then(() => {
  app.listen(PORT, () => {
    logger.info(`SpendSense server running on port ${PORT}`);
  });
});

process.on('unhandledRejection', (err) => {
  logger.error('Unhandled Rejection:', err);
  process.exit(1);
});
