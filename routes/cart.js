const express = require("express");
const { body } = require("express-validator");

const cartControllers = require("../controllers/cart");
const isAuth = require("../middleware/authentication");

const router = express.Router();

router.get("/create-cart", isAuth, cartControllers.createCart);

router.post("/update-cart", isAuth, cartControllers.updateCart);

module.exports = router;
