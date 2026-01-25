// const product = require("../models/product");
const Product = require("../models/product");


let products = Product.find();
// const cartProduct = {
//   cart: [], cartItems: 0, price: 0,
//   ...products
// }
exports.getProducts = async (productIds) => {
  return Product.find({
    _id: { $in: productIds }
  });
};

// exports.AddToCart = async (product, quantity) => {
//   // let matchedProduct = _productRepository.Products.FirstOrDefault(p => p.ProductID == product.ProductID);
//   // let matchedProduct = await Product.find({_id : product.ProductID});

//   //   if (matchedProduct != null) {
//   //     GetCart().AddToCart(matchedProduct, 1);
//   //   }


//   //   return RedirectToAction("Index", new { returnUrl });

//   let prodExisting = cartProduct.cart.find(item => item._id === product._id)
//   if (prodExisting) {
//     prodExisting.quantity += quantity;
//   }
//   else {

//     cartProduct.cart = [...cartProduct.cart,]
//   }


// }

// exports.updateCart = async (product, quantity) => {

// }

// exports.removeFromCart = async (product) => {

// }

// exports.clearCart = async (params) => {

// }