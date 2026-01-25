const express = require('express');
const router = express.Router();

//controller reference
const { getProducts, getProduct, createProduct, updateProduct, deleteProduct} = require("../controllers/productController");
const upload = require('../middleware/multer');

router.get("/",getProducts);
router.get("/:id",getProduct);
router.post("/",upload.array("image",5),createProduct);
router.put("/:id",upload.array("image",5),updateProduct);
router.delete("/:id",deleteProduct);

//for filtering products
// router.get("/searchBy",searchBy);
// router.get("/",productCart);


//export the content
module.exports = router;

