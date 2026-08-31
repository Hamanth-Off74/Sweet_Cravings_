# Vercel + Render Deployment Guide

This project uses two deployments:

- **Render** hosts the Node.js/Express backend, MongoDB connection, payments, voice ordering, and API.
- **Vercel** hosts the React/Vite frontend.

The frontend sends API and image requests to the Render backend. The current Vercel rewrite configuration points to:

```text
https://sweet-cravings-1.onrender.com
```

Replace this URL if Render gives the backend a different public URL.

## Prerequisites

- GitHub repository containing the project.
- MongoDB Atlas database.
- Render account connected to GitHub.
- Vercel account connected to GitHub.
- Razorpay account for online payments.
- Clerk publishable key for frontend authentication.
- AssemblyAI key if voice ordering is enabled.

## 1. Deploy the Backend to Render

1. Open [Render](https://render.com/) and choose **New > Web Service**.
2. Connect the GitHub repository.
3. Use the repository root as the service root directory.
4. Configure the service:

| Setting | Value |
| --- | --- |
| Runtime | Node |
| Build command | `npm install && npm --prefix client install && npm run build` |
| Start command | `npm start` |
| Branch | `main` |

5. Add these environment variables in **Render > Service > Environment**:

```dotenv
NODE_ENV=production
MONGODB_URI=your_mongodb_atlas_connection_string
CORS_ORIGIN=https://your-vercel-project.vercel.app
RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_key_secret
RAZORPAY_WEBHOOK_SECRET=your_razorpay_webhook_secret
ASSEMBLYAI_KEY=your_assemblyai_api_key
ADMIN_USERNAME=your_admin_username
ADMIN_PASSWORD=your_strong_admin_password
ADMIN_EMAIL=your_admin_email
```

Do not set a fixed `PORT` unless required by the host. The Express server uses Render's `PORT` value automatically when Render provides it.

6. Click **Create Web Service** and wait for the deployment to finish.
7. Copy the public Render URL, for example:

```text
https://sweet-cravings-1.onrender.com
```

8. Verify the backend before deploying the frontend:

```text
https://your-render-url.onrender.com/api/desserts
```

The endpoint should return a JSON response.

## 2. Configure the Vercel Frontend

1. Open [Vercel](https://vercel.com/) and choose **Add New > Project**.
2. Import the same GitHub repository.
3. Set the project root directory to `client`.
4. Vercel should detect Vite automatically. Use:

| Setting | Value |
| --- | --- |
| Framework preset | Vite |
| Install command | `npm install` |
| Build command | `npm run build` |
| Output directory | `dist` |

5. Add these Vercel environment variables:

```dotenv
VITE_API_BASE_URL=https://your-render-url.onrender.com
VITE_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
```

6. Deploy the project.
7. Copy the Vercel production URL.

## 3. Connect Vercel and Render

Return to the Render service and set:

```dotenv
CORS_ORIGIN=https://your-vercel-project.vercel.app
```

Use the exact Vercel origin without a trailing slash. Save the variable and redeploy the Render service.

If the Render URL changed, update `VITE_API_BASE_URL` in Vercel and redeploy the frontend. Also update the backend and image/API destinations in `client/vercel.json` if that file still contains the old Render URL.

## 4. Verify the Production Deployment

Test these frontend pages:

- `/`
- `/menu`
- `/product/1`
- `/cart`
- `/checkout`
- `/orders`
- `/wishlist`
- `/customize`
- `/admin/login`

Verify the following workflows:

- Desserts load from `GET /api/desserts`.
- Offers load from `GET /api/offers`.
- Images load from the Render backend.
- Items can be added to the cart and quantities can be changed.
- Checkout creates an order.
- Razorpay test payment completes and is verified.
- Admin login opens the protected dashboard.
- Admin can update order status and manage desserts/offers.
- Voice ordering works when `ASSEMBLYAI_KEY` is configured.
- Direct navigation to React routes does not return a 404.

## 5. Automatic Deployments

After the services are connected to the `main` branch:

```bash
git add .
git commit -m "describe the change"
git push origin main
```

Vercel and Render will create new deployments from the pushed commit. Check the deployment logs if either service fails.

## Troubleshooting

### Frontend cannot reach the API

Check that `VITE_API_BASE_URL` contains the Render URL, `CORS_ORIGIN` contains the Vercel URL, and both services have been redeployed after environment changes.

### Render deployment fails

Confirm the build command installs both the root and `client` dependencies. Confirm the start command is `npm start`, and inspect the Render logs for MongoDB or missing environment variables.

### MongoDB connection fails

Verify `MONGODB_URI`, database credentials, and the MongoDB Atlas network access list. Allow the Render service to connect according to your Atlas security policy.

### React route returns 404 on Vercel

Confirm the Vercel project root is `client` and that `client/vercel.json` is included in the deployment. Redeploy after changing the rewrite configuration.

### Payments fail

Use matching Razorpay test or live credentials, confirm the backend can reach Razorpay, and never expose `RAZORPAY_KEY_SECRET` in Vercel or frontend code.

## Production Security

- Use strong unique admin credentials.
- Store secrets only in Render and Vercel environment settings.
- Use HTTPS URLs for both services.
- Restrict `CORS_ORIGIN` to the real Vercel domain.
- Configure persistent storage for uploaded files if Render's filesystem is ephemeral.
- Use Razorpay webhooks and signature verification before accepting real payments.
