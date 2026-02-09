import { type BigNumberish, Contract, Interface } from 'ethers';
import { getCoinGeckoPrices } from './coingecko.js';
import { CONFIG } from '../config/env.js';
import { EnhancedProvider } from '../lib/provider.js';
import { ContractError, ConfigurationError } from '../lib/errors.js';
import RouterAbi from '../abi/Router.json' with { type: 'json' };

export type Venue = 'DEX_A' | 'DEX_B';

export interface QuoteRequest {
  chainId: number;
  tokenIn: string;
  tokenOut: string;
  amountIn: string;      // wei
  slippageBps: number;
}

export interface RouterCalldata {
  to: string;
  data: string;
  value: string;
}

export interface QuoteResponseData {
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
}

// Singleton provider instance
let providerInstance: EnhancedProvider | null = null;

function getProvider(): EnhancedProvider {
  if (!CONFIG.routerAddress) {
    throw new ConfigurationError('ROUTER_ADDRESS not configured in environment');
  }
  if (!providerInstance) {
    providerInstance = new EnhancedProvider(CONFIG.rpcUrl);
  }
  return providerInstance;
}

export async function getQuote(
  req: QuoteRequest
): Promise<QuoteResponseData> {
  const { chainId, tokenIn, tokenOut, amountIn, slippageBps } = req;

  const enhancedProvider = getProvider();
  const provider = enhancedProvider.getProvider();
  const router = new Contract(CONFIG.routerAddress, RouterAbi, provider);

  try {
    // 1. Parallel on-chain quotes for better performance
    const [[bestVenueRaw, bestAmountOutRaw], baselineAmountOutRaw] = await Promise.all([
      router.getBestVenue!(tokenIn, tokenOut, amountIn) as Promise<[BigNumberish, BigNumberish]>,
      router.getQuoteVenueA!(tokenIn, tokenOut, amountIn) as Promise<BigNumberish>
    ]);

    const bestVenueNumber = Number(bestVenueRaw);
    const smartVenue: Venue = bestVenueNumber === 1 ? 'DEX_A' : 'DEX_B';

    const smartAmountOut = BigInt(bestAmountOutRaw.toString());
    const baselineAmountOut = BigInt(baselineAmountOutRaw.toString());

    // Validate amounts
    if (smartAmountOut === 0n || baselineAmountOut === 0n) {
      throw new ContractError('Quote returned zero amount - insufficient liquidity or invalid token pair');
    }

    const improvementBps =
      baselineAmountOut === 0n
        ? 0
        : Number((smartAmountOut - baselineAmountOut) * 10000n / baselineAmountOut);

    // 2. CoinGecko prices (parallel with on-chain calls would be ideal, but kept separate for clarity)
    const {
      priceTokenInUSD,
      priceTokenOutUSD
    } = await getCoinGeckoPrices(tokenIn, tokenOut);

    // 3. Price deviation check
    const priceCheckStatus = checkPriceDeviation(
      smartAmountOut,
      BigInt(amountIn),
      priceTokenInUSD,
      priceTokenOutUSD
    );

    // 4. Build router calldata
    const iface = new Interface(RouterAbi);
    const amountOutMin = applySlippage(smartAmountOut, slippageBps);

    const data = iface.encodeFunctionData('swapBestRoute', [
      tokenIn,
      tokenOut,
      amountIn,
      amountOutMin.toString()
    ]);

    const routerCalldata: RouterCalldata = {
      to: CONFIG.routerAddress,
      data,
      value: '0'
    };

    return {
      chainId,
      tokenIn,
      tokenOut,
      amountIn,
      baselineVenue: 'DEX_A',
      baselineAmountOut: baselineAmountOut.toString(),
      smartVenue,
      smartAmountOut: smartAmountOut.toString(),
      improvementBps,
      coingeckoReferencePriceTokenInUSD: priceTokenInUSD,
      coingeckoReferencePriceTokenOutUSD: priceTokenOutUSD,
      priceCheckStatus,
      routerCalldata
    };
  } catch (error: any) {
    // Wrap contract errors with more context
    if (error.code === 'CALL_EXCEPTION') {
      throw new ContractError(
        `Contract call failed: ${error.message}`,
        {
          method: error.method,
          data: error.data,
          transaction: error.transaction
        }
      );
    }
    throw error;
  }
}

function applySlippage(
  amountOut: bigint,
  slippageBps: number
): bigint {
  const base = 10000n;
  const bps = BigInt(slippageBps);
  return amountOut * (base - bps) / base;
}

/**
 * Check price deviation between on-chain quote and CoinGecko reference
 * @returns 'OK' if within acceptable range, 'DEVIATION_HIGH' if exceeds threshold
 */
function checkPriceDeviation(
  amountOut: bigint,
  amountIn: bigint,
  priceTokenInUSD: number,
  priceTokenOutUSD: number
): 'OK' | 'DEVIATION_HIGH' {
  // Skip check if prices are not available
  if (priceTokenInUSD === 0 || priceTokenOutUSD === 0) {
    return 'OK';
  }

  // Calculate implied exchange rate from on-chain quote
  // Assuming 18 decimals for simplicity (should be token-specific in production)
  const onChainRate = Number(amountOut) / Number(amountIn);

  // Calculate expected rate from CoinGecko prices
  const expectedRate = priceTokenInUSD / priceTokenOutUSD;

  // Calculate deviation percentage
  const deviation = Math.abs((onChainRate - expectedRate) / expectedRate);

  // Flag if deviation exceeds 5%
  const DEVIATION_THRESHOLD = 0.05;
  return deviation > DEVIATION_THRESHOLD ? 'DEVIATION_HIGH' : 'OK';
}
