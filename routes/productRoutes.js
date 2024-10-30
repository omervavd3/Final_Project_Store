const express = require('express');
const productRouter = express.Router();

const { getAllProducts, addProduct, updateProduct, getProductById, addToCart, removeOneFromCart, removeAllFromCart, deleteFromCategory, getByCategory, deleteFromDeleteProduct } = require('../controllers/productController');

productRouter
    .get("/getAllProducts", getAllProducts)
    .post("/addProduct", addProduct)
    .patch("/updateProduct", updateProduct)
    .post("/getProductById", getProductById)
    .patch("/addToCart", addToCart)
    .patch("/removeOneFromCart", removeOneFromCart)
    .patch("/removeAllFromCart", removeAllFromCart)
    .delete("/deleteCategory", deleteFromCategory)
    .post("/getByCategory", getByCategory)
    .delete("/deleteFromDeleteProduct", deleteFromDeleteProduct)

module.exports = productRouter;