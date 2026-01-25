const database = require("./config/db");
const dotenv = require("dotenv");
dotenv.config();
database();

const express = require("express");
const app = express();
const path = require('path');
const handlebars = require('express-handlebars');
const session = require('express-session');
// const jwt = require('jsonwebtoken');
const productController = require('./controllers/productController');
const productServices = require('./services/productServices');
const cartcontroller = require('./controllers/cartController');
const customerController = require('./controllers/customerController');
const orderController = require('./controllers/orderController');

//for google login
// const passport = require("passport");
// require("./config/passport");



// const razorpay = require('razorpay');
const razorpay = require("./config/razorpay");

const crypto = require("crypto");


const { validateSignup, validateLogin } = require("./middleware/validation");

const { Server } = require('socket.io');
const http = require('http');


// const database = require("./config/db");
// const dotenv = require("dotenv");
// dotenv.config();
// database();


const bodyParser = require("body-parser");

//for product
const product = require("./models/product");

//for ejs
// const app2 = express();
const ejsRoutes = require("./routes/admin");

//port
// const adminPort = 3001
// app2.listen(adminPort, () => {
//   console.log(`Server listening on port : ${adminPort}`);
// });

// app2.get("/", (req, res) => {
//   console.log("Welcome to Admin panel");
//   //   res.send("Welcome to Admin panel");
// });

//for users
const userRoutes = require("./routes/users");

//for products
const productRoutes = require("./routes/products");
const { forIn, truncate, forEach } = require("lodash");
// const { slideshare, spaceShuttle } = require("fontawesome");

//for cart
const cartRoutes = require("./routes/cart");
const { custom } = require("joi");
// const { receipt } = require("fontawesome");

//for admin
const adminRoutes = require("./routes/admin");

//validation routes
// const userSchemas = require("../eCommerce/middleware/validation");

//database routes
// let dbRoutes = require("./config/db");

app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));

// console.log("Dirname : ",__dirname);

app.engine("handlebars", handlebars.create({
  defaultLayout: "app",
  layoutsDir: "./views/layouts/",
  partialsDir: "./views/partials/",
  helpers: {
    truncate_Desc: function (text, length) {
      //if no text received
      if (!text) {
        return "";
      }

      if (text.length <= length) return text;
      return text.substring(0, length) + "..."
    },
    cartEmpty: function (value) {
      return value === 0
    }
  }
}).engine);


app.set('view engine', 'handlebars');
// Optionally, specify the directory where your EJS templates are located
app.set('views', './views');

//linking section
app.use(express.static(path.join(__dirname, 'public')))
// app.use(express.static(path.join(__dirname, 'images')))
// app.use(express.static(path.join(__dirname, 'home')))

app.use('/uploads', express.static('uploads'));


// app.use("/node_modules", express.static(path.join(__dirname, "node_modules")));
// app.use('/node_modules/bootstrap-icons',
//   express.static(path.join(__dirname, 'node_modules/bootstrap-icons/font'))
// );
// app.use("/css",express.static(path.join(__dirname,"/node_modules/bootstrap/dist/css")));

//from gpt
// Bootstrap CSS + JS
// Bootstrap CSS
app.use("/css", express.static(path.join(__dirname, "node_modules/bootstrap/dist/css")));

// Bootstrap JS
app.use("/js", express.static(path.join(__dirname, "node_modules/bootstrap/dist/js")));

// Bootstrap Icons
app.use("/icons", express.static(path.join(__dirname, "node_modules/bootstrap-icons/font")));

// FontAwesome
app.use("/fa", express.static(path.join(__dirname, "node_modules/@fortawesome/fontawesome-free")));

app.use("/mdb", express.static(path.join(__dirname, "node_modules/mdb-ui-kit")));

//toastify.js

app.use("/toastify", express.static(path.join(__dirname, "node_modules/toastify-js/src")));
// app.use('/icons',
//   express.static(path.join(__dirname, 'node_modules/@fortawesome/fontawesome-free'))
// );

//REST API section
//routes path for users
// app.use("/api/users", userRoutes);

// //routes path for products
// app.use("/api/products", productRoutes);
// app.use("/cart", cartRoutes);

//routes path for admin
// app.use("/api/admin",adminRoutes);

// app.use(session({
//   secret: "pragnesh",
//   resave: false,
//   saveUninitialized: false,
//   cookie: { maxAge: 5 * 60 * 1000 }//set 5 minutes
// }));

//for cart session
const sessionMiddleware = session({
  secret: "cart-session",
  resave: false,
  saveUninitialized: true,
  cookie: { maxAge: 10 * 60 * 1000 }//set 5 minutes
});

