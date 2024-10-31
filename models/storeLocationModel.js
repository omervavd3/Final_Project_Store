const mongoose = require('mongoose')

const Schema = mongoose.Schema;

const StoreLocationSchema = new Schema({
    lat: Number,
    lng: Number,
    name: String,
    phone: Number,
    city: String,
});

const StoreLocationModel = mongoose.model("StoreLocation", StoreLocationSchema);

module.exports = StoreLocationModel;