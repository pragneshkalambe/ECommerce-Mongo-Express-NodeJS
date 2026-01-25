const { required } = require('joi');
const mongoose = require('mongoose');

//schema structure
let loginSchema = new mongoose.Schema({
    password : {type : String, required : true},
    email : {type : String, required : true}
})

//schema model
let login = mongoose.model("login",loginSchema);

exports.module = login;

