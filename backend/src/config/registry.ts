
export interface Token {
    chainId: number;
    address: string;
    symbol: string;
    name: string;
    decimals: number;
    logoURI?: string;
    coingeckoId: string;
}

export interface Venue {
    id: string;
    name: string;
    description: string;
    logoURI?: string;
}

// Base Sepolia Testnet Tokens (Placeholders)
export const SUPPORTED_TOKENS: Token[] = [
    {
        chainId: 84532,
        address: '0x4200000000000000000000000000000000000006', // WETH (Mock)
        symbol: 'WETH',
        name: 'Wrapped Ether',
        decimals: 18,
        coingeckoId: 'ethereum'
    },
    {
        chainId: 84532,
        address: '0x036CbD53842c5426634e7929541eC2318f3dCF7e', // USDC (Mock)
        symbol: 'USDC',
        name: 'USD Coin',
        decimals: 6,
        coingeckoId: 'usd-coin'
    },
    {
        chainId: 84532,
        address: '0x2e9da5093A4066Fc7046D32490c00010041C6187', // LINK (Mock)
        symbol: 'LINK',
        name: 'Chainlink',
        decimals: 18,
        coingeckoId: 'chainlink'
    }
];

export const SUPPORTED_VENUES: Venue[] = [
    {
        id: 'DEX_A',
        name: 'Uniswap V2 (Mock)',
        description: 'Constant product AMM',
    },
    {
        id: 'DEX_B',
        name: 'SushiSwap (Mock)',
        description: 'Optimized pools',
    }
];

export function getTokenByAddress(address: string): Token | undefined {
    return SUPPORTED_TOKENS.find(t => t.address.toLowerCase() === address.toLowerCase());
}

export function getVenueById(id: string): Venue | undefined {
    return SUPPORTED_VENUES.find(v => v.id === id);
}
