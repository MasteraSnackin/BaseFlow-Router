import 'dotenv/config';

export const CONFIG = {
  rpcUrl: process.env.BASE_SEPOLIA_RPC_URL || 'https://sepolia.base.org',
  routerAddress: process.env.ROUTER_ADDRESS || '',
  port: process.env.PORT || 4000
};

// Log RPC status
if (CONFIG.rpcUrl.includes('sepolia.base.org')) {
  console.warn('⚠️  Using Public RPC Endpoint. Rate limits may apply. Upgrade to Alchemy/Ankr for production.');
} else {
  console.log('✅ Using Custom RPC Provider');
}
