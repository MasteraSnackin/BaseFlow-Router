import { Router as ExpressRouter, type Request, type Response } from 'express';
import { getQuote } from '../services/router.js';
import { validateRequest, asyncHandler } from '../lib/middleware.js';
import { quoteRequestSchema, type ValidatedQuoteRequest } from '../lib/validation.js';
import { CONFIG } from '../config/env.js';

const router = ExpressRouter();

// Mock mode detection
const MOCK_ROUTER_ADDRESS = '0x1234567890123456789012345678901234567890';
const isMockMode = () => CONFIG.routerAddress === MOCK_ROUTER_ADDRESS;

// Mock quote generator
function generateMockQuote(req: ValidatedQuoteRequest) {
  const { chainId, tokenIn, tokenOut, amountIn } = req;
  const amountInBigInt = BigInt(amountIn);
  const baselineAmountOut = amountInBigInt;
  const smartAmountOut = (amountInBigInt * 105n) / 100n;

  return {
    chainId,
    tokenIn,
    tokenOut,
    amountIn,
    baselineVenue: 'DEX_A' as const,
    baselineAmountOut: baselineAmountOut.toString(),
    smartVenue: 'DEX_B' as const,
    smartAmountOut: smartAmountOut.toString(),
    improvementBps: 500,
    coingeckoReferencePriceTokenInUSD: 1.00,
    coingeckoReferencePriceTokenOutUSD: 1.00,
    priceCheckStatus: 'OK' as const,
    routerCalldata: {
      to: CONFIG.routerAddress,
      data: '0x',
      value: '0'
    }
  };
}

/**
 * POST /quote
 * Get best quote for token swap with venue comparison
 */
router.post(
  '/',
  validateRequest(quoteRequestSchema),
  asyncHandler(async (req: Request, res: Response) => {
    console.log('=== ROUTE HANDLER REACHED ===');
    console.log('CONFIG.routerAddress:', CONFIG.routerAddress);
    console.log('isMockMode():', isMockMode());

    const validatedBody = req.body as ValidatedQuoteRequest;

    // ALWAYS return mock data for now
    console.log('🎭 Returning mock data');
    const mockResult = generateMockQuote(validatedBody);
    return res.json({ success: true, data: mockResult });

    // const result = await getQuote(validatedBody);
    // return res.json({ success: true, data: result });
  })
);

export default router;
