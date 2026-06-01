const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const Dessert = require('../models/Dessert');
const cors = require('cors');
const { AssemblyAI } = require('assemblyai');
const multer = require('multer');
const fs = require('fs').promises;

// Configure multer for audio file uploads
const upload = multer({
    dest: 'uploads/',
    limits: { fileSize: 10 * 1024 * 1024 } // 10MB limit
});

// Static dessert data with prices between 40 and 200
const desserts = [
    // Cakes Category
    {
        _id: '1',
        name: 'Chocolate Cake',
        description: 'Rich and moist chocolate cake with layers of chocolate ganache.',
        price: 180.00,
        originalPrice: 220.00,
        discount: 18,
        rating: 4.8,
        reviews: 312,
        imageURL: '/images/cakes/chocolate-cake.jpg',
        category: 'Cakes'
    },
    {
        _id: '2',
        name: 'Red Velvet Cake',
        description: 'Classic red velvet cake with smooth cream cheese frosting.',
        price: 150.00,
        originalPrice: 180.00,
        discount: 17,
        rating: 4.7,
        reviews: 290,
        imageURL: '/images/cakes/red%20velvet-cake.jpg',
        category: 'Cakes'
    },
    {
        _id: '3',
        name: 'Black Forest Cake',
        description: 'Decadent chocolate cake with cherries and whipped cream.',
        price: 190.00,
        originalPrice: 220.00,
        discount: 14,
        rating: 4.9,
        reviews: 450,
        imageURL: '/images/cakes/black%20forest-cake.jpg',
        category: 'Cakes'
    },
    {
        _id: '4',
        name: 'Cheesecake',
        description: 'Creamy New York style cheesecake with graham cracker crust.',
        price: 160.00,
        originalPrice: 190.00,
        discount: 16,
        rating: 4.8,
        reviews: 380,
        imageURL: '/images/cakes/cheese-cake.jpg',
        category: 'Cakes'
    },
    {
        _id: '5',
        name: 'Pineapple Pastry Cake',
        description: 'Light and fluffy pineapple cake with fresh cream and pineapple chunks.',
        price: 140.00,
        originalPrice: 170.00,
        discount: 18,
        rating: 4.6,
        reviews: 255,
        imageURL: '/images/cakes/pineapple%20pastry-cake.jpg',
        category: 'Cakes'
    },
    // Cookies Category
    {
        _id: '6',
        name: 'Chocolate Chip Cookie',
        description: 'Classic, soft and chewy chocolate chip cookie.',
        price: 40.00,
        originalPrice: 50.00,
        discount: 20,
        rating: 4.9,
        reviews: 890,
        imageURL: 'https://images.unsplash.com/photo-1499636136210-6f4ee915583e?w=600&h=600&fit=crop',
        category: 'Cookies'
    },
    {
        _id: '7',
        name: 'Oatmeal Raisin Cookie',
        description: 'A hearty and wholesome oatmeal cookie with sweet raisins.',
        price: 45.00,
        originalPrice: 55.00,
        discount: 18,
        rating: 4.5,
        reviews: 340,
        imageURL: '/images/cookies/oatmeal%20raisin-cookies.jpg',
        category: 'Cookies'
    },
    {
        _id: '8',
        name: 'Double Chocolate Cookie',
        description: 'For the ultimate chocolate lover, a rich double chocolate cookie.',
        price: 50.00,
        originalPrice: 60.00,
        discount: 17,
        rating: 4.8,
        reviews: 560,
        imageURL: '/images/cookies/double%20chocolate-cookies.jpg',
        category: 'Cookies'
    },
    {
        _id: '9',
        name: 'Peanut Butter Cookie',
        description: 'A soft and chewy cookie with a rich peanut butter flavor.',
        price: 45.00,
        originalPrice: 55.00,
        discount: 18,
        rating: 4.6,
        reviews: 420,
        imageURL: '/images/cookies/Peanut-Butter-Cookies.jpg',
        category: 'Cookies'
    },
    {
        _id: '10',
        name: 'Sugar Cookie',
        description: 'Classic buttery sugar cookie with a sweet, tender crumb.',
        price: 40.00,
        originalPrice: 50.00,
        discount: 20,
        rating: 4.7,
        reviews: 380,
        imageURL: 'https://images.unsplash.com/photo-1558961363-fa8fdf82db35?w=600&h=600&fit=crop',
        category: 'Cookies'
    },
    // Pies Category
    {
        _id: '11',
        name: 'Blueberry Pie',
        description: 'A delicious pie filled with fresh blueberries and a flaky crust.',
        price: 160.00,
        originalPrice: 190.00,
        discount: 16,
        rating: 4.7,
        reviews: 210,
        imageURL: '/images/pies/Blueberry-Pies.jpg',
        category: 'Pies'
    },
    {
        _id: '12',
        name: 'Cherry Pie',
        description: 'A sweet and tart cherry pie with a beautiful lattice crust.',
        price: 170.00,
        originalPrice: 200.00,
        discount: 15,
        rating: 4.5,
        reviews: 195,
        imageURL: '/images/pies/Cherry-Pie.jpg',
        category: 'Pies'
    },
    {
        _id: '13',
        name: 'Banoffee Pie',
        description: 'A heavenly combination of banana and toffee in a buttery crust.',
        price: 180.00,
        originalPrice: 210.00,
        discount: 14,
        rating: 4.8,
        reviews: 250,
        imageURL: '/images/pies/Banoffee-Pie.jpg',
        category: 'Pies'
    },
    {
        _id: '14',
        name: 'Chocolate Cream Pie',
        description: 'A rich chocolate cream pie topped with fluffy whipped cream.',
        price: 190.00,
        originalPrice: 220.00,
        discount: 14,
        rating: 4.7,
        reviews: 220,
        imageURL: '/images/pies/chocolate-cream-pies.jpeg',
        category: 'Pies'
    },
    {
        _id: '15',
        name: 'Key Lime Pie',
        description: 'A refreshing and zesty key lime pie with a graham cracker crust.',
        price: 175.00,
        originalPrice: 200.00,
        discount: 13,
        rating: 4.8,
        reviews: 185,
        imageURL: '/images/pies/Key%20Lime-Pies.jpg',
        category: 'Pies'
    },
    // Italian Category
    {
        _id: '16',
        name: 'Tiramisu',
        description: 'A classic Italian dessert with layers of coffee-soaked ladyfingers and mascarpone cream.',
        price: 190.00,
        originalPrice: 230.00,
        discount: 17,
        rating: 4.9,
        reviews: 450,
        imageURL: '/images/italian/tiramisu-italian.jpg',
        category: 'Italian'
    },
    {
        _id: '17',
        name: 'Cannoli',
        description: 'A crispy pastry shell filled with a sweet, creamy ricotta filling.',
        price: 80.00,
        originalPrice: 100.00,
        discount: 20,
        rating: 4.7,
        reviews: 320,
        imageURL: '/images/italian/cannoli-italian.jpg',
        category: 'Italian'
    },
    {
        _id: '18',
        name: 'Panna Cotta',
        description: 'A smooth and creamy Italian dessert, often served with a fruit coulis.',
        price: 150.00,
        originalPrice: 180.00,
        discount: 17,
        rating: 4.6,
        reviews: 280,
        imageURL: 'https://images.unsplash.com/photo-1624353365286-3f8d62daad51?w=600&h=600&fit=crop',
        category: 'Italian'
    },
    {
        _id: '19',
        name: 'Zeppole',
        description: 'Light and airy Italian doughnuts, often dusted with powdered sugar.',
        price: 120.00,
        originalPrice: 140.00,
        discount: 14,
        rating: 4.5,
        reviews: 210,
        imageURL: '/images/italian/zeppole-iatlian.jpg',
        category: 'Italian'
    },
    {
        _id: '20',
        name: 'Biscotti',
        description: 'A crunchy and twice-baked Italian almond cookie, perfect for dipping in coffee.',
        price: 60.00,
        originalPrice: 70.00,
        discount: 14,
        rating: 4.4,
        reviews: 180,
        imageURL: 'https://images.unsplash.com/photo-1603532648955-039310d9ed75?w=600&h=600&fit=crop',
        category: 'Italian'
    },
    // Brownies Category
    {
        _id: '21',
        name: 'Fudgy Chocolate Brownie',
        description: 'A rich and fudgy brownie with a crinkly top.',
        price: 80.00,
        originalPrice: 100.00,
        discount: 20,
        rating: 4.8,
        reviews: 650,
        imageURL: '/images/brownies/Chewy%20Fudgy-Brownies.jpg',
        category: 'Brownies'
    },
    {
        _id: '22',
        name: 'Walnut Brownie',
        description: 'A classic fudgy brownie with the added crunch of walnuts.',
        price: 90.00,
        originalPrice: 110.00,
        discount: 18,
        rating: 4.7,
        reviews: 480,
        imageURL: 'https://images.unsplash.com/photo-1515037893149-de7f840978e2?w=600&h=600&fit=crop',
        category: 'Brownies'
    },
    {
        _id: '23',
        name: 'Salted Caramel Brownie',
        description: 'A decadent brownie with a gooey salted caramel swirl.',
        price: 100.00,
        originalPrice: 120.00,
        discount: 17,
        rating: 4.9,
        reviews: 720,
        imageURL: 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=600&h=600&fit=crop',
        category: 'Brownies'
    },
    {
        _id: '24',
        name: 'Blondie',
        description: 'A chewy and buttery brownie-like bar with a vanilla flavor.',
        price: 70.00,
        originalPrice: 90.00,
        discount: 22,
        rating: 4.6,
        reviews: 350,
        imageURL: '/images/brownies/Blondie-brownies.jpg',
        category: 'Brownies'
    },
    {
        _id: '25',
        name: 'Cream Cheese Brownie',
        description: 'A rich chocolate brownie with a creamy cheesecake swirl.',
        price: 110.00,
        originalPrice: 130.00,
        discount: 15,
        rating: 4.8,
        reviews: 510,
        imageURL: 'https://images.unsplash.com/photo-1607920591413-4ec007e70023?w=600&h=600&fit=crop',
        category: 'Brownies'
    },
    // Tarts Category
    {
        _id: '26',
        name: 'Lemon Tart',
        description: 'A zesty and tangy lemon tart with a buttery crust.',
        price: 160.00,
        originalPrice: 190.00,
        discount: 16,
        rating: 4.8,
        reviews: 380,
        imageURL: '/images/tarts/lemon-tart.jpg',
        category: 'Tarts'
    },
    {
        _id: '27',
        name: 'Chocolate Tart',
        description: 'A rich and decadent tart with a smooth chocolate ganache filling.',
        price: 190.00,
        originalPrice: 220.00,
        discount: 14,
        rating: 4.9,
        reviews: 450,
        imageURL: '/images/tarts/chocolate-tart.jpg',
        category: 'Tarts'
    },
    {
        _id: '28',
        name: 'Fruit Tart',
        description: 'A beautiful tart with custard filling and fresh seasonal fruits.',
        price: 180.00,
        originalPrice: 210.00,
        discount: 14,
        rating: 4.7,
        reviews: 320,
        imageURL: '/images/tarts/fruit-tart.jpeg',
        category: 'Tarts'
    },
    {
        _id: '29',
        name: 'Custard Tart',
        description: 'A classic custard tart with silky smooth vanilla custard filling.',
        price: 150.00,
        originalPrice: 180.00,
        discount: 17,
        rating: 4.6,
        reviews: 290,
        imageURL: 'https://images.unsplash.com/photo-1621303837174-89787a7d4729?w=600&h=600&fit=crop',
        category: 'Tarts'
    },
    {
        _id: '30',
        name: 'Caramel Tart',
        description: 'A sweet and indulgent tart with rich caramel filling.',
        price: 170.00,
        originalPrice: 200.00,
        discount: 15,
        rating: 4.7,
        reviews: 310,
        imageURL: 'https://images.unsplash.com/photo-1565958011703-44f9829ba187?w=600&h=600&fit=crop',
        category: 'Tarts'
    },
    // Ice Cream Category
    {
        _id: '31',
        name: 'Vanilla Bean Ice Cream',
        description: 'A classic and creamy vanilla ice cream made with real vanilla beans.',
        price: 120.00,
        originalPrice: 140.00,
        discount: 14,
        rating: 4.8,
        reviews: 550,
        imageURL: 'https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=600&h=600&fit=crop',
        category: 'Ice Cream'
    },
    {
        _id: '32',
        name: 'Chocolate Fudge Brownie Ice Cream',
        description: 'A rich chocolate ice cream with chunks of fudgy brownies.',
        price: 150.00,
        originalPrice: 180.00,
        discount: 17,
        rating: 4.9,
        reviews: 780,
        imageURL: 'https://images.unsplash.com/photo-1570197788417-0e82375c9371?w=600&h=600&fit=crop',
        category: 'Ice Cream'
    },
    {
        _id: '33',
        name: 'Strawberry Cheesecake Ice Cream',
        description: 'A creamy cheesecake ice cream with a strawberry swirl and graham cracker pieces.',
        price: 160.00,
        originalPrice: 190.00,
        discount: 16,
        rating: 4.7,
        reviews: 620,
        imageURL: 'https://images.unsplash.com/photo-1488477181946-6428a0291777?w=600&h=600&fit=crop',
        category: 'Ice Cream'
    },
    {
        _id: '34',
        name: 'Mint Chocolate Chip Ice Cream',
        description: 'A refreshing mint ice cream with chunks of chocolate.',
        price: 140.00,
        originalPrice: 160.00,
        discount: 13,
        rating: 4.6,
        reviews: 480,
        imageURL: 'https://images.unsplash.com/photo-1501443762994-82bd5dace89a?w=600&h=600&fit=crop',
        category: 'Ice Cream'
    },
    {
        _id: '35',
        name: 'Cookie Dough Ice Cream',
        description: 'A vanilla ice cream with chunks of chocolate chip cookie dough.',
        price: 150.00,
        originalPrice: 180.00,
        discount: 17,
        rating: 4.8,
        reviews: 710,
        imageURL: 'https://images.unsplash.com/photo-1497534547324-0ebb3f052e88?w=600&h=600&fit=crop',
        category: 'Ice Cream'
    }
];

