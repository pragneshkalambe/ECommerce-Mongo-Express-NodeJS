const order = require('../models/order');
const orderServices = require('../services/orderServices');

exports.createOrder = async (order) => {
  let placeOrder = await orderServices.createOrder(order);
  if (!placeOrder) {
    return res.status(400).json({
      message: "error placing order"
    });
  };
  console.log("in create order : ", placeOrder);
  return placeOrder;
};

exports.attachRazorpayOrderId = async (orderId, razorpayOrderId) => {
  return await order.updateOne(
    { _id: orderId },
    { $set: { razorpayOrderId: razorpayOrderId } }
  );
};

exports.updatePaymentStatus = async (id, data) => {
  return await order.updateOne(
    { _id: id },
    {
      $set: {
        paymentStatus: data.paymentStatus,
        orderStatus: data.orderStatus,
        razorpayPaymentId: data.razorpayPaymentId
      }
    }
  )
};

exports.getOrdersById = async (id) => {
  return await order.find({ customer: id })
    .sort({ createdAt: -1 }).lean();
};