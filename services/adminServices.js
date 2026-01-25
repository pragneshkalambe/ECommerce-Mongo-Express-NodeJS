const { forIn, update } = require("lodash");
const Product = require("../models/product");
const { array } = require("joi");

exports.createProductServ = async (data) => {
    try {
        
        let newProduct = await new Product(
            {   
                name: data.name,
                price: data.price,
                category: data.category,
                description: data.description,
                image: data.image,
                brand:data.brand,
                isMobile:data.isMobile,
                cellularData :data.isMobile ? data.cellularData : undefined
            })
            .save();
            console.log("In services New product:",newProduct);

        if (newProduct) {
            return newProduct;
        }
    } catch (error) {
        console.log(error._message);
        throw new Error(error._message);
    }
};

exports.updateProductServ = async (data) => {
    try {
        let product = JSON.parse(JSON.stringify(data));
        console.log("In Modify Data:", product);

        let id = product.id;

        let updateFields = {};
        delete product.id

        for (const field in product) {

            updateFields[field] = product[field];

        }

        // Fetch previous product ONCE
        const prevProduct = await Product.findById(id);
        const prevImages = prevProduct?.image || [];

        // If images are sent from Postman
        if (Array.isArray(updateFields.image) && updateFields.image.length > 0) {
            updateFields.image = 
            [
                ...new Set([...prevImages, ...updateFields.image])
            ].sort((a, b) => a.localeCompare(b));
        }
        // If no images sent → keep previous images
        else {
            updateFields.image = prevImages;
        }

        let updatedProduct = await Product.findByIdAndUpdate(
            id,
            { $set: updateFields },
            {
                new: true,
                runValidators: true
            }

        );
        if (updatedProduct) {
            return updatedProduct
        }

    } catch (error) {
        console.log(error.message);
        throw new Error(error.message);
    }
};

exports.deleteProductServ = async (id) => {
    try {
        let deletedProduct = await Product.findByIdAndDelete({ _id: id });
        if (deletedProduct) {
            return deletedProduct;
        }

    } catch (error) {
        throw new Error(error._message);
    }

};