// Function to get a limited number of desserts per category
function getLimitedDesserts(desserts, limit) {
    const limitedDesserts = {};
    desserts.forEach(dessert => {
        if (!limitedDesserts[dessert.category]) {
            limitedDesserts[dessert.category] = [];
        }
        if (limitedDesserts[dessert.category].length < limit) {
            limitedDesserts[dessert.category].push(dessert);
        }
    });

    // Flatten the object back to an array
    return Object.values(limitedDesserts).flat();
}

// ========================================
// API Routes for React (Must be FIRST!)
// ========================================

// API: Get all desserts (public) - combines static + DB desserts
router.get('/api/desserts', async (req, res) => {
    try {
        const dbDesserts = await Dessert.find({ isActive: true });
        const convertedDbDesserts = dbDesserts.map(doc => doc.toObject());
        const allDesserts = [...desserts, ...convertedDbDesserts];
        res.json(allDesserts);
    } catch (error) {
        console.error('Error fetching desserts (public):', error);
        // Fallback to static desserts if DB fails
        res.json(desserts);
    }
});

// API: Get user orders
router.get('/api/orders', async (req, res) => {
    try {
        const orders = await Order.find().sort({ createdAt: -1 });
        res.json(orders);
    } catch (error) {
        console.error('Error fetching orders:', error);
        res.json([]);
    }
});

