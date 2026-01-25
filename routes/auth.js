const express = require("express");
// const passport = require("passport");
const axios = require("axios");
const customer = require('../models/customer');
const router = express.Router();

// router.get("/google",(req,res,next) => {
//   req.session.preGoogleCart = req.session.cart;
//   console.log("cart before google : ",req.session.preGoogleCart);
//   next();
// },
// passport.authenticate("google",{scope : ["profile","email"] }));

// //callback
// router.get("/google/callback",passport.authenticate("google",{failureRedirect : "/login"}),
// (req,res) => {
//   const Cart = req.session.preGoogleCart;
//   console.log("cart before preserving : ",req.session.cart);
//   console.log(`user info : name - ${req.user.name} , email - ${req.user.email} , id - ${req.user._id}`);
//   //success login 
//   req.session.customer = {         //same as normal login
//       _id : req.user._id,
//       name : req.user.name,
//       email : req.user.email
      
//   } 
//   req.session.cart = existingCart;
//   console.log("cart after preserving : ",req.session.cart);
//   console.log("in google callback : ",req.session.customer);
//   res.redirect("/");
// }
// );

//1. redirect to google 
router.get("/google",(req,res) => {
  //preserve cart
  req.session.preGoogleCart = req.session.cart;
  console.log("before redirect : ",req.session.preGoogleCart);

  const redirectUrl = "https://accounts.google.com/o/oauth2/v2/auth" + 
  `?client_id=${process.env.GOOGLE_CLIENT_ID}` + 
  `&redirect_uri=${encodeURIComponent(process.env.GOOGLE_CALLBACK_URL)}` +
  "&response_type=code" +
  "&scope=profile email";

  res.redirect(redirectUrl);
});

//2. Google callback
router.get("/google/callback",async (req,res) => {
  try {
    const code = req.query.code;
    if (!code) {
      return res.redirect("/login");
    };
    const params = new URLSearchParams();
    params.append("client_id",process.env.GOOGLE_CLIENT_ID);
    params.append("client_secret",process.env.GOOGLE_CLIENT_SECRET);
    params.append("redirect_uri",process.env.GOOGLE_CALLBACK_URL);
    params.append("grant_type","authorization_code");
    params.append("code",code);

    //exchange code for token
    const tokenRes = await axios.post(
      "https://oauth2.googleapis.com/token",
      params,
      {
        headers : { "Content-Type" : "application/x-www-form-urlencoded" }
      }
      // {

      //   client_id : process.env.GOOGLE_CLIENT_ID,
      //   client_secret : process.env.GOOGLE_CLIENT_SECRET,
      //   redirect_uri : process.env.GOOGLE_CALLBACK_URL,
      //   grant_type : "authorisation code",
      //   code
         
      // }
    );
    const accessToken = tokenRes.data.access_token;

    //get user profile
    const profileRes = await axios.get(
      "https://www.googleapis.com/oauth2/v2/userinfo",{
        headers : { Authorization : `Bearer ${accessToken}`}
      });

    const { email, name } = profileRes.data;

    //find or create customer
    let Customer = await customer.findOne({email : email}); 
    if (!Customer) {
      Customer = await customer.create({
        email : email,
        name : name,
        isGoogleUser : true,
        password : null
      });
      console.log("customer not found ...new custonmer data : ",Customer);
    }

    //MANUAL LOGIN
    req.session.customer = {
      _id : Customer._id,
      name : Customer.name,
      email : Customer.email
    };
    console.log("Customer after initialising values : ",req.session.customer);

    console.log("after redirect..in callback :",req.session.preGoogleCart);
    //restore cart
    if (req.session.preGoogleCart) {
      req.session.cart = req.session.preGoogleCart;
      delete req.session.preGoogleCart;
    }

    res.redirect("/");

  } catch (error) {
    console.log("google login Error : ",error.message);
    res.redirect("/login");
  }
});


module.exports = router;