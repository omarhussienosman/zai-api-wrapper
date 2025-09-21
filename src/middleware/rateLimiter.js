const rateLimit = require('express-rate-limit');
const config = require('../config/zai');

const createRateLimiter = (windowMs, max, message) => {
  return rateLimit({
    windowMs,
    max,
    message: {
      error: message,
      retryAfter: Math.round(windowMs / 1000)
    },
    standardHeaders: true,
    legacyHeaders: false
  });
};

const generalLimiter = createRateLimiter(
  60 * 1000, // 1 minute
  config.limits.rpm,
  'Too many requests from this IP, please try again later'
);

const tokenLimiter = async (req, res, next) => {
  const tokenCalculator = require('../utils/tokenCalculator');
  const tokenTracker = require('./tokenTracker');
  
  try {
    const content = req.body.prompt || req.body.input || req.body.text || '';
    const estimatedTokens = tokenCalculator.estimate(content);
    
    if (tokenTracker.wouldExceedLimit(estimatedTokens)) {
      return res.status(429).json({
        error: 'Token limit exceeded for this minute',
        retryAfter: tokenTracker.getTimeToReset(),
        usage: tokenTracker.getUsage()
      });
    }
    
    tokenTracker.addTokens(estimatedTokens);
    next();
  } catch (error) {
    next(error);
  }
};

module.exports = {
  generalLimiter,
  tokenLimiter
};