router.get('/api/admin/orders', async (req, res) => {
    try {
        const orders = await Order.find().sort({ createdAt: -1 });
        res.json(orders);
    } catch (error) {
        console.error('Error fetching orders:', error);
        res.json([]);
    }
});

router.post('/api/order', async (req, res) => {
    try {
        const orderData = req.body;
        const newOrder = new Order({
            orderId: 'ORD-' + Date.now(),
            customer: orderData.customer,
            address: orderData.address,
            items: orderData.items,
            subtotal: orderData.subtotal,
            deliveryFee: orderData.deliveryFee,
            tax: orderData.tax,
            total: orderData.total,
            paymentMethod: orderData.paymentMethod,
            paymentStatus: (orderData.paymentMethod === 'cash' || orderData.paymentMethod === 'cod') ? 'pending' : 'paid',
            orderStatus: 'pending'
        });

        await newOrder.save();
        
        console.log('Order Saved to MongoDB:');
        console.log('==========================================');
        console.log(`Order ID: ${newOrder.orderId}`);
        console.log(`Customer: ${newOrder.customer.firstName} ${newOrder.customer.lastName}`);
        console.log(`Email: ${newOrder.customer.email}`);
        console.log(`Payment Method: ${newOrder.paymentMethod}`);
        console.log(`Total: ₹${newOrder.total.toFixed(2)}`);
        console.log('==========================================\n');
        
        res.json({ success: true, orderId: newOrder.orderId });
    } catch (error) {
        console.error('Error creating order:', error);
        res.status(500).json({ success: false, error: error.message });
    }
});

