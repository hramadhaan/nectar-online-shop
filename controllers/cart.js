const Cart = require("../models/cart");
const Auth = require("../models/authentication");
const ItemCart = require("../models/itemCart");
const Product = require("../models/product");

const { validationResult } = require("express-validator");
// Lodash
const some = require("lodash/some");
const mongoose = require("mongoose");

exports.createCart = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error = new Error("Validation Failed.");
    error.statusCode = 422;
    error.data = errors.array();
    throw error;
  }

  const userId = req.userId;

  const cart = new Cart({ userId });

  let cartData;

  cart
    .save()
    .then((cartResult) => {
      cartData = cartResult;
      return Auth.findById(userId);
    })
    .then((authResult) => {
      authResult.cart = cartData._id;
      return authResult.save();
    })
    .then((result) => {
      res.status(200).json({
        success: true,
        message: "Berhasil membuat cart baru",
        cartId: cartData._id,
      });
    })
    .catch((err) => {
      if (!res.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};

exports.addToCart = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error = new Error("Validation Failed.");
    error.statusCode = 422;
    error.data = errors.array();
    throw error;
  }

  const productId = req.body.product;
  const qty = req.body.qty;
  const cartId = req.params.id;

  const itemCart = new ItemCart({
    product: productId,
    qty: qty,
  });

  let itemCartId;
  let productData;

  itemCart
    .save()
    .then((resultItem) => {
      itemCartId = resultItem._id;
      return Product.findById(productId);
    })
    .then((prdata) => {
      productData = prdata;
      return Cart.findById(cartId).populate({
        path: "items",
        populate: {
          path: "product",
          model: "product",
        },
      });
    })
    .then((cartData) => {
      cartData.items = [...cartData.items, itemCartId];
      cartData.totalItems += Number(qty);
      cartData.total += Number(qty * productData.productPrice);
      return cartData.save();
    })
    .then((result) => {
      res.status(201).json({
        message: "Berhasil",
        success: true,
        data: result,
      });
    })
    .catch((err) => {
      if (!res.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};

exports.updateCart = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error = new Error("Validation Failed.");
    error.statusCode = 422;
    error.data = errors.array();
    throw error;
  }

  const qty = req.body.qty;
  const cartItem = req.params.id;

  ItemCart.findById(cartItem)
    .populate("product")
    .then((cartItemData) => {
      cartItemData.qty = qty;
      return cartItemData.save();
    })
    .then(() => {
      return Cart.findOne({ items: cartItem }).populate({
        path: "items",
        populate: {
          path: "product",
          model: "product",
        },
      });
    })
    .then((cartData) => {
      let totalItems = 0;
      let total = 0;
      cartData?.items?.forEach((item, index) => {
        totalItems += Number(item.qty);
        total += Number(item.qty * item.product.productPrice);
      });
      cartData.totalItems = totalItems;
      cartData.total = total;
      return cartData.save();
    })
    .then((saveCartData) => {
      res.status(201).json({
        success: true,
        message: "Berhasil Menyimpan data",
        data: saveCartData,
      });
    })
    .catch((err) => {
      if (!res.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};

exports.deleteCartItems = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error = new Error("Validation Failed.");
    error.statusCode = 422;
    error.data = errors.array();
    throw error;
  }

  const cartItem = req.query.cartItem;
  const cartId = req.query.cartId;
  let resultData;

  ItemCart.findByIdAndRemove(cartItem)
    .then(() => {
      return Cart.findById(cartId).populate({
        path: "items",
        populate: {
          path: "product",
          model: "product",
        },
      });
    })
    .then((cartData) => {
      let totalItems = 0;
      let total = 0;
      cartData?.items?.forEach((item, index) => {
        totalItems += Number(item.qty);
        total += Number(item.qty * item.product.productPrice);
      });
      cartData.totalItems = totalItems;
      cartData.total = total;
      cartData.items = cartData.items.filter((data) => data._id !== cartItem);
      return cartData.save();
    })
    .then((dataResult) => {
      resultData = dataResult;
      return Cart.findById(cartId);
    })
    .then((saveCart) => {
      saveCart.items = saveCart.items.filter(
        (item) => item.toString() !== cartItem
      );
      return saveCart.save();
    })
    .then(() => {
      res.status(200).json({
        success: true,
        message: "Berhasil menghapus data",
        data: resultData,
      });
    })
    .catch((err) => {
      if (!res.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};

exports.getCartUser = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error = new Error("Validation Failed.");
    error.statusCode = 422;
    error.data = errors.array();
    throw error;
  }

  const userId = req.userId;

  Auth.findById(userId)
    .then((resultAuth) => {
      if (!resultAuth) {
        res.status(404).json({
          success: false,
          message: "User tidak ditemukan",
        });
        return;
      }
      return Cart.findById(resultAuth.cart).populate([
        {
          path: "items",
          populate: {
            path: "product",
            model: "product",
            populate: {
              path: "qtyStock",
              model: "stock",
            },
          },
        },
        {
          path: "userId",
          model: "authentication",
        },
      ]);
    })
    .then((cartData) => {
      res.status(200).json({
        success: true,
        message: "Berhasil mendapatkan keranjang",
        data: cartData,
      });
    })
    .catch((err) => {
      if (!res.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};

exports.getAllCart = (req, res, next) => {
  const cartId = req.params.id;
  Cart.findById(cartId)
    .populate([
      {
        path: "items",
        populate: {
          path: "product",
          model: "product",
          populate: {
            path: "qtyStock",
            model: "stock",
          },
        },
      },
      {
        path: "userId",
        model: "authentication",
      },
    ])
    .then((result) => {
      res.status(200).json({
        data: result,
        message: "Hell no",
      });
    });
};
