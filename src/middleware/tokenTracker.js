const config = require('../config/zai');

class TokenTracker {
  constructor() {
    this.tokensUsed = 0;
    this.lastReset = Date.now();
    this.windowMs = 60 * 1000; // 1 minute
  }

  addTokens(tokens) {
    this.resetIfNeeded();
    this.tokensUsed += tokens;
  }

  wouldExceedLimit(tokensToAdd) {
    this.resetIfNeeded();
    return (this.tokensUsed + tokensToAdd) > config.limits.tpm;
  }

  resetIfNeeded() {
    const now = Date.now();
    if (now - this.lastReset > this.windowMs) {
      this.tokensUsed = 0;
      this.lastReset = now;
    }
  }

  getTimeToReset() {
    return Math.max(0, Math.ceil((this.lastReset + this.windowMs - Date.now()) / 1000));
  }

  getUsage() {
    this.resetIfNeeded();
    return {
      tokensUsed: this.tokensUsed,
      limit: config.limits.tpm,
      remaining: config.limits.tpm - this.tokensUsed,
      resetIn: this.getTimeToReset()
    };
  }
}

module.exports = new TokenTracker();