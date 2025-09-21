const express = require('express');
const router = express.Router();
const zaiService = require('../services/zaiService'); // تغيير هنا
const { generalLimiter, tokenLimiter } = require('../middleware/rateLimiter');

router.use(generalLimiter);
router.use(tokenLimiter);

// Chat Completions
router.post('/chat', async (req, res, next) => {
  try {
    const { messages, ...options } = req.body;
    
    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({ error: 'Messages array is required' });
    }
    
    const result = await zaiService.chatCompletion(messages, options);
    res.json({
      success: true,
      data: result.content,
      usage: result.usage
    });
  } catch (error) {
    next(error);
  }
});

// Image Generation
router.post('/image', async (req, res, next) => {
  try {
    const { prompt, ...options } = req.body;
    
    if (!prompt) {
      return res.status(400).json({ error: 'Prompt is required' });
    }
    
    const imageUrl = await zaiService.generateImage(prompt, options);
    res.json({
      success: true,
      data: { imageUrl }
    });
  } catch (error) {
    next(error);
  }
});

// Embeddings
router.post('/embeddings', async (req, res, next) => {
  try {
    const { input, ...options } = req.body;
    
    if (!input) {
      return res.status(400).json({ error: 'Input text is required' });
    }
    
    const embedding = await zaiService.createEmbedding(input, options);
    res.json({
      success: true,
      data: { embedding }
    });
  } catch (error) {
    next(error);
  }
});

// Text-to-Speech
router.post('/tts', async (req, res, next) => {
  try {
    const { text, ...options } = req.body;
    
    if (!text) {
      return res.status(400).json({ error: 'Text is required' });
    }
    
    const audioBuffer = await zaiService.textToSpeech(text, options);
    res.set('Content-Type', 'audio/mpeg');
    res.send(audioBuffer);
  } catch (error) {
    next(error);
  }
});

// Speech-to-Text
router.post('/stt', async (req, res, next) => {
  try {
    if (!req.files || !req.files.audio) {
      return res.status(400).json({ error: 'Audio file is required' });
    }
    
    const audioBuffer = req.files.audio.data;
    const filename = req.files.audio.name;
    const text = await zaiService.speechToText(audioBuffer, filename);
    res.json({
      success: true,
      data: { text }
    });
  } catch (error) {
    next(error);
  }
});

// List Models
router.get('/models', async (req, res, next) => {
  try {
    const models = await zaiService.listModels();
    res.json({
      success: true,
      data: { models }
    });
  } catch (error) {
    next(error);
  }
});

// Content Moderation
router.post('/moderate', async (req, res, next) => {
  try {
    const { input } = req.body;
    
    if (!input) {
      return res.status(400).json({ error: 'Input text is required' });
    }
    
    const result = await zaiService.moderateContent(input);
    res.json({
      success: true,
      data: result
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;