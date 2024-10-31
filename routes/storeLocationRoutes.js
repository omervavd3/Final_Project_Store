const express = require('express');
const storeLocationRouter = express.Router();

const { addStoreLocation, getAllStoresLocations } = require('../controllers/stoleLocationController');

storeLocationRouter
    .post("/addStoreLocation", addStoreLocation)
    .get("/getAllStoresLocations", getAllStoresLocations)

module.exports = storeLocationRouter;