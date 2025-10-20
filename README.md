# ZAI API Wrapper

A Node.js wrapper for Z.AI APIs with built-in rate limiting, caching, token tracking, and useful helpers  optimized for free-tier accounts.

This project helps you integrate Z.AI features (chat, images, embeddings, TTS, STT, moderation, and model listing) into your web server with production-minded defaults.

## Key Features

- Rate limiting and token-aware controls suitable for free-tier limits
- Token usage tracking and reset capabilities
- Response caching to reduce API calls and costs
- Support for chat completions, image generation, embeddings, TTS, STT, moderation, and model listing
- File upload support (audio) via multer
- Health check endpoint
- Structured logging using winston

## Requirements

- Node.js >= 16
- A valid Z.AI API key

## Installation

1. Clone the repository and install dependencies:

`powershell
git clone https://github.com/omarhussienosman/zai-api-wrapper.git; cd zai-api-wrapper
npm install
`

2. Create a .env file in the project root containing at least:

`
ZAI_API_KEY=sk-xxxxxxxxxxxxxxxxxxxxxxxx
PORT=3000
`

3. Start the server:

`powershell
npm run start
`

For development with auto-reload:

`powershell
npm run dev
`

## API Endpoints (summary)

All API routes are mounted under /api (see src/routes/api.js).

- POST /api/chat
  - Chat completion endpoint. Body: { messages: [{ role, content }], model?, temperature?, maxTokens? }
  - Response: { success: true, data: string, usage: { prompt_tokens, completion_tokens, total_tokens } }

- POST /api/image
  - Image generation. Body: { prompt, size?, n? }
  - Response: { success: true, data: { imageUrl } }

- POST /api/embeddings
  - Create embeddings. Body: { input }
  - Response: { success: true, data: { embedding: number[] } }

- POST /api/tts
  - Convert text to speech. Body: { text, voice? }
  - Returns binary audio (Content-Type: audio/mpeg)

- POST /api/stt
  - Upload audio file (field name udio) to convert to text.
  - Response: { success: true, data: { text } }

- GET /api/models
  - List available models.

- POST /api/moderate
  - Content moderation. Body: { input }

- GET /health
  - Health check (status, timestamp, token usage)

## Project Structure (short)

- index.js  app entry
- src/app.js  express app setup and middleware
- src/routes/  api, health, diagnostic routers
- src/services/zaiService.js  HTTP client and logic for Z.AI interactions
- src/services/cacheService.js  local cache helper
- src/middleware/  rate limiting, token tracker, error handler
- src/utils/logger.js  winston logger configuration

## Configuration & customization

- Adjust rate limits in src/middleware/rateLimiter.js
- Update API endpoints, keys, and default models in src/config/zai.js
- Tweak caching in src/services/cacheService.js

## Logging & error handling

The project logs via winston. Error details from Z.AI are captured and normalized in zaiService.

## Testing

Run tests (if any):

`powershell
npm test
`

## Contributing

Contributions are welcome:

1. Fork the repo and create a feature branch: git checkout -b feature/your-feature
2. Add tests and documentation for your changes
3. Open a Pull Request describing the change

Please update the README when you add or change API endpoints.

## Known notes

- This wrapper is tuned for free-tier constraints. You may hit 429 responses if you exceed the external API limits.
- Keep your ZAI_API_KEY secret  do not commit it to a public repository.

## License

MIT  see LICENSE for details.

---

If you want, I can also:

- Add runnable examples under examples/ for common endpoints (chat, tts)
- Create a .env.example file
- Generate a Postman collection or curl examples

Tell me which of the above you'd like next and I will implement it.