// API: Create Razorpay order
router.post('/api/create-razorpay-order', async (req, res) => {
    try {
        const { amount, currency = 'INR', receipt } = req.body;

        if (!amount) {
            return res.status(400).json({ success: false, error: 'Amount is required' });
        }

        const options = {
            amount: Math.round(amount * 100),  // Amount in paise (multiply by 100)
            currency: currency,
            receipt: receipt || 'order_rcptid_' + Date.now()
        };

        console.log('Creating Razorpay order with options:', options);

        const order = await req.app.locals.razorpay.orders.create(options);

        console.log('Razorpay order created successfully:', order.id);

        res.json({
            success: true,
            order_id: order.id,
            amount: order.amount,
            currency: order.currency,
            key_id: req.app.locals.razorpayKeyId || 'rzp_test_R5uZgmenogCy4j'
        });
    } catch (error) {
        console.error('Razorpay order creation error:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to create payment order',
            message: error.message
        });
    }
});

// Verify Razorpay payment - API endpoint for React
router.post('/api/verify-payment', async (req, res) => {
    try {
        const { razorpay_order_id, razorpay_payment_id, razorpay_signature, orderData } = req.body;

        // In production, verify the signature using crypto
        // const crypto = require('crypto');
        // const generated_signature = crypto.createHmac('sha256', 'iou4q509iexeJOlJNCpq7gBd')
        //     .update(razorpay_order_id + '|' + razorpay_payment_id)
        //     .digest('hex');

        // if (generated_signature === razorpay_signature) {
        //     // Payment verified successfully
        // }

        // Save the order to MongoDB
        if (orderData) {
            const newOrder = new Order({
                orderId: 'ORD-' + Date.now(),
                customer: orderData.customer,
                address: orderData.address,
                items: orderData.items,
                subtotal: orderData.subtotal,
                deliveryFee: orderData.deliveryFee,
                tax: orderData.tax,
                total: orderData.total,
                paymentMethod: orderData.paymentMethod,
                paymentStatus: 'paid',
                razorpayOrderId: razorpay_order_id,
                razorpayPaymentId: razorpay_payment_id,
                razorpaySignature: razorpay_signature,
                orderStatus: 'pending'
            });

            await newOrder.save();

            console.log('Payment Verified & Order Saved to MongoDB:');
            console.log('==========================================');
            console.log(`Order ID: ${newOrder.orderId}`);
            console.log(`Customer: ${newOrder.customer.firstName} ${newOrder.customer.lastName}`);
            console.log(`Email: ${newOrder.customer.email}`);
            console.log(`Phone: ${newOrder.customer.phone}`);
            console.log(`Razorpay Payment ID: ${razorpay_payment_id}`);
            console.log(`Total: ₹${newOrder.total.toFixed(2)}`);
            console.log('==========================================\n');

            res.json({
                success: true,
                message: 'Payment verified successfully',
                orderId: newOrder.orderId
            });
        } else {
            res.status(400).json({
                success: false,
                error: 'Order data missing'
            });
        }
    } catch (error) {
        console.error('Payment verification error:', error);
        res.status(500).json({
            success: false,
            error: 'Payment verification failed',
            message: error.message
        });
    }
});

