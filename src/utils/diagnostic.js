const axios = require('axios');
const config = require('../config/zai');
const logger = require('./logger');

class Diagnostic {
  async testConnection() {
    try {
      logger.info('Testing Z.AI API connection...');
      
      const response = await axios.get(`${config.baseUrl}/v4/models`, {
        headers: {
          'Authorization': `Bearer ${config.apiKey}`,
          'Content-Type': 'application/json'
        },
        timeout: 10000
      });
      
      logger.info('Connection test successful', {
        status: response.status,
        modelCount: response.data.data?.length || 0
      });
      
      return {
        success: true,
        status: response.status,
        message: 'Connection successful',
        modelCount: response.data.data?.length || 0
      };
    } catch (error) {
      logger.error('Connection test failed', error);
      
      return {
        success: false,
        status: error.response?.status || 500,
        message: 'Connection failed',
        error: this.handleDiagnosticError(error)
      };
    }
  }

  handleDiagnosticError(error) {
    if (error.response) {
      return {
        status: error.response.status,
        message: error.response.data?.error?.message || error.message,
        url: error.config?.url
      };
    }
    
    return {
      message: error.message,
      code: error.code
    };
  }

  async testEndpoint(endpoint) {
    try {
      const url = `${config.baseUrl}${endpoint}`;
      logger.info(`Testing endpoint: ${url}`);
      
      const response = await axios.get(url, {
        headers: {
          'Authorization': `Bearer ${config.apiKey}`,
          'Content-Type': 'application/json'
        },
        timeout: 10000
      });
      
      logger.info(`Endpoint test successful: ${endpoint}`);
      
      return {
        success: true,
        endpoint,
        status: response.status,
        message: 'Endpoint accessible'
      };
    } catch (error) {
      logger.error(`Endpoint test failed: ${endpoint}`, error);
      
      return {
        success: false,
        endpoint,
        status: error.response?.status || 500,
        message: 'Endpoint not accessible',
        error: this.handleDiagnosticError(error)
      };
    }
  }

  async runFullDiagnostic() {
    logger.info('Running full diagnostic...');
    
    const results = {
      connection: await this.testConnection(),
      endpoints: {}
    };
    
    const endpoints = [
      '/v4/models',
      '/v4/chat/completions',
      '/v4/embeddings',
      '/v4/images/generations',
      '/v4/audio/speech',
      '/v4/audio/transcriptions',
      '/v4/moderations'
    ];
    
    for (const endpoint of endpoints) {
      results.endpoints[endpoint] = await this.testEndpoint(endpoint);
    }
    
    logger.info('Diagnostic completed', results);
    return results;
  }
}

module.exports = new Diagnostic();