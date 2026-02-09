# Railway Deployment Guide for Sweet Cravings

## Prerequisites
- Railway account (https://railway.app/)
- GitHub repository with your code pushed
- MongoDB Atlas account for database (or use Railway's MongoDB plugin)

## Step 1: Sign up/Login to Railway
1. Go to https://railway.app/
2. Click "Login" or "Start a New Project"
3. Sign in with your GitHub account

## Step 2: Create New Project
1. Click "New Project"
2. Select "Deploy from GitHub repo"
3. Choose your repository: `Hamanth-Off74/Sweet_Cravings_`
4. Select the `dev` branch

## Step 3: Add MongoDB Database
**Option A: Use Railway's MongoDB Plugin**
1. In your project dashboard, click "+ New"
2. Select "Database" → "Add MongoDB"
3. Railway will automatically create a MongoDB instance

**Option B: Use MongoDB Atlas**
1. Get your MongoDB connection string from Atlas
2. You'll add it as an environment variable in the next step

## Step 4: Configure Environment Variables
1. Click on your service in Railway dashboard
2. Go to "Variables" tab
3. Add the following environment variables:

```
MONGODB_URI=<your-mongodb-connection-string>
RAZORPAY_KEY_ID=<your-razorpay-key-id>
RAZORPAY_KEY_SECRET=<your-razorpay-key-secret>
RAZORPAY_WEBHOOK_SECRET=<your-webhook-secret>
PORT=5000
NODE_ENV=production
```

**If using Railway MongoDB Plugin:**
- Railway will automatically provide `MONGO_URL` variable
- You can reference it as: `${{MongoDB.MONGO_URL}}`

## Step 5: Deploy
1. Railway will automatically deploy when you push to GitHub
2. Click "Deploy" if it doesn't start automatically
3. Wait for the build to complete (2-5 minutes)

## Step 6: Get Your Deployment URL
1. Once deployed, go to "Settings" tab
2. Scroll to "Networking" section
3. Click "Generate Domain"
4. Your app will be available at: `your-app-name.up.railway.app`

## Step 7: Update React Frontend (Optional)
If you want to deploy the React frontend separately:
1. Create a new service in the same project
2. Set root directory to `client`
3. Add environment variable: `VITE_API_URL=<your-backend-url>`

## Step 8: Test Your Deployment
1. Visit your Railway URL
2. Test the following:
   - Homepage loads correctly
   - Menu displays products
   - Cart functionality works
   - Razorpay payment integration
   - Order creation and retrieval

## Troubleshooting

### Build Fails
- Check the build logs in Railway dashboard
- Ensure all dependencies are in package.json
- Verify Node.js version compatibility

### Database Connection Issues
- Verify MONGODB_URI is correct
- Check MongoDB Atlas IP whitelist (add 0.0.0.0/0 for Railway)
- Ensure database user has read/write permissions

### App Crashes
- Check the deployment logs
- Verify all environment variables are set
- Ensure PORT environment variable is being used

## Continuous Deployment
Railway automatically deploys when you push to your GitHub branch:
```bash
git add .
git commit -m "Your commit message"
git push origin dev
```

## Cost
- Railway offers $5 free credit per month
- Additional usage is billed at $0.000463/GB-hour for memory
- MongoDB plugin or external Atlas connection

## Support
- Railway Docs: https://docs.railway.app/
- Railway Discord: https://discord.gg/railway
- GitHub Issues: Your repository issues page
