const { json } = require("express");
const { Error } = require('mongoose');
const productServices = require("../services/productServices");
const { forEach, forIn } = require("lodash");
const customer = require('../models/customer');
const product = require('../models/product');
const order = require('../models/order');


exports.dashboard = async (req, res) => {
    try {
        let totalUsers = await customer.countDocuments({ isAdmin: false });
        console.log("total users : ",totalUsers);

        let totalOrders = await order.countDocuments();
        console.log("total orders : ",totalOrders);


        // let totalProducts = await product.countDocuments({isDeleted : false});

        let totalProducts = await product.countDocuments();
        console.log("total products : ",totalProducts);


        //retrieve paid status orders and group together
        let revenueResult = await order.aggregate([
            { $match: { paymentStatus: "Paid" } },
            {
                $group: {
                    _id: null,
                    totalRevenue: { $sum: "$totalAmount" }
                }
            }
        ]);
        console.log(revenueResult);
        const totalRevenue = revenueResult[0]?.totalRevenue || 0;

        res.render("admin/dashboard.handlebars", {
            admin: true,
            stats: {
                totalUsers,
                totalOrders,
                totalProducts,
                totalRevenue
            }
        });

    } catch (error) {
        console.log("Admin dashboard error : ", error.message);
        res.status(500).send("server error");
    }
};


// const { images } = require("fontawesome");
// const { image } = require("fontawesome");

// let products = undefined;

exports.getProducts = async (req, res) => {
    try {
        let allproducts = await productServices.getProductsServ();
        // let allproducts =  products;

        if (allproducts) {
            return allproducts
        }

    } catch (error) {
        
        console.log("In controller,", error);
        return {
            hasError: true,
            errorMsg: error.message
        };
    }
}

exports.createProduct = async (req, res, next) => {
    try {
        console.log("Req File", req.files);
        if (!req.files) {
            return res.status(400).json({
                hasError: true,
                errorMsg: "Upload Files Again"
            });
        }
        let files = req.files;
        let product = { ...req.body };
        let images = [];

        
        for (let i = 0; i < files.length; i++) {
            images[i] = files[i].path;
            // console.log(files.length);
        }
        console.log("Images", images);
        product.image = images;

        console.log("Product data in controller:", product);


        let createdProduct = await productServices.createProductServ(product);
        // if (createdProduct) {
        //     res.status(200).json(
        //         {
        //             message: "Product Inserted Succesfully",
        //             data: createdProduct
        //         }
        //     );
        // }
        // console.log("Created product", createdProduct);
        console.log("created : ",createdProduct);


        res.redirect("/api/admin/products");


    } catch (error) {
        // console.log(error);
        res.status(400).json({
            message: "Error Inserting",
            cause: error.message
        })

    }
};

exports.updateProduct = async (req, res) => {
    try {
        // let productId = req.params.id;
        let productData = req.body;
        productData.id = req.params.id;
        let files = req.files;
        console.log("Files ", files);


        let prodImage = [];
        // for (let i = 0; i < files.length; i++) {
        //     // prodImage[i] = files[i].path; commented for gpt below

        // }
        if (files.length > 0 && files) {
            prodImage.push(files[i]);
        }

        productData.image = prodImage;


        // productData.image = req.file ? `/uploads/${req.file.filename}` : null;
        console.log("Product Data:", productData);

        let updatedProduct = await productServices.updateProductServ(productData);
        console.log("updated : ",updatedProduct);
        
        res.redirect("/api/admin/products");

    } catch (error) {
        res.status(400).json({
            message: "error updating product",
            details: error.message
        })
    }

};

exports.deleteProduct = async (req, res) => {
    try {

        let idToDelete = req.params.id;
        let deletedProduct = await productServices.deleteProductServ(idToDelete);
        // if (deletedProduct) {
        //     res.status(200).json({
        //         message: "product deleted Successfully",
        //         product: deletedProduct
        //     });
        // }
        console.log("delete : ",deletedProduct);

        res.redirect("/api/admin/products");


    } catch (error) {
        console.log(error);
        res.status(404).json({
            message: "error deleting product",
            cause: error.message
        });
    }
};

exports.adminGetProducts = async (req, res) => {
  const products = await product.find().lean();
  console.log("get products : ",products);
  res.render("admin/products", { products, admin: true });
};

exports.adminAddproducts = async (req,res) => {
    try {
//    let addProduct = await product.create();
   res.render("admin/addProduct.handlebars",{admin : true});
        
    } catch (error) {
        console.log("error in get : ",error.message);
    }
   
};

exports.adminUpdateProduct = async (req,res) => {
 try {
    let id = req.params.id;
    let getProduct = await product.findById(id).lean();
    console.log("product in update : ",getProduct);
    if (!getProduct) {
        console.log("get product not found");
        return res.redirect("/api/admin/products");
    };
    res.render("admin/editProduct.handlebars",{
        admin:true,
        product : getProduct
    });

 } catch (error) {
    console.log("error updating message : ",error.message);
    res.redirect("api/admin/products");
 }
};


//Export the content of this file to other js files
// module.exports = {
//     dashboard, getProducts, createProduct, updateProduct, deleteProduct

// };