app.use(sessionMiddleware);

// app.use((req, res, next) => {
//   res.locals.cartCount = req.session.cart
//     ? req.session.cart.length
//     : 0;
//   next();
// });

// const passport = require("passport");
// require("./config/passport");

// app.use(passport.initialize());
// app.use(passport.session());

const authRoutes = require("./routes/auth");
const customer = require("./models/customer");
app.use("/auth", authRoutes);

//routes path for admin
app.use("/api/admin",adminRoutes);

//routes path for users
app.use("/api/users", userRoutes);

//routes path for products
app.use("/api/products", productRoutes);




app.use((req, res, next) => {
  res.locals.cartCount = req.session.cart?.length || 0;
  next();
});

app.use((req, res, next) => {
  res.locals.success = req.session.success;
  res.locals.errorMsg = req.session.errorMsg;

  //delete session data
  delete req.session.success;
  delete req.session.errorMsg;

  next();
});

//webapp
app.get("/", async (req, res) => {
  try {
    // throw new Error("Testing");
    let products = await productController.getProducts();
    // console.log("get products : ",products);
    if (products) {
      products.hasError = false;
      res.render(__dirname + "/views/home/home.handlebars", { allproducts: products });
    }

  } catch (error) {
    console.log("In app", error);
    res.render(
      __dirname + "/views/home/home.handlebars",
      { allproducts: { hasError: true, errorMsg: error.message } }
    );

  }

});


app.get("/details", async (req, res) => {
  let details;
  try {
    let id = req.query.id;
    console.log("In app.js :", id);
    details = await productServices.getProductServ(id);
    console.log("Details : ", details);
    // details.hasError = false;
    let imagePaths = [];
    for (const field in details.image) {
      imagePaths[field] = details.image[field];
      // console.log("paths in details",details.image[field]);
    }
    console.log(details);
    res.render(__dirname + "/views/home/details.handlebars", { prodDetails: details, imagePaths: imagePaths });

  } catch (error) {
    // details.hasError = true;
    // res.render(__dirname + "views/home/details.handlebars",{prodDetails : details});
    console.log("Error in details : ", error.message);
  }
  // let id = sessionStorage.getItem("productId");

})

app.get("/searchBy", async (req, res) => {
  let name = req.query.name;
  console.log("Name:", name);
  let filterByName = await productController.searchBy(req, res);
  res.json(
    {
      product: filterByName
    }
  );
});

app.get("/category", async (req, res) => {
  try {

    let category = req.query.data;
    let filter = req.query.filterBy;
    console.log("Category : ", category);
    let filteredProducts = await productController.filterBy(category, filter);
    console.log("in app.js : ", filteredProducts);

    if (filteredProducts.filterBy === "category") {
      if (filteredProducts) {
        filteredProducts.hasError = false;
        res.render(__dirname + "/views/partials/filterProducts.handlebars", { allproducts: filteredProducts });
      }

    }

    else if (filteredProducts.filterBy === "products") {
      if (filteredProducts) {
        filteredProducts.hasError = false;
        res.render(__dirname + "/views/partials/_search.handlebars", { allproducts: filteredProducts });
      }
    }

  } catch (error) {
    res.render(__dirname + "/views/partials/filterProducts.handlebars", { hasError: true, errorMsg: error.message });
  }

});


// app.get("/signUp", (req, res) => {
//   res.render("customer/signup");
// });



app.get("/signUp", async (req, res) => {
  try {

    res.render("./customer/signup.handlebars");

  } catch (error) {
    console.log("error: ", error.message);
  }

});

app.post("/signUp", validateSignup, customerController.custSignUp);

// app.post("/signUp", async (req, res) => {
//   try {

//     console.log("In signup post", await req.body);
//     if (!req.body) {
//       return
//     }
//     let userData = {
//       name,
//       email,
//       password,
//       mobile,
//       country,
//       state,
//       city,
//       zipcode
//     } = req.body;
//     console.log("user data:", userData);

//     let customer = await customerController.custSignUp(userData);
//     if (customer) {
//       res.status(201).json({
//         success: true
//       })
//     }

//   } catch (error) {
//     console.log("error: ", error.message);
//   }

// });

// Handlebars.registerHelper('truncate', function(text, maxLength) {
//   if (text && text.length > maxLength) {
//     return new Handlebars.SafeString(text.substring(0, maxLength) + '...');
//   }
//   return new Handlebars.SafeString(text);
// });

// app.listen(port, () => {
//   console.log("running on port:", port);
// });

const server = http.createServer(app);
const io = new Server(server);

