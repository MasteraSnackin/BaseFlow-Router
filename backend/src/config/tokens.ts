export function mapAddressesToGeckoIds(tokenIn: string, tokenOut: string): {
  coingeckoIdIn: string;
  coingeckoIdOut: string;
} {
  // TODO: replace with real mappings after deployment
  // For now, just hard-code example IDs
  const addressToId: Record<string, string> = {
    // '0xTokenInAddressOnBaseSepolia': 'ethereum',
    // '0xTokenOutAddressOnBaseSepolia': 'usd-coin'
  };

  const coingeckoIdIn = addressToId[tokenIn.toLowerCase()] || 'ethereum';
  const coingeckoIdOut = addressToId[tokenOut.toLowerCase()] || 'usd-coin';

  return { coingeckoIdIn, coingeckoIdOut };
}
