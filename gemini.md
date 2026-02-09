# Base DeFi Router - Project Map

## 🎯 Project Overview
A decentralized exchange aggregator and routing system for Base network that finds the best swap routes across multiple DEXs.

## ✅ Phase 0 - Setup Complete

### Directory Structure
```
base-defi-router/
├── contracts/              # Smart contracts (Hardhat + Solidity)
│   ├── Router.sol         # Main routing contract
│   ├── IERC20.sol         # ERC20 interface
│   ├── TokenMock.sol      # Mock ERC20 for testing
│   ├── VenueAStub.sol     # DEX stub A (1:1 rate)
│   └── VenueBStub.sol     # DEX stub B (1:1.05 rate)
├── scripts/               # Deployment scripts
│   └── deploy.js          # Deploy all contracts to Base Sepolia
├── backend/               # TypeScript backend API
│   └── src/
│       ├── routes/        # API route handlers
│       ├── services/      # Business logic
│       ├── config/        # Configuration
│       ├── abi/          # Contract ABIs
│       └── index.ts      # Express server entry
├── frontend/             # React + TypeScript (Vite)
│   └── src/             # Vite React app
├── docs/                # Documentation
├── BLAST.md            # BLAST protocol docs
├── Agents.md           # AI agents documentation
└── gemini.md           # This file - project map
```

### Installed Dependencies

**Root (Hardhat)**
- hardhat ^2.28.0
- @nomicfoundation/hardhat-toolbox ^6.1.0
- dotenv ^17.2.4

**Backend**
- express ^5.2.1
- ethers ^6.16.0
- axios ^1.13.5
- dotenv ^17.2.4
- typescript ^5.9.3
- ts-node ^10.9.2
- @types/node, @types/express

**Frontend**
- React 19 + TypeScript
- Vite ^6.0.11
- Standard React development tools

### Configuration Files

**Hardhat** ([hardhat.config.js](hardhat.config.js))
- Configured for Solidity 0.8.28
- Base Sepolia network setup (RPC, Chain ID 84532)
- Ready for deployment with private key

**Environment** ([.env](.env))
- Base Sepolia RPC URL
- Private key placeholder
- Router contract address placeholder
- Backend port configuration

**TypeScript** (backend/tsconfig.json)
- TypeScript compiler configured
- ES modules support

### Available Scripts

**Root**
```bash
npm run compile     # Compile smart contracts
npm test           # Run Hardhat tests
npm run backend    # Start backend dev server
npm run frontend   # Start frontend dev server
```

**Backend** (cd backend/)
```bash
npm run dev        # Run development server with ts-node
npm run build      # Compile TypeScript
npm start         # Run compiled JavaScript
```

**Frontend** (cd frontend/)
```bash
npm run dev        # Start Vite dev server
npm run build     # Build for production
npm run preview   # Preview production build
```

## ✅ Phase 1 - Smart Contracts Complete

### Contract Architecture

**Router.sol** - Main routing contract:
- `getBestVenue()` - Compares quotes from both venues
- `swapBestRoute()` - Executes swap on venue with better rate
- `getQuoteVenueA/B()` - Get individual venue quotes
- Automatic best price selection
- Slippage protection

**VenueAStub.sol & VenueBStub.sol** - DEX simulators:
- Constant-price AMM stubs
- Configurable exchange rates
- `getAmountOut()` - Calculate swap output
- `swapExactTokensForTokens()` - Execute swaps
- VenueA: 1:1 rate, VenueB: 1:1.05 rate (5% better)

**TokenMock.sol** - ERC20 test tokens:
- Full ERC20 implementation
- Mint initial supply to deployer
- Transfer, approve, transferFrom

**IERC20.sol** - Standard ERC20 interface

### Deployment Script

**scripts/deploy.js**:
1. Deploys TokenIn and TokenOut (1M each)
2. Deploys VenueA (1:1 rate) and VenueB (1.05:1 rate)
3. Funds venues with 500k TokenOut each
4. Deploys Router pointing to both venues
5. Outputs all contract addresses

### Testing Strategy

Router automatically selects VenueB for better rates:
- Input: 100 TIN → VenueA output: 100 TOUT
- Input: 100 TIN → VenueB output: 105 TOUT
- Router chooses VenueB (5% more output)

## ✅ Phase 2 - Backend Quote Service Complete

### Backend API Architecture

**Configuration** ([backend/src/config/](base-defi-router/backend/src/config/)):
- `env.ts` - Environment variables (RPC URL, Router address, port)
- `tokens.ts` - Token address → CoinGecko ID mapping

**Services** ([backend/src/services/](base-defi-router/backend/src/services/)):
- `router.ts` - Main quote service that queries Router contract
  - `getQuote()` - Fetches quotes from both venues, selects best
  - `applySlippage()` - Calculates slippage-protected min output
  - Returns calldata for executing swap
- `coingecko.ts` - Price validation via CoinGecko API
  - Fetches USD prices for token pairs
  - Used for price deviation checks

**Routes** ([backend/src/routes/](base-defi-router/backend/src/routes/)):
- `quote.ts` - POST /quote endpoint
  - Accepts: chainId, tokenIn, tokenOut, amountIn, slippageBps
  - Returns: baseline vs smart quote comparison, improvement %, calldata

**Entry Point** ([backend/src/index.ts](base-defi-router/backend/src/index.ts)):
- Express server on port 4000 (configurable)
- CORS enabled for frontend
- Health check at GET /health
- Quote endpoint at POST /quote

### API Response Format

