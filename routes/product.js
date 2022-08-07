const express = require("express");
const multer = require("multer");
const fs = require("fs");

const productControllers = require("../controllers/product");

const router = express.Router();

const fsProduct = multer.diskStorage({
  destination: (req, file, cb) => {
    const path = `images/product`;
    fs.mkdirSync(path, { recursive: true });
    cb(null, path);
  },
  filename: (req, file, cb) => {
    cb(null, new Date().toISOString() + "-" + file.originalname);
  },
});

router.post(
  "/add-product",
  multer({ storage: fsProduct }).array("images", 5),
  productControllers.addProduct
);

router.get("/search-product", productControllers.searchProduct);

router.get("/all-products", productControllers.allProducts);

module.exports = router;
