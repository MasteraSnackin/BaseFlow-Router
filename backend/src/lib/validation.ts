import { z } from 'zod';
import { isAddress } from 'ethers';

/**
 * Custom Zod validator for Ethereum addresses
 */
const ethereumAddress = z.string().refine(
  (addr) => isAddress(addr),
  { message: 'Invalid Ethereum address' }
);

/**
 * Quote request validation schema
 */
export const quoteRequestSchema = z.object({
  chainId: z.number()
    .int()
    .positive()
    .refine((id) => id === 84532 || id === 8453, {
      message: 'Only Base Sepolia (84532) and Base Mainnet (8453) are supported'
    }),

  tokenIn: ethereumAddress,

  tokenOut: ethereumAddress,

  amountIn: z.string()
    .regex(/^\d+$/, 'amountIn must be a numeric string (wei)')
    .refine((val) => BigInt(val) > 0n, {
      message: 'amountIn must be greater than 0'
    })
    .refine((val) => BigInt(val) < BigInt('1000000000000000000000000'), {
      message: 'amountIn exceeds maximum allowed value'
    }),

  slippageBps: z.number()
    .int()
    .min(0, 'slippageBps must be at least 0')
    .max(10000, 'slippageBps must not exceed 10000 (100%)')
}).refine((data) => data.tokenIn.toLowerCase() !== data.tokenOut.toLowerCase(), {
  message: 'tokenIn and tokenOut must be different',
  path: ['tokenOut']
});

export type ValidatedQuoteRequest = z.infer<typeof quoteRequestSchema>;

/**
 * Batch quote request schema
 */
export const batchQuoteRequestSchema = z.object({
  quotes: z.array(quoteRequestSchema)
    .min(1, 'At least one quote request is required')
    .max(10, 'Maximum 10 quote requests per batch')
});

export type ValidatedBatchQuoteRequest = z.infer<typeof batchQuoteRequestSchema>;