```json
{
  "success": true,
  "data": {
    "chainId": 84532,
    "tokenIn": "0x...",
    "tokenOut": "0x...",
    "amountIn": "1000000000000000000",
    "baselineVenue": "DEX_A",
    "baselineAmountOut": "1000000000000000000",
    "smartVenue": "DEX_B",
    "smartAmountOut": "1050000000000000000",
    "improvementBps": 500,
    "coingeckoReferencePriceTokenInUSD": 3000,
    "coingeckoReferencePriceTokenOutUSD": 1,
    "priceCheckStatus": "OK",
    "routerCalldata": {
      "to": "0xRouterAddress",
      "data": "0x...",
      "value": "0"
    }
  }
}
```

### Testing Backend

```bash
cd backend
npm run dev

# Test with curl
curl -X POST http://localhost:4000/quote \
  -H "Content-Type: application/json" \
  -d '{
    "chainId": 84532,
    "tokenIn": "0xTokenInAddress",
    "tokenOut": "0xTokenOutAddress",
    "amountIn": "1000000000000000000",
    "slippageBps": 100
  }'
```

## ✅ Phase 3 - Frontend UI Complete

### React Components

**[frontend/src/lib/api.ts](base-defi-router/frontend/src/lib/api.ts)** - API client:
- TypeScript interfaces for requests/responses
- `getQuote()` - Fetches quote from backend
- API base URL: `http://localhost:4000`

**[frontend/src/lib/wallet.ts](base-defi-router/frontend/src/lib/wallet.ts)** - MetaMask integration:
- `connectWallet()` - Connect to user's wallet
- `sendRouterTx()` - Execute swap transaction

**[frontend/src/components/TradeForm.tsx](base-defi-router/frontend/src/components/TradeForm.tsx)** - Trade input form:
- Token selector dropdowns
- Amount input
- Get Quote button
- Placeholder addresses (update after deployment)

**[frontend/src/components/QuoteResult.tsx](base-defi-router/frontend/src/components/QuoteResult.tsx)** - Quote display:
- Baseline vs Smart route comparison
- Improvement calculation in bps & percentage
- CoinGecko price reference
- Transaction hash with BaseScan link

**[frontend/src/App.tsx](base-defi-router/frontend/src/App.tsx)** - Main application:
- Wallet connection state
- Quote fetching logic
- Transaction execution
- Error handling
- Clean UI with inline styling

### User Flow

1. **Connect Wallet** → MetaMask popup
2. **Select Tokens** → TIN & TOUT from dropdowns
3. **Enter Amount** → Whole token amount (converted to wei)
4. **Get Quote** → Backend fetches best route
5. **View Result** → See improvement over baseline
6. **Execute Trade** → Send transaction via MetaMask
7. **View TX** → Click link to BaseScan

### Running the Full Stack

**Terminal 1 - Backend**:
```bash
cd backend
npm run dev
# Listening on http://localhost:4000
```

**Terminal 2 - Frontend**:
```bash
cd frontend
npm run dev
# Running on http://localhost:5173
```

**Terminal 3 - Hardhat (optional)**:
```bash
# Deploy contracts when ready
npx hardhat run scripts/deploy.js --network baseSepolia
```

## 🔜 Next Steps (Phase 4 - Deployment)

### 1. Deploy to Base Sepolia
- [ ] Add Base Sepolia to MetaMask
  - Network Name: Base Sepolia
  - RPC URL: https://sepolia.base.org
  - Chain ID: 84532
  - Currency: ETH
  - Explorer: https://sepolia.basescan.org
- [ ] Get testnet ETH from [Base Sepolia Faucet](https://www.coinbase.com/faucets/base-ethereum-sepolia-faucet)
- [ ] Add private key to .env file
- [ ] Run: `npx hardhat run scripts/deploy.js --network baseSepolia`
- [ ] Save contract addresses to .env

### 2. Test Deployed Contracts
- [ ] Interact with Router on Base Sepolia
- [ ] Test quote fetching from both venues
- [ ] Execute test swaps
- [ ] Verify Router picks best venue
- [ ] Test slippage protection

### 3. Backend API Development
- [ ] Create routing service (src/services/routing.ts)
- [ ] Implement DEX price fetching
- [ ] Add route optimization algorithm
- [ ] Create swap execution endpoints
- [ ] Add error handling and logging

### 4. Frontend UI
- [ ] Set up Web3 wallet connection (ethers.js)
- [ ] Create swap interface components
- [ ] Implement token selection
- [ ] Add price impact display
- [ ] Show route visualization
- [ ] Add transaction history

### 5. Testing & Deployment
- [ ] End-to-end testing on Base Sepolia
- [ ] Gas optimization
- [ ] Security audit considerations
- [ ] Mainnet deployment preparation

## 📚 Resources

- [Base Documentation](https://docs.base.org)
- [Hardhat Docs](https://hardhat.org)
- [Ethers.js v6](https://docs.ethers.org/v6/)
- [Vite Documentation](https://vitejs.dev)
- [Base Sepolia Explorer](https://sepolia.basescan.org)

## 🚀 Quick Start

1. **Configure environment**:
   ```bash
   # Edit .env with your private key
   PRIVATE_KEY=your_private_key_here
   ```

2. **Compile contracts**:
   ```bash
   npm run compile
   ```

3. **Start backend** (terminal 1):
   ```bash
   npm run backend
   ```

4. **Start frontend** (terminal 2):
   ```bash
   npm run frontend
   ```

5. **Deploy contract** (when ready):
   ```bash
   npx hardhat run scripts/deploy.js --network baseSepolia
   ```

## 📝 Notes

- Project uses TypeScript throughout for type safety
- Configured for Base Sepolia testnet (safe for testing)
- .env file gitignored to protect private keys
- All dependencies installed and ready
- Example contract provided as starting point