// ========================================
// Voice Ordering Route - AssemblyAI Integration
// ========================================

/**
 * Voice Order Route
 * Handles audio file upload, transcription via AssemblyAI, and order parsing
 * POST /api/voice-order
 * Expects: audio file (multipart/form-data)
 * Returns: { success, transcription, items, message }
 */
router.post('/api/voice-order', upload.single('audio'), async (req, res) => {
    let tempFilePath = null;

    try {
        // Check if audio file was uploaded
        if (!req.file) {
            return res.status(400).json({
                success: false,
                error: 'No audio file provided'
            });
        }

        tempFilePath = req.file.path;
        console.log('Audio file received:', req.file.originalname);
        console.log('Audio file size:', req.file.size, 'bytes');
        console.log('Audio file mimetype:', req.file.mimetype);
        console.log('Audio file path:', tempFilePath);

        // Check if file has content
        if (req.file.size === 0) {
            return res.status(400).json({
                success: false,
                error: 'Audio file is empty'
            });
        }

        // Initialize AssemblyAI client with API key from environment
        const assemblyai = new AssemblyAI({
            apiKey: process.env.ASSEMBLYAI_KEY
        });

        if (!process.env.ASSEMBLYAI_KEY) {
            throw new Error('ASSEMBLYAI_KEY not configured in environment variables');
        }

        // Transcribe the audio file
        console.log('Sending audio to AssemblyAI for transcription...');
        console.log('Using API Key:', process.env.ASSEMBLYAI_KEY ? 'Key present (length: ' + process.env.ASSEMBLYAI_KEY.length + ')' : 'Key missing');
        console.log('Audio file path:', tempFilePath);

        const transcript = await assemblyai.transcripts.transcribe({
            audio: tempFilePath
        });

        console.log('Transcription Status:', transcript.status);
        console.log('Transcription ID:', transcript.id);
        console.log('Transcription Text:', transcript.text);
        console.log('Full Transcript Object:', JSON.stringify(transcript, null, 2));

        if (transcript.status === 'error') {
            throw new Error('Transcription failed: ' + (transcript.error || 'Check AssemblyAI dashboard'));
        }

        if (!transcript.text) {
            throw new Error('Transcription returned empty text. Audio might be too short, silent, or in unsupported format.');
        }

        // Parse the transcription to extract dessert items
        const parsedOrder = parseDessertOrder(transcript.text, desserts);

        // Clean up: Delete the temporary audio file
        await fs.unlink(tempFilePath);
        tempFilePath = null;

        // Return results
        res.json({
            success: true,
            transcription: transcript.text,
            items: parsedOrder.items,
            message: parsedOrder.message,
            confidence: transcript.confidence
        });

    } catch (error) {
        console.error('Voice order processing error:', error);

        // Clean up temp file if it exists
        if (tempFilePath) {
            try {
                await fs.unlink(tempFilePath);
            } catch (cleanupError) {
                console.error('Error cleaning up temp file:', cleanupError);
            }
        }

        res.status(500).json({
            success: false,
            error: 'Failed to process voice order',
            message: error.message
        });
    }
});

