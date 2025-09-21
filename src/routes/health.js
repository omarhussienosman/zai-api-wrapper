const express = require('express');
const router = express.Router();
const openaiService = require('../services/zaiService');
const tokenTracker = require('../middleware/tokenTracker');

router.get('/', async (req, res) => {
  try {
    // فحص بسيط للاتصال بـ OpenAI
    await openaiService.listModels();
    
    res.json({
      status: 'healthy',
      timestamp: new Date().toISOString(),
      usage: tokenTracker.getUsage()
    });
  } catch (error) {
    res.status(503).json({
      status: 'unhealthy',
      error: error.message
    });
  }
});

module.exports = router;