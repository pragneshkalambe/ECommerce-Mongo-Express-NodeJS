const { required } = require('joi');
const mongoose = require('mongoose');

//schema structure
let colorSchema = new mongoose.Schema({
    name : {
        type : String,
        required : true
    }
});

//schema model
let color = mongoose.model("color",colorSchema);
module.exports = color;