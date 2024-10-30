const mongoose = require('mongoose')

const Schema = mongoose.Schema;

const CategorySchema = new Schema({
    category: String
});

const CategoryModel = mongoose.model("category", CategorySchema);

module.exports = CategoryModel;