const mongoose = require('mongoose')

const Schema = mongoose.Schema;

const ProductSchema = new Schema({
    title: String,
    description: String,
    price: Number,
    amount: Number,
    img: {
        type: String,
        default: "https://www.tiffincurry.ca/wp-content/uploads/2021/02/default-product.png"
    },
    category: String,
    size: Number,
    sex: String
});

const ProductModel = mongoose.model("product", ProductSchema);

module.exports = ProductModel;
