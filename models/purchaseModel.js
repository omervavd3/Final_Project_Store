const mongoose = require('mongoose')

const Schema = mongoose.Schema;

const PurchaseSchema = new Schema({
    userId: String,
    userName: String,
    productsIds: [String],
    productsTitels: [String],
    productsAmounts: [Number],
    totalPrice: Number,
    userGender: String,
});

const PurchaseModel = mongoose.model("purchase", PurchaseSchema);

module.exports = PurchaseModel;