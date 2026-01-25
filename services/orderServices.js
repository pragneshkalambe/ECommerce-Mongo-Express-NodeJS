const Order = require('../models/order');

exports.createOrder = async (order) => {
    console.log("in services:",order);
    return await Order.create(order);
};