io.use((socket, next) => {
  //sharing session with middleware
  sessionMiddleware(socket.request, {}, next);
});

const port = 3000;

//connecting socket
io.on("connection", socket => {

  socket.on("addedToCart", (data, callback) => {
    const session = socket.request.session;

    if (!Array.isArray(session.cart)) {
      session.cart = [];
    }

    const { productId } = data;

    const existingItem = session.cart.find(
      item => item.productId === productId
    );

    let duplicate = false;

    if (existingItem) {
      duplicate = true;
      // existingItem.qty += 1; // ✅ FIX
      console.log("Duplicate product found : ", existingItem.productId);
      return callback({
        success: true,
        count: session.cart.length,
        duplicateId: duplicate
      });
    }
    else {
      session.cart.push({
        productId,
        qty: 1
      });
    }
    console.log("SESSION CART AFTER ADD:", session.cart);

    session.save(err => {
      if (err) {
        return callback({ success: false });
      }

      callback({
        success: true,
        count: session.cart.length,
        duplicateId: false
      });
    });
  });


  // });

  socket.on("removeFromCart", (prodId, callback) => {
    const session = socket.request.session;

    if (!Array.isArray(session.cart)) {
      session.cart = [];
    }

    session.cart = session.cart.filter(
      item => item.productId !== prodId
    );

    session.save(err => {
      if (err) {
        callback({ success: false });
      } else {
        callback({
          success: true,
          count: session.cart.length
        });
      }
    });
  });

  socket.on("updateCartQty", (data, callback) => {
    const session = socket.request.session;
    console.log("before update  : ", session.cart);
    if (!Array.isArray(session.cart)) {
      return callback({ success: false });
    }

    const { productId, qty } = data;
    let matchedproduct = session.cart.find(
      item => item.productId === productId
    );

    if (matchedproduct) {
      matchedproduct.qty = qty;
    }

    console.log("AFTER UPDATE:", session.cart);

    session.save(err => {

      if (err) {
        console.log("Error updating : ", err.message);
        callback({ success: false });
      }
      else {
        callback({
          success: true,
          qty,
          count: session.cart.length
        })
      }
    });

  });


});


//to read cart
app.get("/cart", async (req, res) => {
  const cart = req.session.cart || [];

  // 🔴 EMPTY CART
  if (cart.length === 0) {
    return res.render("./cart/cart.handlebars", {
      product: [],
      isCartEmpty: true,
      cartCount: 0
    });
  }

  // 🟢 CART HAS ITEMS
  const productsWithQty = await cartcontroller.getproductsInCart(cart);

  res.render("./cart/cart.handlebars", {
    product: productsWithQty,
    isCartEmpty: false,
    cartCount: cart.length
  });
});


// gpt
app.get("/dailyDeal", async (req, res) => {
  try {
    let products = await cartcontroller.getDailyDeal(req, res);

    // render ONLY the partial
    res.render(__dirname + "/views/partials/_dailyDeal.handlebars", {
      layout: false,
      products
    });
  } catch (err) {
    res.status(500).send("Error loading daily deals");
  }
});

app.get("/brandFilter", async (req, res) => {
  try {

    if (req.query.brandName) {
      let brand = req.query.brandName;
      console.log("Found : ", brand);
      let filterByBrand = await productController.getProductsByBrand(brand);
      console.log("in app.js", filterByBrand);
      let brands = await productController.getBrands();
      res.render(__dirname + "/views/home/filters.handlebars", { allproducts: filterByBrand, brands: brands });

    }

    else {

      let products = await productController.getProducts();
      // console.log("Products: ",products);
      //brands
      let brands = await productController.getBrands();
      // console.log("Brands: ",brands);
      res.render(__dirname + "/views/home/brands.handlebars", { allproducts: products, brands: brands });
    }
  }
  catch (error) {
    throw new Error(error.message);
  }

});


//middleware for checking is customer logged in
const isLoggedIn = (req, res, next) => {
  if (req.session.customer) return next();

  req.session.redirectTo = req.originalUrl; // 🔥 save intended page
  res.redirect("/login");
};

//middleware for checking is customer admin
// const isAdmin = (req,res,next) => {
//    if (req.customer?.isAdmin) {
//       next();
//    };
//    return res.redirect("/login");
// };

// app.get("/admin/dashboard",isAdmin,adminController.dashboard);

app.get("/login", async (req, res) => {
  // if (req.session.customer) {
  //   return res.redirect("/"); // already logged in → go home
  // }
  res.render("./customer/login.handlebars");
});

// app.post("/signUp", validateSignup, customerController.custSignUp);

