const mongoose = require('mongoose');
const Category = require('./Category');
const productSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        required: true,
        trim: true
    },
    mrpPrice: {
        type: Number,
        required: true
    },
    sellingPrice: {
        type: Number,
        required: true
    },
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category',
        required: true
    },
    stock: {
        type: Number,
        required: true
    },
    images: {
        type: [String],
        required: true
    },
    sellerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Seller',
        required: true
    },
    discountPercentage: {
        type: Number,
        required: true
    },
    color: {
        type: String,
        trim: true
    },
    size: {
        type: String,
        trim: true
    }
});

const Product = mongoose.model('Product', productSchema);
module.exports = Product;
