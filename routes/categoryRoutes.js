const express = require('express');
const categoryRouter = express.Router();

const { addCategory, getAllCategories, deleteCategory } = require('../controllers/categoryController');

categoryRouter
    .post("/addCategory", addCategory)
    .get("/getAllCategories", getAllCategories)
    .delete("/deleteCategory", deleteCategory)

module.exports = categoryRouter;