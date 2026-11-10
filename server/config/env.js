import 'dotenv/config';

// Single place that reads process.env. Secrets are validated at startup so a
// missing JWT_SECRET fails loudly instead of silently signing weak tokens.
if (!process.env.JWT_SECRET) {
  console.error('Missing JWT_SECRET. Copy .env.example to .env and set a long random value.');
  process.exit(1);
}

export const config = {
  port: Number(process.env.PORT) || 5000,
  clientOrigin: process.env.CLIENT_ORIGIN || 'http://localhost:5173',
  mongoUri: process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/interviewx',
  jwtSecret: process.env.JWT_SECRET,
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '7d',
  ollamaBaseUrl: process.env.OLLAMA_BASE_URL || 'http://localhost:11434',
  ollamaModel: process.env.OLLAMA_MODEL || '', // intentionally no default: you choose the model
  ollamaTimeoutMs: Number(process.env.OLLAMA_TIMEOUT_MS) || 120000,
};
