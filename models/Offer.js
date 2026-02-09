const mongoose = require('mongoose');

const OfferSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        default: ''
    },
    discountType: {
        type: String,
        enum: ['percentage', 'fixed'],
        required: true
    },
    discountValue: {
        type: Number,
        required: true,
        min: 0
    },
    minOrderAmount: {
        type: Number,
        default: 0
    },
    maxDiscount: {
        type: Number,
        default: null
    },
    code: {
        type: String,
        unique: true,
        sparse: true,
        uppercase: true,
        trim: true
    },
    applicableCategories: [{
        type: String,
        enum: ['Cakes', 'Cookies', 'Pies', 'Italian', 'Brownies', 'Tarts', 'Ice Cream', 'All']
    }],
    startDate: {
        type: Date,
        required: true
    },
    endDate: {
        type: Date,
        required: true
    },
    festivalAnimation: {
        type: String,
        enum: ['none', 'fireworks', 'snowfall', 'confetti', 'hearts', 'diwali_lights', 'holi_colors', 'balloons'],
        default: 'none'
    },
    festivalType: {
        type: String,
        enum: ['none', 'diwali', 'holi', 'raksha_bandhan', 'janmashtami', 'ganesh_chaturthi', 'navratri', 'dussehra', 'pongal', 'onam', 'maha_shivratri', 'ugadi', 'rama_navami', 'krishna_jayanthi', 'christmas', 'new_year', 'valentines'],
        default: 'none'
    },
    isActive: {
        type: Boolean,
        default: true
    },
    usageLimit: {
        type: Number,
        default: null
    },
    usedCount: {
        type: Number,
        default: 0
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

// Check if offer is currently valid
OfferSchema.methods.isValid = function () {
    const now = new Date();
    return this.isActive &&
        this.startDate <= now &&
        this.endDate >= now &&
        (this.usageLimit === null || this.usedCount < this.usageLimit);
};

module.exports = mongoose.model('Offer', OfferSchema);
