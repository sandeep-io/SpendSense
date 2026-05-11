const logger = require('../utils/logger');

exports.errorHandler = (err, req, res, next) => {
  logger.error(err.message, { stack: err.stack, url: req.url });

  if (err.name === 'ValidationError') {
    const errors = Object.values(err.errors).map(e => e.message);
    return res.status(400).json({ error: 'Validation failed', details: errors });
  }
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue)[0];
    return res.status(409).json({ error: `${field} already exists` });
  }
  if (err.name === 'JsonWebTokenError') {
    return res.status(401).json({ error: 'Invalid token' });
  }

  res.status(err.status || 500).json({ error: err.message || 'Internal server error' });
};
