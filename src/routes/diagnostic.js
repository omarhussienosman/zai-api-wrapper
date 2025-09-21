const express = require('express');
const router = express.Router();
const diagnostic = require('../utils/diagnostic');

// تشغيل تشخيص كامل
router.get('/full', async (req, res, next) => {
  try {
    const results = await diagnostic.runFullDiagnostic();
    res.json({
      success: true,
      data: results,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    next(error);
  }
});

// اختبار الاتصال فقط
router.get('/connection', async (req, res, next) => {
  try {
    const result = await diagnostic.testConnection();
    res.json({
      success: result.success,
      data: result,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;