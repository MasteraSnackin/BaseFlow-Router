import axios from 'axios';
import { mapAddressesToGeckoIds } from '../config/tokens.js';

export async function getCoinGeckoPrices(
  tokenIn: string,
  tokenOut: string
): Promise<{
  priceTokenInUSD: number;
  priceTokenOutUSD: number;
}> {
  const { coingeckoIdIn, coingeckoIdOut } = mapAddressesToGeckoIds(
    tokenIn,
    tokenOut
  );

  const ids = `${coingeckoIdIn},${coingeckoIdOut}`;

  const res = await axios.get(
    'https://api.coingecko.com/api/v3/simple/price',
    {
      params: {
        ids,
        vs_currencies: 'usd'
      }
    }
  );

  const priceTokenInUSD = res.data[coingeckoIdIn]?.usd ?? 0;
  const priceTokenOutUSD = res.data[coingeckoIdOut]?.usd ?? 0;

  return { priceTokenInUSD, priceTokenOutUSD };
}
