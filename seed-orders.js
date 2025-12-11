const mongoose = require('mongoose');
const Order = require('./models/Order');

// MongoDB Connection
const mongoURI = 'mongodb://localhost:27017/sweetcravings';
mongoose.connect(mongoURI)
.then(() => console.log('MongoDB Connected for seeding...'))
.catch(err => console.log('MongoDB Connection Error:', err));

// Sample orders data with different statuses
const sampleOrders = [
    {
        orderId: 'ORD-1730001001',
        customer: {
            firstName: 'Rajesh',
            lastName: 'Kumar',
            email: 'rajesh.kumar@email.com',
            phone: '9876543210'
        },
        address: {
            street: '123 MG Road',
            city: 'Bangalore',
            zipCode: '560001',
            instructions: 'Ring the doorbell twice'
        },
        items: [
            {
                id: '1',
                name: 'Chocolate Cake',
                price: 180.00,
                quantity: 2,
                image: '/images/cakes/chocolate-cake.jpg'
            },
            {
                id: '6',
                name: 'Red Velvet Cake',
                price: 220.00,
                quantity: 1,
                image: '/images/cakes/red velvet-cake.jpg'
            }
        ],
        subtotal: 580.00,
        deliveryFee: 0,
        tax: 104.40,
        total: 684.40,
        paymentMethod: 'razorpay',
        paymentStatus: 'paid',
        razorpayOrderId: 'order_sample_001',
        razorpayPaymentId: 'pay_sample_001',
        orderStatus: 'delivered',
        createdAt: new Date('2025-10-25T10:30:00'),
        updatedAt: new Date('2025-10-28T16:45:00')
    },
    {
        orderId: 'ORD-1730001002',
        customer: {
            firstName: 'Priya',
            lastName: 'Sharma',
            email: 'priya.sharma@email.com',
            phone: '9123456789'
        },
        address: {
            street: '456 Park Street',
            city: 'Mumbai',
            zipCode: '400001',
            instructions: 'Call before delivery'
        },
        items: [
            {
                id: '11',
                name: 'Chocolate Chip Cookies',
                price: 120.00,
                quantity: 3,
                image: '/images/cookies/chocolate-chip-cookies.jpg'
            }
        ],
        subtotal: 360.00,
        deliveryFee: 50.00,
        tax: 64.80,
        total: 474.80,
        paymentMethod: 'razorpay',
        paymentStatus: 'paid',
        razorpayOrderId: 'order_sample_002',
        razorpayPaymentId: 'pay_sample_002',
        orderStatus: 'shipped',
        createdAt: new Date('2025-10-29T14:20:00'),
        updatedAt: new Date('2025-10-30T09:15:00')
    },
    {
        orderId: 'ORD-1730001003',
        customer: {
            firstName: 'Amit',
            lastName: 'Patel',
            email: 'amit.patel@email.com',
            phone: '9988776655'
        },
        address: {
            street: '789 Gandhi Nagar',
            city: 'Delhi',
            zipCode: '110001',
            instructions: 'Leave at security desk'
        },
        items: [
            {
                id: '21',
                name: 'Apple Pie',
                price: 150.00,
                quantity: 1,
                image: '/images/pies/apple-pie.jpg'
            },
            {
                id: '31',
                name: 'Tiramisu',
                price: 250.00,
                quantity: 1,
                image: '/images/italian/tiramisu-italian.jpg'
            }
        ],
        subtotal: 400.00,
        deliveryFee: 50.00,
        tax: 72.00,
        total: 522.00,
        paymentMethod: 'cash',
        paymentStatus: 'pending',
        orderStatus: 'processing',
        createdAt: new Date('2025-10-30T11:45:00'),
        updatedAt: new Date('2025-10-30T11:45:00')
    },
    {
        orderId: 'ORD-1730001004',
        customer: {
            firstName: 'Sneha',
            lastName: 'Reddy',
            email: 'sneha.reddy@email.com',
            phone: '9876501234'
        },
        address: {
            street: '321 Beach Road',
            city: 'Chennai',
            zipCode: '600001',
            instructions: 'Apartment B-204'
        },
        items: [
            {
                id: '41',
                name: 'Classic Brownies',
                price: 100.00,
                quantity: 4,
                image: '/images/brownies/classic-brownies.jpg'
            },
            {
                id: '51',
                name: 'Fruit Tart',
                price: 180.00,
                quantity: 2,
                image: '/images/tarts/fruit-tart.jpeg'
            }
        ],
        subtotal: 760.00,
        deliveryFee: 0,
        tax: 136.80,
        total: 896.80,
        paymentMethod: 'razorpay',
        paymentStatus: 'paid',
        razorpayOrderId: 'order_sample_004',
        razorpayPaymentId: 'pay_sample_004',
        orderStatus: 'delivered',
        createdAt: new Date('2025-10-24T09:15:00'),
        updatedAt: new Date('2025-10-27T18:30:00')
    },
    {
        orderId: 'ORD-1730001005',
        customer: {
            firstName: 'Vikram',
            lastName: 'Singh',
            email: 'vikram.singh@email.com',
            phone: '9123450987'
        },
        address: {
            street: '567 Lake View',
            city: 'Pune',
            zipCode: '411001',
            instructions: 'Gate code: 1234'
        },
        items: [
            {
                id: '1',
                name: 'Chocolate Cake',
                price: 180.00,
                quantity: 1,
                image: '/images/cakes/chocolate-cake.jpg'
            }
        ],
        subtotal: 180.00,
        deliveryFee: 50.00,
        tax: 32.40,
        total: 262.40,
        paymentMethod: 'razorpay',
        paymentStatus: 'paid',
        razorpayOrderId: 'order_sample_005',
        razorpayPaymentId: 'pay_sample_005',
        orderStatus: 'pending',
        createdAt: new Date('2025-10-30T15:00:00'),
        updatedAt: new Date('2025-10-30T15:00:00')
    },
    {
        orderId: 'ORD-1730001006',
        customer: {
            firstName: 'Anita',
            lastName: 'Desai',
            email: 'anita.desai@email.com',
            phone: '9876509876'
        },
        address: {
            street: '890 Temple Street',
            city: 'Hyderabad',
            zipCode: '500001',
            instructions: 'First floor, red door'
        },
        items: [
            {
                id: '16',
                name: 'Oatmeal Raisin Cookies',
                price: 110.00,
                quantity: 2,
                image: '/images/cookies/oatmeal raisin-cookies.jpg'
            },
            {
                id: '26',
                name: 'Blueberry Pie',
                price: 170.00,
                quantity: 1,
                image: '/images/pies/Blueberry-Pies.jpg'
            }
        ],
        subtotal: 390.00,
        deliveryFee: 50.00,
        tax: 70.20,
        total: 510.20,
        paymentMethod: 'razorpay',
        paymentStatus: 'paid',
        razorpayOrderId: 'order_sample_006',
        razorpayPaymentId: 'pay_sample_006',
        orderStatus: 'delivered',
        createdAt: new Date('2025-10-26T13:20:00'),
        updatedAt: new Date('2025-10-29T11:00:00')
    },
    {
        orderId: 'ORD-1730001007',
        customer: {
            firstName: 'Rohit',
            lastName: 'Verma',
            email: 'rohit.verma@email.com',
            phone: '9988112233'
        },
        address: {
            street: '234 Market Road',
            city: 'Kolkata',
            zipCode: '700001',
            instructions: 'Near big banyan tree'
        },
        items: [
            {
                id: '36',
                name: 'Cannoli',
                price: 200.00,
                quantity: 3,
                image: '/images/italian/cannoli-italian.jpg'
            }
        ],
        subtotal: 600.00,
        deliveryFee: 0,
        tax: 108.00,
        total: 708.00,
        paymentMethod: 'cash',
        paymentStatus: 'pending',
        orderStatus: 'shipped',
        createdAt: new Date('2025-10-29T16:40:00'),
        updatedAt: new Date('2025-10-30T08:20:00')
    },
    {
        orderId: 'ORD-1730001008',
        customer: {
            firstName: 'Meera',
            lastName: 'Nair',
            email: 'meera.nair@email.com',
            phone: '9123451111'
        },
        address: {
            street: '678 Hill View',
            city: 'Kochi',
            zipCode: '682001',
            instructions: 'Delivery between 2-4 PM'
        },
        items: [
            {
                id: '11',
                name: 'Black Forest Cake',
                price: 200.00,
                quantity: 1,
                image: '/images/cakes/black forest-cake.jpg'
            },
            {
                id: '56',
                name: 'Lemon Tart',
                price: 160.00,
                quantity: 2,
                image: '/images/tarts/lemon-tart.jpg'
            }
        ],
        subtotal: 520.00,
        deliveryFee: 0,
        tax: 93.60,
        total: 613.60,
        paymentMethod: 'razorpay',
        paymentStatus: 'paid',
        razorpayOrderId: 'order_sample_008',
        razorpayPaymentId: 'pay_sample_008',
        orderStatus: 'delivered',
        createdAt: new Date('2025-10-23T10:00:00'),
        updatedAt: new Date('2025-10-26T14:30:00')
    }
];

