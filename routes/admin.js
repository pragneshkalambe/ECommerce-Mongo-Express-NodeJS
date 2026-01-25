const express = require('express');
const router = express.Router();

const isAdmin = require("../middleware/isAdmin");
const upload = require('../middleware/multer');

// const { dashboard , createProduct , getProducts , updateProduct , deleteProduct, adminGetProducts, adminAddproducts, adminUpdateProduct } = require("../controllers/adminController");
// const { dashboard , createProduct , getProducts , updateProduct , deleteProduct } = require("../views/adminController");



//for pages
// router.get("/dashboard", isAdmin, dashboard);

// router.get("/adminProducts", isAdmin, adminGetProducts);

// router.get("/adminCreate", isAdmin, adminAddproducts);

// router.get("/adminUpdate/:id", isAdmin, adminUpdateProduct);


// //for action
// router.get('/dashboard',isAdmin,dashboard);
// // router.get('/adminProducts',isAdmin,getProducts);
// router.post("/adminCreate",isAdmin,upload.array("image",5),createProduct);
// router.put("/adminUpdate/:id",isAdmin,upload.array("image",5),updateProduct);
// router.delete('/adminDelete/:id',isAdmin,deleteProduct);

const {
  dashboard,
  adminGetProducts,
  adminAddproducts,
  adminUpdateProduct,
  createProduct,
  updateProduct,
  deleteProduct
} = require("../controllers/adminController");


// ===== PAGES =====
router.get("/dashboard", isAdmin, dashboard);

router.get("/products", isAdmin, adminGetProducts);

router.get("/products/add", isAdmin, adminAddproducts);

router.get("/products/edit/:id", isAdmin, adminUpdateProduct);


// ===== ACTIONS =====
router.post("/products/add", isAdmin, upload.array("image", 5), createProduct);

router.post("/products/edit/:id", isAdmin, upload.array("image", 5), updateProduct);

router.post("/products/delete/:id", isAdmin, deleteProduct);

//module.exports = router;

module.exports = router;