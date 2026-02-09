# 🚂 Railway Deployment Quick Start

Deploy the Base DeFi Router backend to Railway in **5 minutes**.

---

## Prerequisites Check

Run these locally first:

```bash
cd backend

# ✅ Should build successfully
npm run build

# ✅ Should start locally
npm run dev
# Visit http://localhost:4000/health
```

---

## Step-by-Step Deployment

### 1️⃣ Push to GitHub (2 min)

```bash
# In the project root
git add .
git commit -m "Add Railway deployment configuration"
git push origin main
```

### 2️⃣ Deploy to Railway (3 min)

1. Go to **[railway.app](https://railway.app)** → Sign in with GitHub

2. Click **"New Project"** → **"Deploy from GitHub repo"**

3. Select your repository

4. **Add Environment Variables:**
   - Click **"Variables"** tab
   - Add these:
     ```
     BASE_SEPOLIA_RPC_URL=https://sepolia.base.org
     NODE_ENV=production
     ```

5. Click **"Deploy"**

6. Wait ~2 minutes for build

7. Get your URL: `https://your-app.railway.app`

### 3️⃣ Test Deployment

```bash
# Health check
curl https://your-app.railway.app/health
```

**Expected:**
```json
{
  "ok": true,
  "message": "DeFi Router API is running",
  "config": {
    "routerConfigured": false,
    "chainId": 84532,
    "network": "Base Sepolia"
  }
}
```

---

## What Happens Next?

✅ **You're live!** Backend is deployed and running.

⏳ **To enable quotes:**
1. Deploy smart contracts (see `contracts/` folder)
2. Add `ROUTER_ADDRESS` to Railway variables
3. Test `/quote` endpoint

⏳ **For production:**
1. Sign up for [Alchemy](https://alchemy.com) (free)
2. Get Base Sepolia API key
3. Update `BASE_SEPOLIA_RPC_URL` in Railway

---

## Quick Links

- 📚 **Full Guide:** [`DEPLOY.md`](./DEPLOY.md)
- 📊 **Architecture:** [`../PLAN.md`](../PLAN.md)
- 🔍 **Research:** See PLAN.md "Research Summary"

---

## Automatic Deployments

Every `git push` to main → Railway auto-deploys ✨

```bash
git commit -m "Update API"
git push origin main
# Railway rebuilds and deploys automatically
```

---

## Troubleshooting

**Build fails?**
- Run `npm run build` locally first
- Check all dependencies in `package.json`

**Can't connect?**
- Check Railway logs: Dashboard → Deployments → Logs
- Verify environment variables are set

**Need help?**
- Read full [`DEPLOY.md`](./DEPLOY.md)
- Check Railway docs: [docs.railway.com](https://docs.railway.com)

---

**Time to Deploy:** ~5 minutes
**Cost:** $0 (uses $5 free monthly credit)
**Status:** ✅ Ready to deploy
