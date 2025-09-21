const NodeCache = require('node-cache');
const config = require('../config/zai');

class CacheService {
  constructor() {
    this.cache = new NodeCache({
      stdTTL: parseInt(process.env.CACHE_TTL) || 300,
      checkperiod: 60
    });
  }

  get(key) {
    return this.cache.get(key);
  }

  set(key, value, ttl = config.cacheTTL) {
    return this.cache.set(key, value, ttl);
  }

  del(key) {
    return this.cache.del(key);
  }

  flush() {
    return this.cache.flushAll();
  }

  generateKey(endpoint, params) {
    return `${endpoint}:${JSON.stringify(params)}`;
  }
}

module.exports = new CacheService();