//import the module from product class to use its properties and methods
const { json } = require("express");
const { Error } = require('mongoose');
const Product = require("../models/product");
const productServices = require("../services/productServices");
const { forEach, forIn } = require("lodash");
// const { images } = require("fontawesome");
// const { image } = require("fontawesome");

// let products = undefined;

const getProducts = async (req, res) => {
    try {
        let allproducts = await productServices.getProductsServ();
        // let allproducts =  products;

        if (allproducts) {
            return allproducts
        }

    } catch (error) {
        // res.status(404).json({
        //     message: "No Products",
        //     error: error.message
        // });
        console.log("In controller,", error);
        return {
            hasError: true,
            errorMsg: error.message
        };
    }
}

const getBrands = async () => {
    let brand = await Product.aggregate([
        {
            $group:
            {
                _id: null,
                brands: { $addToSet: "$brand" }
            }
        },
        {
            $sort: {
                name: 1
            }
        },
        {
            $project:
            {
                _id: 0,
                brands: 1
            }
        }
    ]);

    console.log("Brand : ", brand);

    return brand[0]?.brands || [];

};

const getProductsByBrand = async (brand) => {
    try {
        let products = await Product.find({ "brand": brand ,"category" : "Mobile"}).lean();
        console.log("products brand wise : ", products);
        if (products) {
            return products
        }
    } 
    catch (error) {
        res.status(404).json(
            {
                message: "Product Not Found, Error :",
                error: error
            }
        );
    }

};


const getProduct = async (req, res) => {
    try {
        let productId = req.params.id;

        // let productData = products.find(p => p.id === productId);

        let product = await productServices.getProductServ(productId);

        // let productData = products.find(p => p.id === productId);
        // console.log(productData);

        if (product) {

            res.status(200).json(
                {
                    message: "Product Found",
                    data: product
                }
            );
            console.log(product);
        }


    } catch (error) {

        res.status(404).json(
            {
                message: "Product Not Found, Error :",
                error: error
            }
        );
    }
}

// const createProduct = async (req, res) => {
//     try {
//         let prodData = JSON.parse(JSON.stringify(req.body));
//         prodData.id = products.length > 0 ? Math.max(...products.map(p => p.id)) + 1 : 1;
//         console.log(prodData);

//         //sort 
//         let desiredKey = "id";
//         const desiredValue = prodData[desiredKey];

//         const sortedProd = {
//             [desiredKey]: desiredValue, // Place the desired key first
//             ...Object.fromEntries(
//                 Object.entries(prodData).filter(([key]) => key !== desiredKey)
//             )
//         };

//         res.status(200).json({
//             message: "Product Created Successfully",
//             product: sortedProd
//         });

//     } catch (error) {
//         res.status(404).json({
//             message: "Product Creation Failed",
//             error: error
//         });
//     }
// }

const createProduct = async (req, res, next) => {
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

        // for (const file in files) {
        //     images = files[file];

        // }
        for (let i = 0; i < files.length; i++) {
            images[i] = files[i].path;
            // console.log(files.length);
        }
        console.log("Images", images);
        product.image = images;

        console.log("Product data in controller:", product);


        let createdProduct = await productServices.createProductServ(product);
        if (createdProduct) {
            res.status(200).json(
                {
                    message: "Product Inserted Succesfully",
                    data: createdProduct
                }
            );
        }
        console.log("Created product", createdProduct);

    } catch (error) {
        // console.log(error);
        res.status(400).json({
            message: "Error Inserting",
            cause: error.message
        })

    }
}

// const updateProduct = async (req, res) => {
//     try {

//         let prodIdToUpdate = parseInt(req.params.id);
//         let prodDataFromBody = JSON.parse(JSON.stringify(req.body));
//         let product = products.find(p => p.id === prodIdToUpdate);

//         if (!product) {
//             return res.status(404).json(
//                 { message: "Product ID not found" }
//             );
//         }

//         product.name = prodDataFromBody.name;
//         product.price = prodDataFromBody.price;
//         product.category = prodDataFromBody.category;
//         product.description = prodDataFromBody.description;

//         res.status(200).json(
//             {
//                 message: "Product Updated Successfully",
//                 data: product
//             }
//         );
//         console.log(products);


//     } catch (error) {
//         res.status(404).json(
//             {
//                 message: "Product Update Failed",
//                 error: error
//             }
//         );
//     }
// }

const updateProduct = async (req, res) => {
    try {
        // let productId = req.params.id;
        let productData = req.body;
        productData.id = req.params.id;
        let files = req.files;
        console.log("Files ", files);


        let prodImage = [];
        for (let i = 0; i < files.length; i++) {
            // const element = array[i];
            prodImage[i] = files[i].path;

        }
        productData.image = prodImage;


        // productData.image = req.file ? `/uploads/${req.file.filename}` : null;
        console.log("Product Data:", productData);

        let updatedProduct = await productServices.updateProductServ(productData);
        if (updatedProduct) {
            res.status(200).json({
                message: "Product Updated Successfully",
                details: updatedProduct
            });
        }
    } catch (error) {
        res.status(400).json({
            message: "error updating product",
            details: error.message
        })
    }

}

const deleteProduct = async (req, res) => {
    try {

        let idToDelete = req.params.id;
        let deletedProduct = await productServices.deleteProductServ(idToDelete);
        if (deletedProduct) {
            res.status(200).json({
                message: "product deleted Successfully",
                product: deletedProduct
            });
        }

    } catch (error) {
        console.log(error);
        res.status(404).json({
            message: "error deleting product",
            cause: error.message
        });
    }
};

const filterBy = async (data, filterBy) => {
    let queryData = data;
    // console.log("Category : ",category);
    if (filterBy === "products") {
        let filteredProducts = await Product.findOne(
            { name: { $regex: queryData, $options: "i" } },
        ).lean();
        console.log("in filterby = products: ", filteredProducts);
        if (filteredProducts) {
            filteredProducts.filterBy = "products";
            return filteredProducts;
        }
    }
    if (filterBy === "category") {

        let filteredProducts = await Product.find({ category: queryData }).lean();
        console.log("in filterby = category : ", filteredProducts);
        if (filteredProducts) {
            filteredProducts.filterBy = "category";
            return filteredProducts;
        }
    }
}

const searchBy = async (req, res) => {
    //   let prodFilter = req.params.name;
    try {
        let filterByName = req.query.name;
        console.log("Received in controller : ", filterByName);
        let filteredProduct = await Product.find({
            name: { $regex: filterByName, $options: "i" }
        })
        console.log("Filtered products: ", filteredProduct);

        if (filteredProduct) {
            return filteredProduct;
        }

    } catch (error) {
        throw new Error("Error fetching in controller : ", error.message);
    }

}


//Export the content of this file to other js files
module.exports = {
    getProducts, getProduct, createProduct, updateProduct, deleteProduct, filterBy, searchBy, getProductsByBrand, getBrands

};