app.post("/login", validateLogin, async (req, res) => {
  const existingCart = req.session.cart;
  const { email, password } = req.body;

  const verifyCustomer = await customerController.verifyLogin(email, password);

  if (!verifyCustomer) {
    return res.render("./customer/login.handlebars", {
      errorMsg: "Email or password is incorrect ❌",
      oldData: { email }
    });
  };

  // const customer = await Customer.findOne({ email });

  if (verifyCustomer.isGoogleUser) {
    return res.render("./customer/login.handlebars", {
      errorMsg: "Please login using Google ❌"
    });
  }


  req.session.customer = {
    _id: verifyCustomer._id,
    name: verifyCustomer.name,
    email: verifyCustomer.email,
    isAdmin : verifyCustomer.isAdmin
  };

  if (existingCart) req.session.cart = existingCart;

  if (verifyCustomer.isAdmin) {
    req.session.success = `Welcome Admin ${verifyCustomer.name} !!`;
    return res.redirect("/api/admin/dashboard");
  }

  const redirectTo = req.session.redirectTo || "/checkout";
  delete req.session.redirectTo;

  req.session.success = `login successfull !! welcome ${req.session.customer.name}`;
  res.redirect(redirectTo);
});


app.get("/checkout", isLoggedIn, async (req, res) => {
  try {
    const cart = req.session.cart || [];

    // if cart empty → go to cart page
    if (cart.length === 0) {
      return res.redirect("/cart");
    }

    const productsWithQty = await cartcontroller.getproductsInCart(cart);
    let customerid = req.session.customer._id;
    let customerData = await customerController.getCustomerById(customerid);
    console.log("customer data : ", customerData);
    console.log("adress : ", customerData.addresses[0]);
    let customerObj = customerData.toObject();

    let totalAmount = 0;
    productsWithQty.forEach(prod => {
      totalAmount += prod.price * prod.qty;
    });

    res.render("./cart/checkout.handlebars", {
      customer: req.session.customer,
      product: productsWithQty,
      addresses: customerObj.addresses,
      cartCount: productsWithQty.length,
      phone: customerObj.mobile,
      totalAmount
    });

  } catch (err) {
    console.log("Checkout error:", err);
    res.redirect("/cart");
  }
});


// app.get("/checkout", async (req, res) => {
//   // 🔐 Auth guard
//   if (!req.session.customer) {
//     req.session.redirectTo = "/checkout";
//     return res.redirect("/login");
//   }

//   if (req.session.customer) {
//     return res.redirect("/");
//   };
//   const cart = req.session.cart || [];

//   if (cart.length === 0) {
//     return res.redirect("/cart");
//   }

//   const productsWithQty = await cartcontroller.getproductsInCart(cart);

//   let totalAmount = 0;
//   productsWithQty.forEach(prod => {
//    totalAmount += prod.price * prod.qty;
//   });

//   console.log("total amount : ",totalAmount);
//   console.log(typeof totalAmount);

//   res.render("./cart/checkout.handlebars", {
//     customer: req.session.customer,
//     product: productsWithQty,          // 👈 match template
//     cartCount: productsWithQty.length,  // 👈 used in header
//     totalAmount
//     // totalAmount : totalAmount
//   });
//   });

// app.get('/test',async (req,res) => {
// res.render("./cart/checkout.handlebars");
// });

app.get("/place-order", async (req, res) => {
  console.log("in place order :", req.session.cart);
  console.log("customer : ", req.session.customer);

  res.render("./order/placeOrder.handlebars");
});

app.post("/place-order", async (req, res) => {
  try {
    if (!req.session.cart) {
      return res.redirect("/cart");
    };
    if (!req.session.customer) {
      return res.redirect("/login");
    };
    let cart = req.session.cart;
    let id = req.session.customer._id;
    let products = await cartcontroller.getproductsInCart(cart);
    console.log("products : ", products);

    let customer = await customerController.getCustomerInfo(id);
    let items = [];
    let totalAmount = 0;

    for (const product of products) {
      items.push({
        product: product._id,
        name: product.name,
        price: product.price,
        quantity: product.qty,
        image: product.image?.[0]
      });
      totalAmount += product.price * product.qty;

    };

    if (!customer.addresses || customer.addresses.length === 0) {
      return res.json({
        success: false,
        needAddress: true,
        message: "please add delivery address"
      });
    }
    let address = customer.addresses.find(adr => adr.isDefault) || customer.addresses[0];
    console.log("Items : ", items);
    let order = {
      customer: req.session.customer._id,
      items: items,
      shippingAddress: {
        city: address.city,
        state: address.state,
        country: address.country,
        zipcode: address.zipcode
      },
      totalAmount: totalAmount,
      paymentMethod: "Online",
      paymentStatus: "Pending",
      orderStatus: "Placed"

    };
    console.log("order : ", order);

    let placeOrder = await orderController.createOrder(order);

    if (!placeOrder) {
      return res.render("./order/placeOrder.handlebars", { error: true, message: "error placing order" });
    };

    //create razorpay order using placeOrder._id
    const options = {
      amount: totalAmount * 100, //paise
      currency: "INR",
      receipt: placeOrder._id.toString()
    }

    console.log("options : ", options);

    const razorpayOrder = await razorpay.orders.create(options);

    // 3. save razorpay order id in same DB order
    await orderController.attachRazorpayOrderId(
      placeOrder._id,
      razorpayOrder.id
    );

    // 4.send json data to frontend
    res.json({
      success: true,
      orderId: razorpayOrder.id,
      amount: options.amount,
      dbOrderId: placeOrder._id,
      key: process.env.RAZORPAY_KEY_ID
    });

    //  res.redirect(`/payment/${placeOrder._id}`);

  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: "Order failed" });

  }

});

