const Product = require("../models/product");
const fs = require("fs");

const { validationResult } = require("express-validator");

exports.addProduct = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error = new Error("Validation Failed.");
    error.statusCode = 422;
    error.data = errors.array();
    throw error;
  }

  if (!req.files) {
    const error = new Error("Tidak ada foto yang Anda pilih");
    error.statusCode = 422;
    throw error;
  }

  const productName = req.body.name;
  const qtyStock = req.body.qty;
  const categoryId = req.body.category;
  const productDetail = req.body.detail;
  const productSize = req.body.size;
  const productPrice = req.body.price;
  const productImage = req.files;

  const imageList = productImage?.map((image) => image.path);

  const product = new Product({
    productName,
    qtyStock,
    categoryId,
    productDetail,
    productSize,
    productPrice,
    productImage: imageList,
  });

  product
    .save()
    .then((result) => {
      res.status(201).json({
        success: true,
        message: "Berhasil menambahkan produk",
        data: result,
      });
    })
    .catch((err) => {
      if (!res.statusCode) {
        err.statusCode = 422;
      }
      next(err);
    });
};

exports.searchProduct = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error = new Error("Validation Failed.");
    error.statusCode = 422;
    error.data = errors.array();
    throw error;
  }

  const search = req.query.search;

  Product.find({ productName: new RegExp(search, "i") }).populate('categoryId')
    .then((result) => {
      res.status(200).json({
        success: true,
        message: "Pencarian ditemukan",
        data: result,
      });
    })
    .catch((err) => {
      console.log("Error: ", err);
      if (!res.statusCode) {
        err.statusCode = 422;
      }
      next(err);
    });
};
