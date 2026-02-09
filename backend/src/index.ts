import 'dotenv/config';
import express, { type Request, type Response } from 'express';
import quoteRouter from './routes/quote.js';
import { CONFIG } from './config/env.js';
import { errorHandler } from './lib/middleware.js';

const app = express();

// Middleware
app.use(express.json());

// CORS for frontend
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  next();
});

// Health check endpoint
app.get('/health', (_req: Request, res: Response) => {
  res.json({
    ok: true,
    message: 'DeFi Router API is running',
    config: {
      routerConfigured: !!CONFIG.routerAddress,
      chainId: 84532,
      network: 'Base Sepolia'
    }
  });
});

// Quote endpoint
app.use('/quote', quoteRouter);

// Global error handler (must be last)
app.use(errorHandler);

app.listen(CONFIG.port, () => {
  console.log(`⚡️[server]: Backend listening on port ${CONFIG.port}`);
  console.log(`Router Address: ${CONFIG.routerAddress || '⚠️  NOT CONFIGURED'}`);
  console.log(`RPC URL: ${CONFIG.rpcUrl}`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
});
