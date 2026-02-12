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

export type Venue = 'DEX_A' | 'DEX_B' | 'ROBINPUMP_FUN';

export interface PumpFunInfo {
  bondingProgress: number;
  currentPrice: string;
  hasGraduated: boolean;
  estimatedMarketCap: string;
}

export interface QuoteResponse {
  success: boolean;
  data?: {
    chainId: number;
    tokenIn: string;
    tokenOut: string;
    amountIn: string;
    baselineVenue: Venue;
    baselineAmountOut: string;
    smartVenue: Venue;
    smartAmountOut: string;
    improvementBps: number;
    coingeckoReferencePriceTokenInUSD: number;
    coingeckoReferencePriceTokenOutUSD: number;
    priceCheckStatus: 'OK' | 'DEVIATION_HIGH';
    routerCalldata: RouterCalldata;
    pumpFunInfo?: PumpFunInfo;
  };
  error?: {
    code: string;
    message: string;
  };
}

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:4000';

export async function getQuote(req: QuoteRequest): Promise<QuoteResponse> {
  const res = await fetch(`${API_BASE}/quote`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(req)
  });
  return res.json();
}

export interface VenueMetadata {
  id: string;
  name: string;
  description: string;
}

export interface Token {
  address: string;
  symbol: string;
  name: string;
  decimals: number;
}

export interface PlatformStats {
  totalRequests: number;
  successfulQuotes: number;
  failedQuotes: number;
  totalVolumeUSD: number;
}

export async function getVenues(): Promise<{ success: boolean; data: VenueMetadata[] }> {
  const res = await fetch(`${API_BASE}/venues`);
  return res.json();
}

export async function getTokens(): Promise<{ success: boolean; data: Token[] }> {
  const res = await fetch(`${API_BASE}/tokens`);
  return res.json();
}

export async function getStats(): Promise<{ success: boolean; data: PlatformStats }> {
  const res = await fetch(`${API_BASE}/stats`);
  return res.json();
}
