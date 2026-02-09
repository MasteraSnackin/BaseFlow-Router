# ⚡ Base DeFi Router

> **Smart DEX aggregator that automatically finds the best swap routes on Base network**

Maximize your trade value by comparing multiple DEX venues in real-time and executing swaps through the optimal route – all with one click.

---

## 🎯 The Problem

DeFi traders on Base lose value due to:
- **Fragmented liquidity** across multiple DEXs
- **Manual price comparison** is time-consuming
- **No visibility** into which venue offers the best rate
- **Missed opportunities** for better execution

## 💡 Our Solution

**Base DeFi Router** is a smart aggregator that:
1. Queries multiple DEX venues simultaneously
2. Compares quotes in real-time
3. Automatically selects the best route
4. Executes swaps with one click
5. Shows you exactly how much you saved

## 🏗️ Architecture

```
┌─────────────┐
│   Frontend  │  React + MetaMask
│   (Vite)    │  User interface
└──────┬──────┘
       │
       ↓ HTTP
┌─────────────┐
│   Backend   │  Node.js + Express
│   (API)     │  Quote aggregation
└──────┬──────┘
       │
       ↓ RPC
┌─────────────┐
│   Router    │  Solidity smart contract
│  Contract   │  On Base Sepolia
└──────┬──────┘
       │
   ┌───┴───┐
   ↓       ↓
┌──────┐ ┌──────┐
│Venue │ │Venue │  DEX integrations
│  A   │ │  B   │  (stubs for demo)
└──────┘ └──────┘
```

### Smart Contract Layer
- **Router.sol**: Compares venues and executes optimal swaps
- **VenueA/B Stubs**: Simulated DEX interfaces for testing
- **TokenMock**: ERC20 test tokens

### Backend API
- **Quote Service**: Aggregates on-chain quotes
- **CoinGecko Integration**: Price validation
- **Calldata Generation**: Ready-to-execute transactions

### Frontend
- **React UI**: Clean, simple interface
- **MetaMask**: Wallet integration
- **Real-time Quotes**: See improvements instantly

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- MetaMask wallet
- Base Sepolia testnet ETH ([get from faucet](https://www.coinbase.com/faucets/base-ethereum-sepolia-faucet))

### Setup

1. **Clone and install**:
   ```bash
   cd base-defi-router
   npm install
   cd backend && npm install
   cd ../frontend && npm install
   cd ..
   ```

2. **Configure environment** (`.env`):
   ```bash
   # Base Sepolia RPC
   BASE_SEPOLIA_RPC_URL=https://sepolia.base.org

   # Your wallet private key (for deployment)
   PRIVATE_KEY=your_private_key_here

   # Contract addresses (fill after deployment)
   ROUTER_ADDRESS=

   # Backend port
   PORT=4000
   ```

3. **Deploy contracts**:
   ```bash
   npx hardhat compile
   npx hardhat run scripts/deploy.js --network baseSepolia
   ```

   Copy the deployed addresses to `.env`

4. **Start backend** (Terminal 1):
   ```bash
   cd backend
   npm run dev
   ```

5. **Start frontend** (Terminal 2):
   ```bash
   cd frontend
   npm run dev
   ```

6. **Open app**: Navigate to `http://localhost:5173`

## 📱 How to Use

1. **Connect Wallet**: Click "Connect Wallet" and approve in MetaMask
2. **Select Tokens**: Choose Token IN and Token OUT from dropdowns
3. **Enter Amount**: Input the amount you want to swap
4. **Get Quote**: Click to fetch quotes from all venues
5. **Review**: See baseline vs smart route comparison
6. **Execute**: Click "Execute Trade" to swap through best route
7. **Confirm**: Approve transaction in MetaMask
8. **Done**: View transaction on [BaseScan](https://sepolia.basescan.org)

## 🎨 Demo Flow

For a complete demo script, see [DEMO.md](DEMO.md)

## 📊 Key Features

- ✅ **Automatic Best Route**: No manual comparison needed
- ✅ **Real-time Quotes**: Always current prices
- ✅ **Transparent Improvement**: See exact savings in bps
- ✅ **One-Click Execution**: Swap through best venue instantly
- ✅ **Price Validation**: CoinGecko reference prices
- ✅ **Slippage Protection**: Built-in (1% default)

## 🧪 Technology Stack

### Smart Contracts
- Solidity 0.8.24
- Hardhat
- OpenZeppelin patterns

### Backend
- Node.js + Express
- TypeScript
- Ethers.js v6
- CoinGecko API

### Frontend
- React 19
- TypeScript
- Vite
- MetaMask (Web3)

### Network
- Base Sepolia (testnet)
- Production-ready for Base Mainnet

## 📈 Future Roadmap

### Phase 1: More DEXs
- Integrate real Base DEXs (Uniswap V3, Aerodrome, BaseSwap)
- Multi-hop routing for better prices

### Phase 2: Advanced Features
- MEV protection via private RPCs
- Limit orders
- Gas optimization

### Phase 3: AI Agent Integration
- Autonomous trading strategies
- Portfolio rebalancing
- Yield optimization

### Phase 4: Cross-Chain
- Bridge aggregation
- Multi-chain routing

## 🔒 Security Notes

- All contracts use standard ERC20 interfaces
- Slippage protection on all swaps
- No custody of user funds
- Open source and auditable

## 📄 Project Structure

```
base-defi-router/
├── contracts/          # Solidity smart contracts
│   ├── Router.sol      # Main routing logic
│   ├── VenueAStub.sol  # DEX stub A
│   ├── VenueBStub.sol  # DEX stub B
│   ├── TokenMock.sol   # Test ERC20
│   └── IERC20.sol      # Interface
├── backend/            # Node.js API
│   └── src/
│       ├── config/     # Environment config
│       ├── services/   # Quote & CoinGecko services
│       ├── routes/     # Express routes
│       └── abi/        # Contract ABIs
├── frontend/           # React UI
│   └── src/
│       ├── components/ # React components
│       ├── lib/        # API & wallet helpers
│       └── App.tsx     # Main app
├── scripts/            # Deployment scripts
├── docs/              # Documentation
└── .env               # Configuration
```

## 🤝 Contributing

This is a hackathon project. Contributions welcome!

## 📜 License

ISC

## 🙏 Acknowledgments

- Built for Base hackathon
- Powered by Claude Sonnet 4.5
- CoinGecko API for price data

---

**Built with ❤️ on Base**
