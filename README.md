# Sweet Cravings

Sweet Cravings is a full-stack dessert ordering application. Customers can browse desserts, search and filter the menu, save favorites, build a cart, place orders, pay with Razorpay or cash on delivery, view their orders, and submit voice orders. Administrators have a protected dashboard for managing desserts, offers, images, and order status.

The repository contains:

- An Express 5 and MongoDB backend.
- A React 18 single-page application built with Vite.
- A shared production server that serves the React build and API.
- EJS views and static assets retained for the server-rendered storefront paths.
- Optional Clerk authentication on the React client and AssemblyAI transcription for voice ordering.

## Features

### Customer experience

- Home page with featured desserts, seasonal effects, promotions, and navigation.
- Menu browsing across Cakes, Cookies, Pies, Italian desserts, Brownies, Tarts, and Ice Cream.
- Search, product details, ratings, discounts, and quick view.
- Shopping cart with quantity controls and totals.
- Wishlist support stored by the React client.
- Checkout with delivery details and Razorpay payment verification.
- Cash-on-delivery order option.
- Order history and confirmation pages.
- Voice ordering through an uploaded audio recording when AssemblyAI is configured.
- Dark mode, responsive layouts, and mobile navigation.
- Custom dessert ordering through the Customize Studio page.

### Admin experience

- Admin login and token-based protected dashboard.
- View, update, and delete orders.
- Update order status: pending, processing, shipped, delivered, or cancelled.
- Create, edit, and delete desserts.
- Upload dessert images.
- Create, edit, and delete promotional offers.

## Technology Stack

| Area | Technology |
| --- | --- |
| Frontend | React, React Router, Vite, Axios, Framer Motion, Tabler Icons |
| Authentication | Clerk for the React client; backend admin login for the dashboard |
| Backend | Node.js, Express, EJS, CORS, Multer |
| Database | MongoDB with Mongoose |
| Payments | Razorpay |
| Voice ordering | AssemblyAI and multipart audio uploads |
| Deployment | Render for the backend and Vercel for the React client |

## Project Structure

```text
.
├── app.js                  # Express entrypoint and production server
├── routes/index.js         # API and server routes
├── models/                 # Mongoose models
├── public/                 # Backend static assets and uploaded images
├── views/                  # EJS templates
├── client/                 # React/Vite frontend
│   ├── src/pages/           # Customer and admin pages
│   ├── src/components/      # Shared UI and feature components
│   ├── src/context/         # Cart, wishlist, dark mode, and admin auth state
│   ├── src/api/axios.js     # Configured API client
│   └── public/              # Frontend static assets
├── seed-orders.js           # Inserts sample orders into local MongoDB
├── package.json             # Backend scripts and dependencies
└── client/package.json      # Frontend scripts and dependencies
```

## Requirements

- Node.js 18 or newer recommended.
- npm.
- MongoDB, either locally or through MongoDB Atlas.
- Razorpay credentials for online payments.
- A Clerk publishable key for the client authentication UI.
- An AssemblyAI API key only if voice ordering is needed.

## Installation

Clone the repository and install both dependency sets:

```bash
npm install
cd client
npm install
cd ..
```

Create a backend `.env` file in the repository root:

```dotenv
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/sweetcravings
CORS_ORIGIN=http://localhost:5173
RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_key_secret
RAZORPAY_WEBHOOK_SECRET=your_razorpay_webhook_secret
ASSEMBLYAI_KEY=your_assemblyai_api_key
ADMIN_USERNAME=admin
ADMIN_PASSWORD=change_this_password
ADMIN_EMAIL=admin@example.com
```

Create `client/.env.local` for the Vite frontend:

```dotenv
VITE_API_BASE_URL=http://localhost:5000
VITE_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
```

`VITE_API_BASE_URL` may be left empty when the React app is served by the same Express server in production. Never commit real secrets or `.env` files.

## Running Locally

Run the backend in one terminal:

```bash
npm run dev
```

Run the Vite frontend in a second terminal:

```bash
cd client
npm run dev
```

The Vite development server is normally available at `http://localhost:5173` and proxies API requests to the backend configured in `VITE_API_BASE_URL`. The Express server runs on `http://localhost:5000` unless `PORT` is changed.

For a production-style local run, build the client and start Express:

```bash
npm run build
npm start
```

Open `http://localhost:5000` after the build completes.

## Available Scripts

### Root scripts

| Command | Purpose |
| --- | --- |
| `npm run dev` | Start the Express server with Nodemon |
| `npm start` | Start the Express server with Node |
| `npm run build` | Build the React client into `client/dist` |
| `npm test` | Placeholder command; automated tests are not currently configured |

### Client scripts

Run these from `client/`:

| Command | Purpose |
| --- | --- |
| `npm run dev` | Start the Vite development server |
| `npm run build` | Create a production frontend build |
| `npm run preview` | Preview the production build locally |
| `npm run deploy` | Publish `client/dist` through `gh-pages` |

## API Reference

All API routes are served from the backend origin.

### Public and customer routes

| Method | Endpoint | Purpose |
| --- | --- | --- |
| `GET` | `/api/desserts` | List available desserts |
| `GET` | `/api/offers` | List active offers |
| `GET` | `/api/orders` | Retrieve orders |
| `POST` | `/api/order` | Create an order |
| `POST` | `/api/create-razorpay-order` | Create a Razorpay order |
| `POST` | `/api/verify-payment` | Verify a Razorpay payment |
| `POST` | `/api/voice-order` | Transcribe and process an audio order |

