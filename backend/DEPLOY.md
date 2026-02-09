# Railway Deployment Guide

This guide walks you through deploying the Base DeFi Router backend to Railway.

## Prerequisites

✅ Backend builds successfully (`npm run build`)
⏳ Router smart contract deployed (or deploy after)
⏳ RPC provider account (Alchemy/Ankr recommended)
✅ GitHub account
✅ Railway account (free to create)

---

## Step 1: Prepare Your Repository

### 1.1 Commit All Changes
```bash
cd backend
git add .
git commit -m "Add Railway deployment configuration"
git push origin main
```

### 1.2 Files Created for Deployment
- ✅ `railway.toml` - Railway configuration
- ✅ `Dockerfile` - Multi-stage Docker build
- ✅ `.dockerignore` - Exclude unnecessary files
- ✅ `.env.example` - Environment variable template

---

## Step 2: Sign Up for RPC Provider (Recommended)

### Option A: Alchemy (Recommended for Base)
1. Go to [alchemy.com](https://www.alchemy.com/)
2. Sign up for free account
3. Create a new app:
   - Chain: Base Sepolia
   - Network: Testnet
4. Copy your API endpoint:
   ```
   https://base-sepolia.g.alchemy.com/v2/YOUR_API_KEY
   ```

### Option B: Ankr (Multi-chain)
1. Go to [ankr.com](https://www.ankr.com/)
2. Sign up for free account
3. Get Base Sepolia endpoint:
   ```
   https://rpc.ankr.com/base_sepolia/YOUR_API_KEY
   ```

**Benefits:**
- ✅ 300M+ requests/month (free tier)
- ✅ No rate limiting
- ✅ Guaranteed uptime
- ✅ Lower latency

---

## Step 3: Deploy to Railway

### 3.1 Sign Up for Railway
1. Go to [railway.app](https://railway.app)
2. Click "Start a New Project"
3. Sign in with GitHub

### 3.2 Create New Project
1. Click "Deploy from GitHub repo"
2. Select your repository
3. Select the `backend` directory (if monorepo)
4. Railway will auto-detect Node.js project

### 3.3 Configure Environment Variables

In the Railway dashboard, go to **Variables** and add:

**Required:**
```bash
BASE_SEPOLIA_RPC_URL=https://base-sepolia.g.alchemy.com/v2/YOUR_KEY
ROUTER_ADDRESS=  # Leave empty for now, add after contract deployment
NODE_ENV=production
PORT=4000  # Railway will override this dynamically
```

**Optional:**
```bash
COINGECKO_API_KEY=  # For higher rate limits
```

### 3.4 Deploy
1. Click "Deploy"
2. Railway will:
   - Clone your repository
   - Run `npm install && npm run build`
   - Start the server with `npm start`
   - Auto-generate a public URL

### 3.5 Get Your Production URL
After deployment completes:
```
https://your-app-name.railway.app
```

---

## Step 4: Verify Deployment

### 4.1 Test Health Endpoint
```bash
curl https://your-app-name.railway.app/health
```

**Expected Response:**
```json
{
  "ok": true,
  "message": "DeFi Router API is running",
  "config": {
    "routerConfigured": false,  // Will be true after adding ROUTER_ADDRESS
    "chainId": 84532,
    "network": "Base Sepolia"
  }
}
```

### 4.2 Check Logs
In Railway dashboard:
1. Go to **Deployments**
2. Click latest deployment
3. View **Logs** tab

You should see:
```
⚡️[server]: Backend listening on port 4000
Router Address: ⚠️  NOT CONFIGURED
RPC URL: https://base-sepolia.g.alchemy.com/v2/...
Environment: production
```

---

## Step 5: Deploy Smart Contracts

### 5.1 Deploy Router Contract
```bash
cd ../contracts
npx hardhat run scripts/deploy.ts --network base-sepolia
```

### 5.2 Update Railway Environment Variables
1. Copy the deployed `ROUTER_ADDRESS`
2. Go to Railway dashboard → **Variables**
3. Add/update `ROUTER_ADDRESS=0x...`
4. Railway will auto-redeploy

### 5.3 Verify Quote Endpoint Works
```bash
curl -X POST https://your-app-name.railway.app/quote \
  -H "Content-Type: application/json" \
  -d '{
    "chainId": 84532,
    "tokenIn": "0xYourTokenInAddress",
    "tokenOut": "0xYourTokenOutAddress",
    "amountIn": "1000000000000000000",
    "slippageBps": 100
  }'
```

---

## Step 6: Update Frontend

### 6.1 Add Railway URL to Frontend
```typescript
// frontend/src/lib/api.ts
const API_BASE_URL = import.meta.env.VITE_API_URL ||
                     'https://your-app-name.railway.app';
```

### 6.2 Set Frontend Environment Variable
```bash
# frontend/.env.production
VITE_API_URL=https://your-app-name.railway.app
```

### 6.3 Redeploy Frontend
The frontend will now connect to your Railway backend.

---

## Automatic Deployments

Railway automatically deploys when you push to GitHub:

```bash
# Make changes
git add .
git commit -m "Update backend"
git push origin main

# Railway automatically:
# 1. Detects push
# 2. Builds new Docker image
# 3. Runs tests (if configured)
# 4. Deploys with zero downtime
# 5. Keeps previous version as rollback
```

---

## Monitoring & Logs

### View Logs
```bash
# In Railway dashboard:
Project → Deployments → Select deployment → Logs
```

### Metrics
Railway provides:
- CPU usage
- Memory usage
- Network traffic
- Request count
- Response times

### Alerts
Set up alerts in Railway for:
- Deployment failures
- High error rates
- Resource limits

---

## Cost Estimate

**Free Tier:**
- $5 monthly credit (new accounts)
- Good for ~500 hours of compute

**Hobby Plan:**
- $5/month
- Unlimited projects
- Auto-sleep when inactive (saves costs)

**Expected Monthly Cost:**
- Light usage: $0-5 (within free credit)
- Medium usage: $5-10
- High usage: $10-20

**Auto-Sleep Feature:**
- Sleeps after 10 min of inactivity
- Wakes on first request (~1s cold start)
- No charges while sleeping

---

## Troubleshooting

### Build Fails
**Error:** `npm install` fails
- Check `package.json` is valid
- Ensure all dependencies are listed
- Try `npm ci` locally first

**Error:** TypeScript compilation fails
- Run `npm run build` locally first
- Check `tsconfig.json` is correct
- Ensure all imports use `.js` extensions

### Runtime Errors
**Error:** `ROUTER_ADDRESS not configured`
- Add `ROUTER_ADDRESS` in Railway variables
- Deploy contracts first

**Error:** `RPC timeout`
- Check RPC provider API key is valid
- Verify RPC URL is correct
- Check Alchemy/Ankr dashboard for rate limits

### Health Check Fails
**Error:** Health check timeout
- Check `PORT` environment variable
- Verify `/health` endpoint responds
- Check logs for startup errors

### Can't Connect from Frontend
**Error:** CORS errors
- Verify CORS headers in `backend/src/index.ts`
- Check `Access-Control-Allow-Origin` is set to `*` or frontend domain
- Ensure Railway URL is correct in frontend

---

## Rollback

If deployment fails or has issues:

1. Go to Railway dashboard
2. **Deployments** → Select previous deployment
3. Click **Redeploy**
4. Previous version goes live immediately

---

## Advanced: Custom Domain

### Add Custom Domain
1. Railway dashboard → **Settings**
2. **Domains** → "Generate Domain" or "Custom Domain"
3. Add your domain (e.g., `api.yourapp.com`)
4. Update DNS records:
   ```
   CNAME api.yourapp.com → your-app.railway.app
   ```
5. SSL certificate auto-provisioned

---

## Security Checklist

- ✅ Use dedicated RPC provider (not public endpoints)
- ✅ Set `NODE_ENV=production`
- ✅ Never commit `.env` files
- ✅ Rotate API keys regularly
- ✅ Enable Railway's built-in DDoS protection
- ✅ Monitor logs for suspicious activity
- ✅ Set up error alerts

---

## Next Steps

After successful deployment:

1. ✅ Update PLAN.md with production URL
2. ✅ Test all endpoints thoroughly
3. ✅ Set up monitoring/alerts
4. 📊 Monitor performance metrics
5. 🔄 Set up CI/CD for automated testing
6. 🗄️ Add Redis for caching (Phase 2)
7. 🔌 Add WebSocket support (Phase 3)

---

## Support

**Railway Issues:**
- [Railway Docs](https://docs.railway.com/)
- [Railway Discord](https://discord.gg/railway)
- [Railway Status](https://status.railway.app/)

**Project Issues:**
- Check `PLAN.md` for architecture details
- Review logs in Railway dashboard
- Test locally first: `npm run dev`

---

**Deployment Status:** Ready to deploy ✅
**Estimated Setup Time:** 15-30 minutes
**Last Updated:** 2026-02-09
