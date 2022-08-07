const express = require("express");
const { body } = require("express-validator");

const cartControllers = require("../controllers/cart");
const isAuth = require("../middleware/authentication");

const router = express.Router();

router.get("/create-cart", isAuth, cartControllers.createCart);

// router.post("/update-cart", isAuth, cartControllers.updateCart);

router.post("/add-to-cart/:id", isAuth, cartControllers.addToCart);

router.get("/cart-user", isAuth, cartControllers.getCartUser);

router.post("/update-cart-user/:id", isAuth, cartControllers.updateCart);

router.get("/delete-cart-user", isAuth, cartControllers.deleteCartItems);

router.get('/all-carts/:id', cartControllers.getAllCart)

module.exports = router;
