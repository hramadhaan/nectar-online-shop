const Auth = require("../models/authentication");
const Cart = require('../models/cart')
const bcryptjs = require("bcryptjs");
const jwt = require("jsonwebtoken");
const fs = require("fs");
const { validationResult } = require("express-validator");
require("dotenv").config();

exports.register = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error = new Error("Validation Failed.");
    error.statusCode = 422;
    error.data = errors.array();
    throw error;
  }

  //   Body Request
  const name = req.body.name;
  const email = req.body.email;
  const phone = req.body.phone;
  const password = req.body.password;

  bcryptjs
    .hash(password, 12)
    .then((hashedPw) => {
      const auth = new Auth({
        name,
        email,
        phone,
        password: hashedPw,
      });
      return auth.save();
    })
    .then((result) => {
      res.status(201).json({
        success: true,
        message: "Pendaftaran Berhasil",
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

exports.login = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error = new Error("Validation Failed.");
    error.statusCode = 422;
    error.data = errors.array();
    throw error;
  }

  const email = req.body.email;
  const password = req.body.password;

  let dataUser;

  Auth.findOne({ email: email })
    .then((user) => {
      if (!user) {
        res.status(403).json({
          success: false,
          message: "Akun-mu tidak terdaftar",
        });
      }

      dataUser = user;

      return bcryptjs.compare(password, user.password);
    })
    .then((isEqual) => {
      if (!isEqual) {
        res.status(403).json({
          success: false,
          message: "Password yang kamu masukkan salah",
        });
      }

      const token = jwt.sign(
        {
          userId: dataUser._id.toString(),
        },
        process.env.JWT_PASSWORD
      );

      res.status(201).json({
        success: true,
        message: "Yeay, login kamu berhasil",
        token: token,
        data: dataUser,
      });
    })
    .catch((err) => {
      if (!res.statusCode) {
        err.statusCode = 422;
      }
      next(err);
    });
};
