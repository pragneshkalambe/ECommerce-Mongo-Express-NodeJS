const express = require('express');
const router = express.Router();

//controller reference
const { productCart } = require("../controllers/cartController");
const upload = require('../middleware/multer');

// router.get("/",productCart);
// router.get("/:id",getProduct);
// router.post("/",upload.array("image",5),createProduct);
// router.put("/:id",upload.array("image",5),updateProduct);
// router.delete("/:id",deleteProduct);

//for filtering products
// router.get("/searchBy",searchBy);
// router.get("/",getCart);


//export the content
module.exports = router;