app.post("/verify-payment", async (req, res) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      dbOrderId
    } = req.body;

    let body = razorpay_order_id + "|" + razorpay_payment_id;
    let expectedSignature = crypto.createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(body)
      .digest("hex");

    if (expectedSignature === razorpay_signature) {
      await orderController.updatePaymentStatus(dbOrderId, {
        paymentStatus: "Paid",
        orderStatus: "Confirmed",
        razorpayPaymentId: razorpay_payment_id,

      })

      //clear cart
      req.session.cart = [];
      return res.json({
        success: true
      });
    }
    else {
      return res.json({
        success: false
      });
    }

  } catch (error) {
    console.log(error.message);
    res.json({ success: false });
  }
});

app.get("/add-address", async (req, res) => {
  //check if customer exist in session
  if (!req.session.customer) {
    return res.redirect("/login");
  }
  res.render("./customer/add-address.handlebars");
});

app.post("/add-address", async (req, res) => {
  try {
    console.log("customer session : ", req.session.customer);
    console.log("customer session : ", req.body);

    if (!req.session.customer) {
      return res.redirect("/login");
    }
    let custId = req.session.customer._id;

    let newAddress = {
      label: req.body.label || "Home",
      country: req.body.country,
      state: req.body.state,
      city: req.body.city,
      zipcode: req.body.zipcode,
      isDefault: true
    };
    console.log("new address : ", newAddress);
    await customer.updateOne(
      { _id: custId },
      {
        $set: { "addresses.$[].isDefault": false }
        // $push: { addresses: newAddress }
      }
    );

    await customer.updateOne(
      { _id: custId },
      {
        $push: { addresses: newAddress }
      }
    );

    res.redirect("/checkout"); //redirect to checkout after creating address

  } catch (error) {
    console.log(error.message);
    res.redirect("/add-address");
  }
});

app.get("/orders", async (req, res) => {
  try {

    //check customer data is in session?
    if (!req.session.customer) {
      return res.redirect("/login");
    };

    let customerId = req.session.customer._id;

    let orders = await orderController.getOrdersById(customerId);
    console.log("orders by customer id : ", orders);
    // let image = await orders.
    res.render("./order/orders.handlebars", { orders });

  } catch (error) {
    console.log(error.message);
    res.redirect("/");
  }

});

app.get("/order-success", async (req, res) => {
  res.render("./order/success.handlebars");
})

app.get("/getProfile", async (req, res) => {
  let email = req.params.email;
  let password = req.params.password;
  console.log("Email : ", email);
  console.log("Password : ", password);
  res.render(__dirname + "/views/cutomer/getProfile.handlebars");
});

app.get("/electronics", (req, res) => {

  let electronicImages = [];
  let laptopImg = { path: "/images/shopByCategorylaptop(1).jpg", name: "Laptops" };
  let headPhonesImg = { path: "/images/shopByCategoryHeadphones(2).jpg", name: "Headphones" };
  let tabletsImg = { path: "/images/shopByCategoryTablets(3).jpg", name: "Tablets" };
  let smartWatchImg = { path: "/images/shopByCategorySmartwatches(4).jpg", name: "SmartWatches" };
  electronicImages.push(laptopImg, headPhonesImg, tabletsImg, smartWatchImg);
  console.log("Electronics:", electronicImages);

  res.render(__dirname + "/views/home/electronics.handlebars", { electronics: electronicImages });
});

server.listen(port, () => {
  console.log("running on port:", port);
});
// module.exports = upload;