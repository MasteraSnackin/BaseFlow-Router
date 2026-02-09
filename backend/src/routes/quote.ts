import { Router as ExpressRouter, type Request, type Response } from 'express';
import { getQuote } from '../services/router.js';
import { validateRequest, asyncHandler } from '../lib/middleware.js';
import { quoteRequestSchema, type ValidatedQuoteRequest } from '../lib/validation.js';

const router = ExpressRouter();

/**
 * POST /quote
 * Get best quote for token swap with venue comparison
 */
router.post(
  '/',
  validateRequest(quoteRequestSchema),
  asyncHandler(async (req: Request, res: Response) => {
    const validatedBody = req.body as ValidatedQuoteRequest;
    const result = await getQuote(validatedBody);
    return res.json({ success: true, data: result });
  })
);

export default router;
