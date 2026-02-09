export interface QuoteRequest {
  chainId: number;
  tokenIn: string;
  tokenOut: string;
  amountIn: string;
  slippageBps: number;
}

export interface RouterCalldata {
  to: string;
  data: string;
  value: string;
}

export interface QuoteResponse {
  success: boolean;
  data?: {
    chainId: number;
    tokenIn: string;
    tokenOut: string;
    amountIn: string;
    baselineVenue: 'DEX_A' | 'DEX_B';
    baselineAmountOut: string;
    smartVenue: 'DEX_A' | 'DEX_B';
    smartAmountOut: string;
    improvementBps: number;
    coingeckoReferencePriceTokenInUSD: number;
    coingeckoReferencePriceTokenOutUSD: number;
    priceCheckStatus: 'OK' | 'DEVIATION_HIGH';
    routerCalldata: RouterCalldata;
  };
  error?: {
    code: string;
    message: string;
  };
}

const API_BASE = 'http://localhost:4000';

export async function getQuote(req: QuoteRequest): Promise<QuoteResponse> {
  const res = await fetch(`${API_BASE}/quote`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(req)
  });

  return res.json();
}
