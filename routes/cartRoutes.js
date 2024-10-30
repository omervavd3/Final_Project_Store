const express = require('express');
const cartRouter = express.Router();

const { getUserCart, addToCart, removeOneFromCart, removeAllFromCart, deleteFromDeleteCategory, amountOfProductsInCart, clearCartAfterPurchase, deleteFromDeleteProduct } = require('../controllers/cartController');

cartRouter
    .get("/getUserCart", getUserCart)
    .post("/addToCart", addToCart)
    .delete("/removeOneFromCart", removeOneFromCart)
    .delete("/removeAllFromCart", removeAllFromCart)
    .delete("/deleteCategory", deleteFromDeleteCategory)
    .get("/amountOfProductsInCart", amountOfProductsInCart)
    .get("/clearCartAfterPurchase", clearCartAfterPurchase)
    .delete("/deleteFromDeleteProduct", deleteFromDeleteProduct)

module.exports = cartRouter;