### Admin routes

Admin management endpoints require the admin token returned by login.

| Method | Endpoint | Purpose |
| --- | --- | --- |
| `POST` | `/api/admin/login` | Authenticate an administrator |
| `POST` | `/api/admin/logout` | Log out an administrator |
| `GET` | `/api/admin/verify` | Verify the current admin session |
| `GET` | `/api/admin/orders` | List orders for the dashboard |
| `PUT` | `/api/admin/orders/:orderId` | Update an order |
| `DELETE` | `/api/admin/orders/:orderId` | Delete an order |
| `GET` | `/api/admin/desserts` | List admin dessert records |
| `POST` | `/api/admin/desserts` | Create a dessert |
| `PUT` | `/api/admin/desserts/:id` | Update a dessert |
| `DELETE` | `/api/admin/desserts/:id` | Delete a dessert |
| `POST` | `/api/admin/upload-image` | Upload a dessert image |
| `GET` | `/api/admin/offers` | List admin offers |
| `POST` | `/api/admin/offers` | Create an offer |
| `PUT` | `/api/admin/offers/:id` | Update an offer |
| `DELETE` | `/api/admin/offers/:id` | Delete an offer |

## Data Models

### Dessert

Desserts contain a name, description, price, optional original price and discount, rating, review count, image URL, category, active/featured flags, and optional offer reference. Valid categories are `Cakes`, `Cookies`, `Pies`, `Italian`, `Brownies`, `Tarts`, and `Ice Cream`.

### Order

Orders contain a unique order ID, customer contact information, delivery address, item snapshots, subtotal, delivery fee, tax, total, payment method, payment status, Razorpay identifiers when applicable, order status, and timestamps.

## Sample Data

With MongoDB running locally, the seed script inserts sample orders into the default `sweetcravings` database:

```bash
node seed-orders.js
```

The script uses its own local MongoDB connection string. Review it before using the script against any non-local database.

## Deployment

### Single-server deployment

This is the simplest deployment model:

1. Install dependencies with `npm install` and `npm --prefix client install`.
2. Set the backend environment variables on the host.
3. Run `npm run build`.
4. Start the service with `npm start`.
5. Configure the host to provide its assigned `PORT`.
6. Point `MONGODB_URI` at MongoDB Atlas or a managed MongoDB instance.

Express serves `client/dist` and falls back to its `index.html`, which supports React Router URLs such as `/menu`, `/cart`, and `/admin`.

### Separate Vercel frontend and backend

1. Deploy the backend to Render.
2. Deploy the `client/` directory as the Vercel project root.
3. Set `VITE_API_BASE_URL` to the public backend URL, for example `https://your-backend.example.com`.
4. Set `VITE_CLERK_PUBLISHABLE_KEY` in the frontend deployment environment.
5. Set backend `CORS_ORIGIN` to the exact frontend URL.
6. Ensure the frontend deployment includes the supplied SPA rewrite configuration in `client/vercel.json`.

For the current deployment setup, see [VERCEL_RENDER_DEPLOYMENT.md](VERCEL_RENDER_DEPLOYMENT.md). The repository also includes [DEPLOYMENT_GUIDE.md](DEPLOYMENT_GUIDE.md) with additional deployment and testing notes.

## Security and Production Notes

- Replace all development defaults, especially `ADMIN_PASSWORD`, Razorpay fallback values, and webhook secrets.
- Keep Razorpay secret keys, AssemblyAI keys, MongoDB credentials, and admin credentials in environment variables only.
- Restrict `CORS_ORIGIN` to trusted frontend origins in production.
- Use HTTPS for deployed frontend and backend URLs.
- Configure Razorpay webhooks and verify signatures using a production webhook secret before accepting real payments.
- The current backend uses a simple admin credential flow. Add a production-grade identity provider, password hashing, rate limiting, and durable session storage before exposing it publicly.
- Uploaded files are written to `uploads/`; configure persistent storage or object storage on hosts with ephemeral filesystems.
- The root `npm test` command is currently a placeholder and exits with an error. Validate checkout, payment verification, admin authorization, and upload behavior manually until automated tests are added.

## Troubleshooting

### The menu is empty

Confirm the backend is running, MongoDB is reachable, and the browser request to `/api/desserts` returns successfully. In a split deployment, verify `VITE_API_BASE_URL` and `CORS_ORIGIN`.

### React routes return 404 after deployment

Build the client and deploy the generated `client/dist` directory. For Vercel, deploy from `client/` and keep the SPA rewrite configuration enabled.

### Razorpay checkout fails

Check that the key ID and secret belong to the same Razorpay account and mode, that the frontend can reach the backend, and that the payment verification request reaches `/api/verify-payment`.

### Voice ordering fails

Set `ASSEMBLYAI_KEY`, confirm the uploaded audio is within the 10 MB limit, and check backend logs for transcription errors.

### Admin login fails

Confirm `ADMIN_USERNAME`, `ADMIN_PASSWORD`, and `ADMIN_EMAIL` match the backend environment. Restart the server after changing environment variables.

## License

The project currently uses the ISC license declared in `package.json`.

