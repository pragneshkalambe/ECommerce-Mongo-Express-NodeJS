const mongoose = require('mongoose');
const { required, ref } = require('joi');

const orderItemsSchema = new mongoose.Schema({
    product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "product",
        required: true
    },
    name: String,
    price: String,
    quantity: {
        type: Number,
        required: true
    },
    image: {
        type: String,
        required : true
    }

});

const orderSchema = new mongoose.Schema({
    customer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Customer",
        required: true
    },
    items: [orderItemsSchema],
    shippingAddress: {
        country: String,
        state: String,
        city: String,
        zipcode: String
    },
    orderStatus: {
        type: String,
        //  required : true,
        enum: ["Placed", "Shipped", "Delivered", "Cancelled"],
        default: "Placed"
    },
    paymentStatus: {
        type: String,
        // required : true,
        enum: ["Pending", "Paid", "Failed"],
        default: "Pending"
    },
    paymentMethod: {
        type: String,
        required: true,
        enum: ["Cash on delivery", "Online"]
    },
    totalAmount: {
        type: Number,
        required: true
    },
    razorpayOrderId: {
        type: String
    }

}, { timestamps: true });

module.exports = mongoose.model("Order", orderSchema);