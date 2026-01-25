// const express = require('express');
const Joi = require('joi'); //for schema validation
// const app = express();

// app.use(express.json());

// //Validation Schema
// const userSchema = Joi.object({
//     name: Joi.string().min(3).required(),
//     email: Joi.string().email().required()
// });


// app.post("/api/users/", (req, res) => {
//     //validating request body
//     const { error } = userSchema.validate(req.body);

//     if (error) {
//         return res.status(400).json({
//             message: error.details[0].message
//         });
//     }

//     //process valid request
//     res.status(201).json({
//         message: "User Created Successfully",
//     });
// });

//signup
const signupSchema = Joi.object({
  name: Joi.string().min(3).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
  mobile: Joi.string().min(10).max(11).required(),

  country: Joi.string().min(3).required(),
  state: Joi.string().min(3).required(),
  city: Joi.string().min(3).required(),
  zipcode: Joi.string().min(4).required(),
});

exports.validateSignup = (req, res, next) => {
  const { error } = signupSchema.validate(req.body, { abortEarly: true });
  console.log("REQ BODY IN VALIDATE SIGNUP:", req.body);


  if (error) {
    return res.render("./customer/signup", {
      errorMsg: error.details[0].message,
      oldData: req.body
    });
  }

  next(); // ✅ go to controller
};


const loginSchema = Joi.object({
  email : Joi.string().email().required(),
  password : Joi.string().min(6).required()
});

exports.validateLogin = async(req,res,next) => {
  const { error } = loginSchema.validate(req.body);
  console.log("in login from req.body : ",req.body);

  if (error) {
    return res.render("./customer/login.handlebars",{
      errorMsg : error.details[0].message,
      oldData : req.body
    });
  }

  next();

};

//listen on port
// app.listen(3000);

// module.exports = userSchema;

