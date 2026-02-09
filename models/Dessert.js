const mongoose = require('mongoose');

const DessertSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true,
        min: 0
    },
    originalPrice: {
        type: Number,
        min: 0
    },
    discount: {
        type: Number,
        default: 0,
        min: 0,
        max: 100
    },
    rating: {
        type: Number,
        default: 0,
        min: 0,
        max: 5
    },
    reviews: {
        type: Number,
        default: 0
    },
    imageURL: {
        type: String,
        default: '/images/default-dessert.jpg'
    },
    category: {
        type: String,
        required: true,
        enum: ['Cakes', 'Cookies', 'Pies', 'Italian', 'Brownies', 'Tarts', 'Ice Cream']
    },
    isActive: {
        type: Boolean,
        default: true
    },
    isFeatured: {
        type: Boolean,
        default: false
    },
    offer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Offer',
        default: null
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});

// Update the updatedAt timestamp before saving
DessertSchema.pre('save', function (next) {
    this.updatedAt = Date.now();
    next();
});

module.exports = mongoose.model('Dessert', DessertSchema);
