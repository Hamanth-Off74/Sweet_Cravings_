# SweetCravings - React Version

This is the React version of the SweetCravings dessert e-commerce website. The project has been converted from EJS templates to React components while maintaining the exact same design and functionality.

## Project Structure

```
client/                 # React frontend
├── public/            # Static assets
│   ├── css/          # Styles (copied from original)
│   └── images/       # Product images (copied from original)
├── src/
│   ├── components/   # React components (Header, Footer, etc.)
│   ├── pages/        # Page components (Home, Menu, Cart, etc.)
│   ├── context/      # React Context for state management
│   ├── data/         # Desserts data
│   ├── App.jsx       # Main app component
│   └── main.jsx      # Entry point
└── package.json

server/                # Backend (Express + MongoDB)
├── models/           # MongoDB models
├── routes/           # API routes
├── app.js            # Express server
└── package.json
```

## Features

✅ **All Original Features Preserved:**
- Home page with featured desserts slideshow
- Full dessert menu with category filtering
- Shopping cart with local storage
- Checkout with Razorpay payment integration
- Order management
- Admin panel
- User authentication (login/signup)
- Wishlist functionality
- Responsive design

## Setup Instructions

### 1. Install Backend Dependencies

```bash
cd "c:\Users\Sun Tyres\OneDrive\Desktop\dessert web"
npm install
```

### 2. Install React Frontend Dependencies

```bash
cd client
npm install
```

### 3. Start MongoDB

Make sure MongoDB is running on your system.

### 4. Start Backend Server

```bash
# From the root directory
npm start
```

The backend will run on **http://localhost:5000**

### 5. Start React Frontend

```bash
# From the client directory
cd client
npm run dev
```

The React app will run on **http://localhost:3000**

## Environment Setup

The React app is configured to proxy API requests to the backend server at localhost:5000. This is set up in `vite.config.js`:

```javascript
server: {
  port: 3000,
  proxy: {
    '/api': {
      target: 'http://localhost:5000',
      changeOrigin: true
    }
  }
}
```

## Key Changes from Original

### Architecture
- **Before:** Server-side rendering with EJS templates
- **After:** Client-side rendering with React components

### Routing
- **Before:** Express routes serving HTML pages
- **After:** React Router for client-side routing + Express API endpoints

### State Management
- **Before:** DOM manipulation with vanilla JavaScript
- **After:** React Context API for cart management + React hooks for component state

### Data Flow
- **Before:** Data passed directly to templates
- **After:** API calls with axios to fetch data from backend

## API Endpoints

### Desserts
- `GET /api/desserts` - Get all desserts

### Orders
- `GET /api/orders` - Get user orders
- `POST /api/order` - Create new order
- `GET /api/admin/orders` - Get all orders (admin)

### Payment
- `POST /api/create-razorpay-order` - Create Razorpay payment order
- `POST /api/verify-payment` - Verify payment and save order

## Technologies Used

### Frontend
- React 18
- React Router DOM v6
- Axios for API calls
- Vite for build tooling

### Backend
- Express.js
- MongoDB + Mongoose
- Razorpay for payments
- CORS enabled

### Styling
- Original CSS maintained (style.css)
- Font Awesome icons
- Responsive design

## Development

### Frontend Development
```bash
cd client
npm run dev
```

### Backend Development
```bash
npm start  # Uses nodemon for auto-restart
```

### Build for Production
```bash
cd client
npm run build
```

This will create an optimized production build in the `client/dist` folder.

## Notes

- All images and CSS have been copied from the original project
- The exact same design and functionality are preserved
- MongoDB connection string can be configured in `app.js`
- Razorpay test credentials are already configured

## Support

For any issues or questions, refer to the original project documentation or contact support.

---

**Enjoy your React-powered SweetCravings! 🍰🍪🥧**
