//create schema
const { flask } = require('fontawesome');
const { required } = require('joi');
const { trim } = require('lodash');
const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        // cast  : false
    },
    price: {
        type: Number,
        required: true,
        // cast  : false
    },
    category: {
        type: String,
        required: true,
        // cast  : false
    },
    description: {
        type: String,
        required: true,
        // cast  : false
    },
    brand: {
        type: String,
        required: true,
        // cast  : false
    },
    isMobile : {
        type : Boolean,
        required : true
    },

    //for storing cellarData when isMobile is true
    cellularData : {
        type : String,
        required : function(){
          return this.isMobile === true ; //&& this.category?.toLowerCase() === "Mobile"
        },
        validate : {
            validator : function(value){
                if (this.isMobile === false && value) {
                    return false
                }
                return true
            },
            message: "cellularData is allowed only for mobile products"
        }
    },

    image: {
        type: Array,
        required : false
    }
});

//create model
let product = mongoose.model("product",productSchema);

module.exports = product;