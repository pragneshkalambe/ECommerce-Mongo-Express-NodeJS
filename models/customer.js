const { required } = require('joi');
const mongoose = require("mongoose");

const addressSchema = new mongoose.Schema({
  label: { type: String, default: "Home" },
  city: { type: String, required: true },
  country: { type: String, required: true },
  zipcode: { type: String, required: true },
  state: { type: String, required: true },
  isDefault: { type: Boolean, default: false }
});

const customerSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    // required: true
    required: function () {
    return !this.isGoogleUser;
  }
  },
  mobile: {
    type: String
  },
  isGoogleUser: {
  type: Boolean,
  default: false
},
  addresses: [addressSchema],
  isAdmin : {
    type : Boolean,
    default : false

  }
});

module.exports = mongoose.model("Customer", customerSchema);


// const mongoose = require('mongoose');

// let addressSchema = new mongoose.Schema({
//     label : {
//         type : String,
//         default : "Home"
//     },
//     city: { type: String, required: true },
//     country: { type: String, required: true },
//     zipcode: { type: String, required: true },
//     state: { type: String, required: true },
//     isDefault : {
//         type:Boolean,
//         default:false
//     }
// });


// let customerSchema = new mongoose.Schema({
//     name: {
//         type: String,
//         required: true,
//         unique : true
//     },
//     email: {
//         type: String,
//         required: true,
//         unique: true
//     },
//     password: {
//         type: String,
//         required: true,
//         // unique: true
//     },
//     mobile: {
//         type: String,
//         required: false
//     },
//     adresses: [addressSchema]

// });


// let customer = mongoose.model("customer",customerSchema);

// exports.module = customer;