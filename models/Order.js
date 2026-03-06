const mongoose = require('mongoose');

const itemSchema = new mongoose.Schema({
    productId: Number,
    quantity: Number,
    price: Number
});

const orderSchema = new mongoose.Schema({
    orderId: {
        type: String,
        required: true,
        unique: true
    },
    value: {
        type: Number,
        required: true
    },
    creationDate: {
        type: Date,
        required: true
    },
    items: [itemSchema]
});

module.exports = mongoose.model('Order', orderSchema);
