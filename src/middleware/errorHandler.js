const logger = require('../utils/logger');

const errorHandler = (err, req, res, next) => {
  logger.error('API Error:', err);
  
  if (err.status) {
    return res.status(err.status).json({
      error: err.message,
      ...(err.retryAfter && { retryAfter: err.retryAfter }),
      ...(err.usage && { usage: err.usage })
    });
  }
  
  res.status(500).json({
    error: 'Internal server error'
  });
};

module.exports = errorHandler;