// Insert sample orders
async function seedOrders() {
    try {
        // Clear existing orders
        await Order.deleteMany({});
        console.log('Cleared existing orders');

        // Insert sample orders
        const result = await Order.insertMany(sampleOrders);
        console.log(`✅ Successfully added ${result.length} sample orders!`);
        
        console.log('\n📊 Order Summary:');
        console.log(`   - Delivered: ${sampleOrders.filter(o => o.orderStatus === 'delivered').length}`);
        console.log(`   - Shipped: ${sampleOrders.filter(o => o.orderStatus === 'shipped').length}`);
        console.log(`   - Processing: ${sampleOrders.filter(o => o.orderStatus === 'processing').length}`);
        console.log(`   - Pending: ${sampleOrders.filter(o => o.orderStatus === 'pending').length}`);
        console.log(`\n💰 Total Revenue: ₹${sampleOrders.reduce((sum, o) => sum + o.total, 0).toFixed(2)}`);
        
        console.log('\n🌐 View orders at:');
        console.log('   - Admin Dashboard: http://localhost:5000/admin');
        console.log('   - Orders Page: http://localhost:5000/orders');
        
        process.exit(0);
    } catch (error) {
        console.error('Error seeding orders:', error);
        process.exit(1);
    }
}

// Run the seeding
seedOrders();
