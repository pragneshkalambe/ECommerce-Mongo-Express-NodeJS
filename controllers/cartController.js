const { Error } = require('mongoose');
const Product = require("../models/product");
const cartServices = require('../services/cartServices');

// cartController.js
exports.getproductsInCart = async (cart) => {
  // extract only ids
  const productIds = cart.map(item => item.productId);

  // fetch all products
  const products = await cartServices.getProducts(productIds);

  // merge qty into product
  const merged = products.map(prod => {
    const cartItem = cart.find(
      item => item.productId.toString() === prod._id.toString()
    );
    
    //test
    console.log("cartItem : ",cartItem);
    return {
      ...prod.toObject(),
      qty: cartItem.qty,
      total: cartItem.qty * prod.price
    };
  });

  return merged;
};


exports.getDailyDeal = async(req,res) => {
   let products = await Product.aggregate([
      {$sample : {size:3}}
   ]);
   // console.log("Products filtered",products);
   products.forEach(product => {
      product.price = product.price - (product.price * 0.3)
      // console.log("product after calculation:",product);
   });
   return products;
}



