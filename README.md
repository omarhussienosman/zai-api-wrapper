# ZAI Free API Wrapper

A comprehensive Node.js wrapper for ZAI APIs optimized for free-tier accounts with built-in rate limiting, caching, and token management.

## Features

- **Rate Limiting**: Automatic management of ZAI's free-tier limits (3 requests/minute, 40K tokens/minute)
- **Token Tracking**: Real-time monitoring of token usage with automatic reset
- **Response Caching**: Intelligent caching to reduce API calls and costs
- **Error Handling**: Comprehensive error handling for ZAI API responses
- **All APIs Supported**: Chat, Image Generation, Embeddings, Text-to-Speech, Speech-to-Text, Models, and Moderation
- **File Upload**: Support for audio file uploads with Multer
- **Health Monitoring**: Built-in health check endpoint
- **Logging**: Detailed logging with Winston

## Installation

1. Clone the repository:
```bash
git clone https://github.com/omarhussienosman/zai-api-wrapper.git
cd zai-api-wrapper