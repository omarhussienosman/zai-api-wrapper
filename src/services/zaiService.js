const axios = require('axios');
const FormData = require('form-data');
const config = require('../config/zai');
const cacheService = require('./cacheService');
const logger = require('../utils/logger');

class ZAIService {
  constructor() {
    this.client = axios.create({
      baseURL: config.baseUrl,
      timeout: config.timeout,
      headers: {
        'Authorization': `Bearer ${config.apiKey}`,
        'Content-Type': 'application/json'
      }
    });
  }

  async chatCompletion(messages, options = {}) {
    const params = {
      model: options.model || config.models.chat,
      messages,
      temperature: options.temperature || 0.7,
      max_tokens: options.maxTokens || 1000
    };

    const cacheKey = cacheService.generateKey('chat', { messages, ...options });
    const cached = cacheService.get(cacheKey);
    
    if (cached) {
      logger.info('Cache hit for chat completion');
      return cached;
    }

    try {
      const response = await this.client.post(config.endpoints.chat, params);
      const result = {
        content: response.data.choices[0].message.content,
        usage: response.data.usage
      };
      
      cacheService.set(cacheKey, result);
      logger.info('Chat completion successful');
      return result;
    } catch (error) {
      logger.error('Chat completion failed', error);
      throw this.handleApiError(error);
    }
  }

  async generateImage(prompt, options = {}) {
    const params = {
      model: config.models.image,
      prompt,
      n: options.n || 1,
      size: options.size || '1024x1024',
      response_format: 'url'
    };

    try {
      const response = await this.client.post(config.endpoints.image, params);
      logger.info('Image generation successful');
      return response.data.data[0].url;
    } catch (error) {
      logger.error('Image generation failed', error);
      throw this.handleApiError(error);
    }
  }

  async createEmbedding(text, options = {}) {
    const params = {
      model: options.model || config.models.embedding,
      input: text
    };

    const cacheKey = cacheService.generateKey('embedding', { text, ...options });
    const cached = cacheService.get(cacheKey);
    
    if (cached) {
      logger.info('Cache hit for embedding');
      return cached;
    }

    try {
      const response = await this.client.post(config.endpoints.embedding, params);
      const result = response.data.data[0].embedding;
      
      cacheService.set(cacheKey, result);
      logger.info('Embedding creation successful');
      return result;
    } catch (error) {
      logger.error('Embedding creation failed', error);
      throw this.handleApiError(error);
    }
  }

  async textToSpeech(text, options = {}) {
    const params = {
      model: config.models.tts,
      input: text,
      voice: options.voice || 'alloy'
    };

    try {
      const response = await this.client.post(config.endpoints.tts, params, {
        responseType: 'arraybuffer'
      });
      logger.info('Text-to-speech conversion successful');
      return response.data;
    } catch (error) {
      logger.error('Text-to-speech conversion failed', error);
      throw this.handleApiError(error);
    }
  }

  async speechToText(audioBuffer, filename = 'audio.mp3') {
    const formData = new FormData();
    formData.append('file', audioBuffer, {
      filename,
      contentType: 'audio/mpeg'
    });
    formData.append('model', config.models.stt);

    try {
      const response = await this.client.post(config.endpoints.stt, formData, {
        headers: formData.getHeaders()
      });
      logger.info('Speech-to-text conversion successful');
      return response.data.text;
    } catch (error) {
      logger.error('Speech-to-text conversion failed', error);
      throw this.handleApiError(error);
    }
  }

  async listModels() {
    try {
      const response = await this.client.get(config.endpoints.models);
      logger.info('Models list retrieved successfully');
      return response.data.data;
    } catch (error) {
      logger.error('Failed to retrieve models list', error);
      throw this.handleApiError(error);
    }
  }

  async moderateContent(text) {
    const params = { input: text };

    try {
      const response = await this.client.post(config.endpoints.moderations, params);
      logger.info('Content moderation successful');
      return response.data.results[0];
    } catch (error) {
      logger.error('Content moderation failed', error);
      throw this.handleApiError(error);
    }
  }

  handleApiError(error) {
    if (error.response) {
      const status = error.response.status;
      const errorData = error.response.data;
      let message = errorData?.error?.message || error.message;
      
      // تسجيل تفاصيل الخطأ الكاملة للتشخيص
      logger.error('API Error Details:', {
        status,
        message,
        url: error.config?.url,
        method: error.config?.method,
        data: error.config?.data,
        responseData: errorData
      });
      
      if (status === 429) {
        return {
          status: 429,
          message: 'Rate limit exceeded',
          retryAfter: error.response.headers['retry-after'] || 60
        };
      }
      
      if (status === 401) {
        return {
          status: 401,
          message: 'Invalid API key',
          details: 'Please check your Z.AI API key in the .env file'
        };
      }
      
      if (status === 403) {
        return {
          status: 403,
          message: 'Access forbidden',
          details: message
        };
      }
      
      if (status === 404) {
        return {
          status: 404,
          message: 'Endpoint not found',
          details: `The endpoint ${error.config?.url} does not exist. Please check the API documentation.`
        };
      }
      
      return {
        status,
        message,
        details: errorData
      };
    }
    
    return {
      status: 500,
      message: 'Internal server error',
      details: error.message
    };
  }
}

module.exports = new ZAIService();