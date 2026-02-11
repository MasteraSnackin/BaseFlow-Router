
import { Router as ExpressRouter, type Request } from 'express';
import { getQuote, type QuoteRequest } from '../services/router.js';
import { validateRequest, asyncHandler } from '../lib/middleware.js';
import { quoteRequestSchema, type ValidatedQuoteRequest } from '../lib/validation.js';
import { statsService } from '../services/stats.js';

const router = ExpressRouter();

/**
 * POST /quote
 * Get best quote for token swap with venue comparison
 */
router.post(
  '/',
  validateRequest(quoteRequestSchema),
  asyncHandler(async (req: Request, res) => {
    // 1. Track Request
    statsService.incrementTotalRequests();

    try {
      const validatedBody = req.body as ValidatedQuoteRequest;

      // 2. Get Quote (Service handles Mock Mode logic internally)
      const quote = await getQuote(validatedBody);

      // 3. Track Success & Volume
      // converting string amount to number for stats (approximate)
      // in production, use BigInt or exact USD values
      const volumeUSD = Number(quote.amountIn) / 10 ** 18 * quote.coingeckoReferencePriceTokenInUSD;
      statsService.recordQuote(true, volumeUSD);

      return res.json({ success: true, data: quote });

    } catch (error) {
      // 4. Track Failure
      statsService.recordQuote(false);
      throw error; // Pass to global error handler
    }
  })
);

export default router;
