const mongoose = require('mongoose')

const Schema = mongoose.Schema;

const UserSchema = new Schema({
    name: String,
    password: String,
    gender:String,
});

const UserModel = mongoose.model("users", UserSchema);

module.exports = UserModel;