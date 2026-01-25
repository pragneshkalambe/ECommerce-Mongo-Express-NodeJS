const { Error } = require('mongoose');
const bcrypt = require('bcrypt');
const customer = require('../models/customer');

exports.custSignUp = async (req, res) => {
  try {
    const { name, email, password, mobile, country, state, city, zipcode } = req.body;
    let hashedPassword = await bcrypt.hash(password,10);
    let isDefault;

    const userData = {
      name,
      email,
      password : hashedPassword,
      mobile,
      addresses: [
        { city, state, country, zipcode , isDefault : true}
      ]
    };

    await customer.create(userData);

    res.redirect("/login");

  } catch (err) {
    console.log(err.message);
    res.render("./customer/signup", {
      errorMsg: "Something went wrong. Try again.",
      oldData: req.body
    });
  }
};


exports.verifyLogin = async (email,password) => {
  //check based on email and password
  let getCustomer = await customer.findOne({email : email});
  if (!getCustomer) {
     return null;
  }

  //compare password 
  let comparePassword = await bcrypt.compare(password,getCustomer.password);
  if(!comparePassword){
    return null;
  }
  return getCustomer;
    //store user data in session

};

exports.getCustomerInfo = async (id) => {
  let getCustomer = await customer.findById(id);
  if (!customer) {
    throw new Error("this customer doesnt exist");
  }
  return getCustomer;
};

exports.getCustomerById = async (id) => {
  const customerData = await customer.findById(id);
  if (!customerData) {
    throw new Error("customer not found.");
  };

  return customerData;
}

