const Razorpay = require('razorpay');

// const RAZORPAY_KEY_ID=rzp_test_S64Omg722vFkSO;
// const RAZORPAY_KEY_SECRET=tq5nDvIw3TuFwrxUB0LnVZ59;

//creating instance for razorpay
const instance = new Razorpay({

  key_id : process.env.RAZORPAY_KEY_ID,
  key_secret : process.env.RAZORPAY_KEY_SECRET

});

module.exports = instance;