/**
 * Parse transcribed text to extract dessert items and quantities
 * Uses fuzzy matching to identify desserts from the menu
 * @param {string} text - Transcribed text from speech
 * @param {Array} availableDesserts - Array of dessert objects
 * @returns {Object} - { items: Array, message: string }
 */
function parseDessertOrder(text, availableDesserts) {
    const items = [];
    const lowerText = text.toLowerCase();

    console.log('Parsing order from text:', text);

    // Common quantity words and their numeric equivalents
    const quantityMap = {
        'one': 1, 'a': 1, 'an': 1,
        'two': 2, 'double': 2, 'couple': 2,
        'three': 3, 'triple': 3,
        'four': 4, 'five': 5, 'six': 6,
        'seven': 7, 'eight': 8, 'nine': 9, 'ten': 10
    };

    // Split text into sentences/phrases
    const phrases = lowerText.split(/[,;.!?]|and|also|plus/);

    availableDesserts.forEach(dessert => {
        const dessertNameLower = dessert.name.toLowerCase();
        const dessertWords = dessertNameLower.split(' ');

        // Check if dessert name or key words appear in text
        let isFound = false;
        let quantity = 1;

        phrases.forEach(phrase => {
            const trimmedPhrase = phrase.trim();

            // Full name match or partial match (at least 2 words for multi-word desserts)
            if (trimmedPhrase.includes(dessertNameLower) ||
                (dessertWords.length > 1 && dessertWords.filter(word => trimmedPhrase.includes(word)).length >= 2) ||
                (dessertWords.length === 1 && trimmedPhrase.includes(dessertWords[0]))) {

                isFound = true;

                // Extract quantity from the phrase
                const words = trimmedPhrase.split(' ');

                // Look for numeric quantities
                for (let i = 0; i < words.length; i++) {
                    const word = words[i];
                    const numericValue = parseInt(word);

                    if (!isNaN(numericValue) && numericValue > 0 && numericValue <= 20) {
                        quantity = numericValue;
                        break;
                    }

                    // Look for word quantities
                    if (quantityMap[word]) {
                        quantity = quantityMap[word];
                        break;
                    }
                }
            }
        });

        if (isFound) {
            items.push({
                _id: dessert._id,
                name: dessert.name,
                price: dessert.price,
                quantity: quantity,
                imageURL: dessert.imageURL
            });
            console.log(`Detected: ${quantity}x ${dessert.name}`);
        }
    });

    let message = '';
    if (items.length === 0) {
        message = 'No desserts detected in your order. Please try again with clearer item names.';
    } else if (items.length === 1) {
        message = `Found 1 item: ${items[0].quantity}x ${items[0].name}`;
    } else {
        message = `Found ${items.length} items: ${items.map(item => `${item.quantity}x ${item.name}`).join(', ')}`;
    }

    return { items, message };
}

// ========================================
// Admin Authentication Routes
// ========================================

const Admin = require('../models/Admin');
const Offer = require('../models/Offer');


// Admin credentials (for demo - in production use proper hashing)
const ADMIN_CREDENTIALS = {
    username: process.env.ADMIN_USERNAME || 'admin',
    password: process.env.ADMIN_PASSWORD || 'sweetcravings123',
    email: process.env.ADMIN_EMAIL || 'admin@sweetcravings.com'
};

// Simple session store (for demo - use Redis/JWT in production)
const adminSessions = new Map();

// Admin Login
router.post('/api/admin/login', async (req, res) => {
    try {
        const { username, password } = req.body;

        // Validate credentials
        if (username === ADMIN_CREDENTIALS.username && password === ADMIN_CREDENTIALS.password) {
            // Generate session token
            const sessionToken = 'admin_' + Date.now() + '_' + Math.random().toString(36).substring(7);

            // Store session
            adminSessions.set(sessionToken, {
                username,
                loginTime: new Date(),
                expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000) // 24 hours
            });

            res.json({
                success: true,
                message: 'Login successful',
                token: sessionToken,
                admin: {
                    username: ADMIN_CREDENTIALS.username,
                    email: ADMIN_CREDENTIALS.email
                }
            });
        } else {
            res.status(401).json({
                success: false,
                error: 'Invalid username or password'
            });
        }
    } catch (error) {
        console.error('Admin login error:', error);
        res.status(500).json({
            success: false,
            error: 'Login failed'
        });
    }
});

// Admin Logout
router.post('/api/admin/logout', (req, res) => {
    const token = req.headers.authorization?.replace('Bearer ', '');

    if (token && adminSessions.has(token)) {
        adminSessions.delete(token);
    }

    res.json({ success: true, message: 'Logged out successfully' });
});

