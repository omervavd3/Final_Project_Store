const mongoose = require('mongoose');
const {ProductSchema} = require('./productModel');

const Schema = mongoose.Schema;

const CartSchema = new Schema({
    userId: String,
    productId: String,
    amount: Number
});

const CartModel = mongoose.model("cart", CartSchema);

module.exports = CartModel;