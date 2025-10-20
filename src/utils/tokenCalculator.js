const tiktoken = require('@dqbd/tiktoken');

class TokenCalculator {
  constructor() {
    this.encoder = tiktoken.get_encoding('cl100k_base');
  }

  estimate(text) {
    if (!text) return 0;
    
    const quickEstimate = Math.ceil(text.length / 4);
    
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
      tokens += 3; 
    }
    
    tokens += 3;
    
    return tokens;
  }
}

module.exports = new TokenCalculator();