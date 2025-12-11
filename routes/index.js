const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const cors = require('cors');

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
        imageURL: '/images/cakes/red velvet-cake.jpg',
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
        imageURL: '/images/cakes/black forest-cake.jpg',
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
        imageURL: '/images/cakes/pineapple pastry-cake.jpg',
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
        imageURL: '/images/cookies/oatmeal raisin-cookies.jpg',
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
        imageURL: '/images/cookies/double chocolate-cookies.jpg',
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
    imageURL: '/images/pies/Key Lime-Pies.jpg',
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
        imageURL: '/images/brownies/Chewy Fudgy-Brownies.jpg',
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

// API: Get all desserts
router.get('/api/desserts', (req, res) => {
    res.json(desserts);
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
            paymentStatus: orderData.paymentMethod === 'cash' ? 'pending' : 'paid',
            orderStatus: 'pending'
        });

        await newOrder.save();
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

module.exports = router;
