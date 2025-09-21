require('dotenv').config();

module.exports = {
  apiKey: process.env.ZAI_API_KEY,
  baseUrl: 'https://api.z.ai/api/paas',
  timeout: parseInt(process.env.REQUEST_TIMEOUT) || 30000,
  endpoints: {
    chat: '/v4/chat/completions',
    image: '/v4/images/generations',
    embedding: '/v4/embeddings',
    tts: '/v4/audio/speech',
    stt: '/v4/audio/transcriptions',
    models: '/v4/models',
    moderations: '/v4/moderations'
  },
  models: {
    chat: 'glm-4-32b-0414-128k',
    embedding: 'glm-4-32b-0414-128k',
    image: 'glm-4-32b-0414-128k',
    tts: 'glm-4-32b-0414-128k',
    stt: 'glm-4-32b-0414-128k'
  },
  limits: {
    rpm: parseInt(process.env.MAX_REQUESTS_PER_MINUTE) || 10,
    tpm: parseInt(process.env.MAX_TOKENS_PER_MINUTE) || 100000
  }
};