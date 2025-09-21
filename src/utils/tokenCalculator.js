const tiktoken = require('@dqbd/tiktoken');

class TokenCalculator {
  constructor() {
    this.encoder = tiktoken.get_encoding('cl100k_base');
  }

  estimate(text) {
    if (!text) return 0;
    
    // تقدير سريع: 1 token ≈ 4 أحرف للإنجليزية
    const quickEstimate = Math.ceil(text.length / 4);
    
    // حساب دقيق باستخدام tiktoken
    try {
      const tokens = this.encoder.encode(text);
      return tokens.length;
    } catch (error) {
      return quickEstimate;
    }
  }

  calculateMessagesTokens(messages) {
    let tokens = 0;
    
    for (const message of messages) {
      tokens += this.estimate(message.role);
      tokens += this.estimate(message.content);
      tokens += 3; // لكل رسالة: role, content, and end
    }
    
    tokens += 3; // للرسائل الإضافية
    
    return tokens;
  }
}

module.exports = new TokenCalculator();