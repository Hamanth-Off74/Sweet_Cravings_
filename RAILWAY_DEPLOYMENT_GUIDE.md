# Railway Backend Deployment Guide

## Step 1: Prepare Railway
1. Go to https://railway.app
2. Sign up / Login
3. Click **New Project**
4. Click **Deploy from GitHub Repo**
5. Select your repo: `Hamanth-Off74/Sweet_Cravings_`

## Step 2: Configure Build & Start
Railway will auto-detect Node.js. Confirm:
- **Start Command:** `node app.js`
- **Root Directory:** (leave blank - uses root)

## Step 3: Add Environment Variables
In Railway project, click **Variables** tab and add:

| Key | Value |
|-----|-------|
| `MONGODB_URI` | `mongodb+srv://hamantharumugam_db_user:YOUR_PASSWORD@cluster0.xpoz2vd.mongodb.net/mydb?retryWrites=true&w=majority` |
| `CORS_ORIGIN` | `https://sweet-cravings-frontendapp.vercel.app` |
| `NODE_ENV` | `production` |
| `RAZORPAY_KEY_ID` | (your Razorpay key) |
| `RAZORPAY_KEY_SECRET` | (your secret) |

**Replace `YOUR_PASSWORD`** with your actual MongoDB password.
**If password has special chars, URL-encode them:**
- `@` → `%40`
- `#` → `%23`
- `:` → `%3A`

## Step 4: Deploy
Click **Deploy** button. Wait 3-5 minutes.

## Step 5: Get Railway URL
Once deployed, Railway shows your public URL:
- Example: `https://sweet-cravings-backend.up.railway.app`
- Copy this exact URL

## Step 6: Update Vercel
1. Go to Vercel project settings
2. Go to **Environment Variables**
3. Update `VITE_API_BASE_URL` to your Railway URL
4. Click **Save**
5. **Redeploy** Vercel

## Step 7: Test
1. Open your Vercel URL
2. Open DevTools (F12)
3. Go to Network tab
4. Click a category (e.g., "Cakes")
5. Check API requests go to your Railway domain
6. Desserts should load ✅

---

## Troubleshooting

**"No desserts found" in Vercel?**
- Check VITE_API_BASE_URL is set to Railway URL
- Check Vercel was redeployed after changing env var
- Hard refresh browser (Ctrl+Shift+R)

**MongoDB connection error in Railway logs?**
- Check MONGODB_URI is correct
- Verify MongoDB password doesn't have unencoded special chars
- Check cluster IP whitelist allows Railway

**CORS error?**
- Verify CORS_ORIGIN matches your Vercel URL exactly (with https://)
- Check Railway backend is running (see logs)

---

## Quick Checklist
- [ ] Railway project created
- [ ] GitHub repo connected
- [ ] MONGODB_URI added
- [ ] CORS_ORIGIN added (Vercel URL)
- [ ] Deploy clicked and finished
- [ ] Copy Railway URL
- [ ] Update Vercel VITE_API_BASE_URL
- [ ] Redeploy Vercel
- [ ] Test category filter works
- [ ] Test search works
