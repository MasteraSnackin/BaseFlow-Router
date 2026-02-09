# 🎬 Base DeFi Router - Demo Script

## Pre-Demo Setup Checklist

✅ **Environment Ready**
- [ ] Backend running on `http://localhost:4000`
- [ ] Frontend running on `http://localhost:5173`
- [ ] Contracts deployed to Base Sepolia
- [ ] `.env` configured with contract addresses
- [ ] MetaMask connected to Base Sepolia
- [ ] Test tokens available in wallet

✅ **Browser Prep**
- [ ] Clear browser cache
- [ ] Open `http://localhost:5173` in fresh tab
- [ ] MetaMask extension visible
- [ ] Console open (F12) for transparency

---

## Demo Flow (5 minutes)

### Part 1: The Problem (30 seconds)

**Script**:
> "DeFi traders on Base face a common problem: liquidity is fragmented across multiple DEXs. To get the best price, you need to manually check Uniswap, Aerodrome, BaseSwap, and others. This is time-consuming and you often miss better rates."

**Visual**: Show screenshot of multiple DEX interfaces

---

### Part 2: Our Solution (30 seconds)

**Script**:
> "Base DeFi Router solves this by aggregating quotes from all venues automatically. We find the best rate, show you the improvement, and execute the swap with one click. Let me show you how it works."

**Visual**: Show app homepage at `http://localhost:5173`

---

### Part 3: Live Demo (3 minutes)

#### Step 1: Connect Wallet (15 seconds)

**Action**:
1. Click "🔌 Connect Wallet" button
2. MetaMask popup appears
3. Select account
4. Approve connection

**Script**:
> "First, I'll connect my MetaMask wallet. The app requests permission..."

**Expected Result**: Button shows "✓ Wallet: 0x1234...5678"

---

#### Step 2: Select Tokens (15 seconds)

**Action**:
1. Select "Token IN (TIN)" from first dropdown
2. Select "Token OUT (TOUT)" from second dropdown
3. Enter amount: `100`

**Script**:
> "I want to swap 100 Token IN for Token OUT. Let me enter that amount..."

**Expected Result**: Form shows TIN → TOUT with amount 100

---

#### Step 3: Get Quote (30 seconds)

**Action**:
1. Click "Get Quote" button
2. Loading state shows "Getting quote..."
3. Quote result appears below

**Script**:
> "Now I'll request quotes from all venues. The router checks VenueA and VenueB simultaneously..."

**Expected Result**: Quote box appears showing:
```
Quote Result
┌─────────────────────────────┐
│ Baseline Route (DEX_A)      │
│ Amount out: 100...000 wei   │
├─────────────────────────────┤
│ Smart Route (DEX_B) 🎯      │
│ Amount out: 105...000 wei   │
│ Improvement: 500 bps (5%)   │
│ Absolute improvement: 5...  │
└─────────────────────────────┘
```

**Highlight**:
> "Notice VenueB gives us 105 tokens versus VenueA's 100 tokens. That's a 5% improvement – automatically detected!"

---

#### Step 4: Review Details (20 seconds)

**Action**: Point to different parts of the quote result

**Script**:
> "The app shows us:
> - Baseline route (what most people would get)
> - Smart route (our optimized path)
> - Improvement in basis points – 500 bps means 5%
> - CoinGecko prices for validation"

**Expected Result**: Audience sees transparency in pricing

---

#### Step 5: Execute Trade (40 seconds)

**Action**:
1. Click "🚀 Execute Trade on Best Route"
2. MetaMask popup appears with transaction
3. Review gas estimate
4. Click "Confirm"
5. Transaction submitted

**Script**:
> "Now I'll execute the trade. The router automatically uses VenueB since it has the better rate. MetaMask shows the transaction details... I'll confirm..."

**Expected Result**: 
- MetaMask shows transaction to Router contract
- Transaction includes swap calldata
- After confirmation: "Transaction Submitted!" box appears

---

#### Step 6: Verify on Chain (30 seconds)

**Action**:
1. Click "View on BaseScan →" link
2. BaseScan opens in new tab
3. Show transaction details

**Script**:
> "The transaction is now on Base Sepolia. We can see the swap executed through VenueB, and the user received 105 tokens instead of 100. That's the power of smart routing."

**Expected Result**: BaseScan shows:
- Transaction hash
- Status: Success ✓
- Contract interaction with Router
- Token transfers

---

### Part 4: Why It Matters (1 minute)

**Script**:
> "This demo used simple stub venues, but the same architecture works with real DEXs on Base:
>
> - **Uniswap V3**: Deep liquidity, concentrated positions
> - **Aerodrome**: Optimized for stable pairs
> - **BaseSwap**: Native Base DEX
>
> By aggregating all of them, traders automatically get the best execution. On a $10,000 swap, that 5% improvement is $500 in savings.
>
> And this is just the beginning. We can add:
> - Multi-hop routing for even better prices
> - MEV protection
> - AI agents for autonomous trading
> - Cross-chain aggregation
>
> The router becomes your always-on trading assistant, finding value you'd miss manually."

---

## Troubleshooting During Demo

### Issue: "Could not connect wallet"
**Fix**: 
- Check MetaMask is installed
- Switch network to Base Sepolia
- Refresh page

### Issue: Quote returns error
**Fix**:
- Verify backend is running (`http://localhost:4000/health`)
- Check `.env` has ROUTER_ADDRESS
- Ensure RPC is responding

### Issue: Transaction fails
**Fix**:
- Check wallet has testnet ETH for gas
- Verify token approvals
- Check slippage tolerance

---

## Post-Demo Q&A Prep

**Q: How does this compare to 1inch or Cowswap?**
A: "Great question! We're focused specifically on Base, which means we can optimize for Base-native DEXs and the L2's lower gas costs. Our backend can also integrate AI agents for autonomous strategies."

**Q: What about MEV?**
A: "Currently we execute on-chain like standard DEXs. Future versions will integrate private RPCs and MEV protection services available on Base."

**Q: Can this work with real money?**
A: "Yes! The contracts are production-ready. We're using test tokens for the demo, but the same code works with USDC, ETH, and any ERC20 on Base mainnet."

**Q: How do you make money?**
A: "We can add a small fee (e.g., 0.1%) on swaps, or partner with DEXs for affiliate fees. The value to users far exceeds any fee."

---

## Demo Success Metrics

✅ **Clear Value Prop**: Audience understands the problem & solution  
✅ **Working Demo**: All steps execute without errors  
✅ **Visible Improvement**: 5% better rate is obvious  
✅ **Technical Credibility**: On-chain transaction proves it works  
✅ **Future Vision**: AI agents and cross-chain resonate

---

## Backup Demo (If Live Demo Fails)

### Option 1: Screen Recording
Pre-record the demo flow and play video while narrating

### Option 2: Screenshots
Prepare annotated screenshots of each step

### Option 3: Code Walkthrough
Show the smart contract code and explain the logic:
```solidity
function getBestVenue(...)
  external view returns (uint8 bestVenue, uint256 amountOut)
{
  uint256 outA = IVenueA(venueA).getAmountOut(...);
  uint256 outB = IVenueB(venueB).getAmountOut(...);
  
  if (outA >= outB) {
    return (1, outA);  // VenueA is better
  } else {
    return (2, outB);  // VenueB is better
  }
}
```

---

**Remember**: Confidence and enthusiasm matter more than perfection! 🚀