// Verify Admin Session
router.get('/api/admin/verify', (req, res) => {
    const token = req.headers.authorization?.replace('Bearer ', '');

    if (!token) {
        return res.status(401).json({ success: false, error: 'No token provided' });
    }

    const session = adminSessions.get(token);

    if (!session) {
        return res.status(401).json({ success: false, error: 'Invalid session' });
    }

    if (new Date() > session.expiresAt) {
        adminSessions.delete(token);
        return res.status(401).json({ success: false, error: 'Session expired' });
    }

    res.json({
        success: true,
        admin: {
            username: session.username,
            email: ADMIN_CREDENTIALS.email
        }
    });
});

// Middleware to verify admin token
const verifyAdminToken = (req, res, next) => {
    const token = req.headers.authorization?.replace('Bearer ', '');

    if (!token) {
        return res.status(401).json({ success: false, error: 'Authentication required' });
    }

    const session = adminSessions.get(token);

    if (!session || new Date() > session.expiresAt) {
        adminSessions.delete(token);
        return res.status(401).json({ success: false, error: 'Session expired' });
    }

    req.admin = session;
    next();
};

// ========================================
// Admin Dessert Management Routes
// ========================================

// Configure multer for dessert image uploads
const dessertImageStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'public/images/uploads/');
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const ext = file.originalname.split('.').pop();
        cb(null, 'dessert-' + uniqueSuffix + '.' + ext);
    }
});

const dessertImageUpload = multer({
    storage: dessertImageStorage,
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
    fileFilter: (req, file, cb) => {
        if (file.mimetype.startsWith('image/')) {
            cb(null, true);
        } else {
            cb(new Error('Only image files are allowed'));
        }
    }
});

// Get all desserts (admin view - includes inactive)
router.get('/api/admin/desserts', verifyAdminToken, async (req, res) => {
    try {
        // Fetch desserts from MongoDB
        const dbDesserts = await Dessert.find({});
        // Convert to plain objects
        const convertedDbDesserts = dbDesserts.map(doc => doc.toObject());
        // Combine with static desserts
        const allDesserts = [...desserts, ...convertedDbDesserts];
        res.json(allDesserts);
    } catch (error) {
        console.error('Error fetching desserts:', error);
        res.json(desserts);
    }
});

// Add new dessert
router.post('/api/admin/desserts', verifyAdminToken, async (req, res) => {
    try {
        const { name, description, price, originalPrice, discount, category, imageURL, rating, reviews } = req.body;

        const newDessert = new Dessert({
            name,
            description,
            price: parseFloat(price),
            originalPrice: parseFloat(originalPrice) || parseFloat(price),
            discount: parseInt(discount) || 0,
            rating: parseFloat(rating) || 0,
            reviews: parseInt(reviews) || 0,
            imageURL: imageURL || '/images/default-dessert.jpg',
            category,
            isActive: true
        });

        await newDessert.save();

        res.json({
            success: true,
            message: 'Dessert added successfully',
            dessert: newDessert
        });
    } catch (error) {
        console.error('Error adding dessert:', error);
        res.status(500).json({ success: false, error: error.message });
    }
});

// Update dessert
router.put('/api/admin/desserts/:id', verifyAdminToken, async (req, res) => {
    try {
        const { id } = req.params;
        const updates = req.body;

        // Try to update in MongoDB
        let dessert = await Dessert.findByIdAndUpdate(id, updates, { new: true });

        if (!dessert) {
            // Fallback to in-memory desserts
            const index = desserts.findIndex(d => d._id === id);
            if (index === -1) {
                return res.status(404).json({ success: false, error: 'Dessert not found' });
            }
            desserts[index] = {
                ...desserts[index],
                ...updates,
                price: updates.price ? parseFloat(updates.price) : desserts[index].price,
                originalPrice: updates.originalPrice ? parseFloat(updates.originalPrice) : desserts[index].originalPrice,
                discount: updates.discount !== undefined ? parseInt(updates.discount) : desserts[index].discount
            };
            dessert = desserts[index];
        }

        res.json({
            success: true,
            message: 'Dessert updated successfully',
            dessert
        });
    } catch (error) {
        console.error('Error updating dessert:', error);
        res.status(500).json({ success: false, error: error.message });
    }
});

// Delete dessert
router.delete('/api/admin/desserts/:id', verifyAdminToken, async (req, res) => {
    try {
        const { id } = req.params;

        // Try to delete from MongoDB
        let deleted = await Dessert.findByIdAndDelete(id);

        if (!deleted) {
            // Fallback to in-memory desserts
            const index = desserts.findIndex(d => d._id === id);
            if (index === -1) {
                return res.status(404).json({ success: false, error: 'Dessert not found' });
            }
            deleted = desserts.splice(index, 1)[0];
        }

        res.json({
            success: true,
            message: 'Dessert deleted successfully',
            dessert: deleted
        });
    } catch (error) {
        console.error('Error deleting dessert:', error);
        res.status(500).json({ success: false, error: error.message });
    }
});

