const Cart = require("../models/cart");
const Auth = require("../models/authentication");
const { validationResult } = require("express-validator");

exports.updateCart = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error = new Error("Validation Failed.");
    error.statusCode = 422;
    error.data = errors.array();
    throw error;
  }

  const userId = req.userId;
  const items = req.body.items;
  const qty = req.body.qty;
  //   const cartId = req.params.id;

  Auth.findById(userId)
    .then((user) => {
      return Cart.findById(user.cart);
    })
    .then((cartResult) => {
      cartResult.items = items;
      cartResult.qty = qty;
      return cartResult.save();
    })
    .then((result) => {
      res.status(200).json({
        message: "success",
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
      });
    })
    .catch((err) => {
      if (!res.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};
