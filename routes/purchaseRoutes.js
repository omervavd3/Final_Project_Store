const express = require('express');
const purchaseRouter = express.Router();

const { addPurchase, getAllPurchases, getPurchasesById, getGenderComperason, getProductComperason } = require('../controllers/purchaseController');

purchaseRouter
    .post("/addPurchase", addPurchase)
    .get("/getAllPurchases", getAllPurchases)
    .get("/getPurchasesById", getPurchasesById)
    .get("/getGenderComperason", getGenderComperason)
    .get("/getProductComperason", getProductComperason)

module.exports = purchaseRouter;