// Upload dessert image
router.post('/api/admin/upload-image', verifyAdminToken, dessertImageUpload.single('image'), (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ success: false, error: 'No image uploaded' });
        }

        const imageURL = '/images/uploads/' + req.file.filename;

        res.json({
            success: true,
            message: 'Image uploaded successfully',
            imageURL
        });
    } catch (error) {
        console.error('Error uploading image:', error);
        res.status(500).json({ success: false, error: error.message });
    }
});

// ========================================
// Admin Offers Management Routes
// ========================================

// In-memory offers store (for demo)
let offers = [];

// Get all offers
router.get('/api/admin/offers', verifyAdminToken, (req, res) => {
    res.json(offers);
});

// Get active offers (public)
router.get('/api/offers', (req, res) => {
    const now = new Date();
    const activeOffers = offers.filter(offer =>
        offer.isActive &&
        new Date(offer.startDate) <= now &&
        new Date(offer.endDate) >= now
    );
    res.json(activeOffers);
});

// Create offer
router.post('/api/admin/offers', verifyAdminToken, (req, res) => {
    try {
        const { title, description, discountType, discountValue, code, applicableCategories, startDate, endDate, minOrderAmount, maxDiscount } = req.body;

        const newOffer = {
            _id: 'offer_' + Date.now(),
            title,
            description: description || '',
            discountType,
            discountValue: parseFloat(discountValue),
            code: code ? code.toUpperCase() : null,
            applicableCategories: applicableCategories || ['All'],
            startDate: new Date(startDate),
            endDate: new Date(endDate),
            minOrderAmount: parseFloat(minOrderAmount) || 0,
            maxDiscount: maxDiscount ? parseFloat(maxDiscount) : null,
            isActive: true,
            usedCount: 0,
            createdAt: new Date()
        };

        offers.push(newOffer);

        res.json({
            success: true,
            message: 'Offer created successfully',
            offer: newOffer
        });
    } catch (error) {
        console.error('Error creating offer:', error);
        res.status(500).json({ success: false, error: error.message });
    }
});

// Update offer
router.put('/api/admin/offers/:id', verifyAdminToken, (req, res) => {
    try {
        const { id } = req.params;
        const updates = req.body;

        const index = offers.findIndex(o => o._id === id);

        if (index === -1) {
            return res.status(404).json({ success: false, error: 'Offer not found' });
        }

        offers[index] = {
            ...offers[index],
            ...updates,
            discountValue: updates.discountValue ? parseFloat(updates.discountValue) : offers[index].discountValue,
            startDate: updates.startDate ? new Date(updates.startDate) : offers[index].startDate,
            endDate: updates.endDate ? new Date(updates.endDate) : offers[index].endDate
        };

        res.json({
            success: true,
            message: 'Offer updated successfully',
            offer: offers[index]
        });
    } catch (error) {
        console.error('Error updating offer:', error);
        res.status(500).json({ success: false, error: error.message });
    }
});

// Delete offer
router.delete('/api/admin/offers/:id', verifyAdminToken, (req, res) => {
    try {
        const { id } = req.params;
        const index = offers.findIndex(o => o._id === id);

        if (index === -1) {
            return res.status(404).json({ success: false, error: 'Offer not found' });
        }

        const deleted = offers.splice(index, 1)[0];

        res.json({
            success: true,
            message: 'Offer deleted successfully',
            offer: deleted
        });
    } catch (error) {
        console.error('Error deleting offer:', error);
        res.status(500).json({ success: false, error: error.message });
    }
});

// ========================================
// Admin Order Management Routes (Enhanced)
// ========================================

// Update order status
router.put('/api/admin/orders/:orderId', async (req, res) => {
    try {
        const { orderId } = req.params;
        const { orderStatus, paymentStatus } = req.body;

        const order = await Order.findOneAndUpdate(
            { orderId },
            {
                orderStatus: orderStatus,
                paymentStatus: paymentStatus,
                updatedAt: new Date()
            },
            { new: true }
        );

        if (!order) {
            return res.status(404).json({ success: false, error: 'Order not found' });
        }

        res.json({
            success: true,
            message: 'Order updated successfully',
            order
        });
    } catch (error) {
        console.error('Error updating order:', error);
        res.status(500).json({ success: false, error: error.message });
    }
});

// Delete order
router.delete('/api/admin/orders/:orderId', async (req, res) => {
    try {
        const { orderId } = req.params;

        const order = await Order.findOneAndDelete({ orderId });

        if (!order) {
            return res.status(404).json({ success: false, error: 'Order not found' });
        }

        res.json({
            success: true,
            message: 'Order deleted successfully'
        });
    } catch (error) {
        console.error('Error deleting order:', error);
        res.status(500).json({ success: false, error: error.message });
    }
});

module.exports = router;

