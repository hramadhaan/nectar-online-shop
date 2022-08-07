const express = require("express");
const { body } = require("express-validator");
const multer = require("multer");
const fs = require("fs");

const Auth = require("../models/authentication");

const authControllers = require("../controllers/authentication");
const isAuth = require("../middleware/authentication");

const router = express.Router();

router.post(
  "/register",
  [
    body("email")
      .isEmail()
      .withMessage("Email tidak terdaftar nih, gunakan email mu yg aktif ya")
      .custom((value) => {
        return Auth.findOne({ email: value }).then((userDoc) => {
          if (userDoc)
            return Promise.reject(
              "Wah, alamat Email kamu sudah pernah didaftarkan"
            );
        });
      })
      .normalizeEmail(),
    body("phone")
      .trim()
      .custom((value) => {
        return Auth.findOne({ phone: value }).then((userDoc) => {
          if (userDoc) {
            return Promise.reject(
              "Wah, nomor Telfon mu sudah pernah didaftarkan"
            );
          }
        });
      }),
    body("password")
      .trim()
      .isLength({ min: 5 })
      .withMessage("Passwordnya minimal 5 karakter ya"),
    body("name").trim().not().isEmpty().withMessage("Masukkan Nama kamu ya"),
  ],
  authControllers.register
);

router.post(
  "/login",
  [
    body("email")
      .isEmail()
      .withMessage("Maaf, masukkan email Anda yang valid")
      .normalizeEmail(),
    body("password")
      .trim()
      .not()
      .isEmpty()
      .withMessage("Maaf, password Anda tidak boleh kosong"),
  ],
  authControllers.login
);

router.get("/profile", isAuth, authControllers.profile);

module.exports = router;
