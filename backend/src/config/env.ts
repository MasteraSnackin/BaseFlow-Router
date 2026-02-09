import 'dotenv/config';

export const CONFIG = {
  rpcUrl: process.env.BASE_SEPOLIA_RPC_URL || 'https://sepolia.base.org',
  routerAddress: process.env.ROUTER_ADDRESS || '',
  port: process.env.PORT || 4000
};
