require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const Razorpay = require('razorpay');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();

const allowedOrigins = [
    process.env.CORS_ORIGIN,
    'http://localhost:3000',
    'http://localhost:3001',
    'http://localhost:3005'
].filter(Boolean);

// Enable CORS for React frontend with dynamic origin matching
app.use(cors({
    origin: (origin, callback) => {
        // Allow server-to-server or local REST client requests (no origin)
        if (!origin) return callback(null, true);
        
        const isAllowed = allowedOrigins.includes(origin) || 
                          origin.startsWith('http://localhost') || 
                          origin.endsWith('.vercel.app') ||
                          origin.includes('sweet-cravings');
                          
        if (isAllowed) {
            callback(null, true);
        } else {
            console.warn(`CORS blocked for origin: ${origin}`);
            callback(null, false); // Block origin but don't crash Express process
        }
    },
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

// MongoDB Connection
const dbURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/sweetcravings';
mongoose.connect(dbURI)
.then(() => console.log('MongoDB Connected Successfully'))
.catch(err => console.log('MongoDB Connection Error:', err));

// Razorpay instance (TEST MODE)
const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID || 'rzp_test_R5uZgmenogCy4j',
    key_secret: process.env.RAZORPAY_KEY_SECRET || 'iou4q509iexeJOlJNCpq7gBd'
});

// Make razorpay instance available to routes
app.locals.razorpay = razorpay;
app.locals.razorpayKeyId = process.env.RAZORPAY_KEY_ID || 'rzp_test_R5uZgmenogCy4j';
app.locals.razorpayWebhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET || 'webhook_secret_123';

// Bodyparser Middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// EJS
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Static folder
app.use(express.static(path.join(__dirname, 'public')));

// Serve React client build
const clientDistPath = path.join(__dirname, 'client', 'dist');
app.use(express.static(clientDistPath));

// Routes
app.use('/', require('./routes/index'));

// Fallback to React for client-side routing
app.use((req, res) => {
  res.sendFile(path.join(clientDistPath, 'index.html'));
});

const port = process.env.PORT || 5000;

app.listen(port, () => console.log(`Server started on port ${port}`));
