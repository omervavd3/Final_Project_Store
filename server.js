//port
const PORT = 8080;

//express
const express = require('express')
const app = express()

//for sharing data to D3.js
// const cors = require('cors');

//for cookies
const cookieParser = require('cookie-parser')
app.use(cookieParser())

//for mongoDB
const mongoose = require('mongoose')

//jQuery
const $ = require( "jquery" )

//for .env
require('dotenv').config();

//static files 
app.use(express.static('views'));

//to be able to get data from client add this line
app.use(express.json());

//mongoose connection
const uri = process.env.MONGO_URI; 

async function connectDB() {
    try {
        await mongoose.connect(uri);
        console.log('MongoDB connected successfully');
    } catch (error) {
        console.error('MongoDB connection error:', error);
    }
}

connectDB();

//routes
const userRouter = require('./routes/userRoutes');
const productRouter = require('./routes/productRoutes');
const categoryRouter = require("./routes/categoryRoutes");
const cartRouter = require("./routes/cartRoutes");
const purchaseRouter = require("./routes/purchaseRoutes");
app.use("/user", userRouter);
app.use("/product", productRouter);
app.use("/category", categoryRouter);
app.use("/cart", cartRouter);
app.use("/purchase", purchaseRouter);

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
const { TwitterApi } = require("twitter-api-v2");

const twitterClient = new TwitterApi({ appKey: 'NSpopso1DTIPAoU4mAuBaQZO3', appSecret: 'FFZGfTe3BGwQOJ8PPSaEneC6heLRL0SQEYSqRFaodEjgePTkm4', accessToken: '1851596838983303168-C7HIwSFB25oPXiTdQHFot6gar8dX3Q', accessSecret: 'Oo0Jfyc4gkTNVuvzUcGXSb36BaIk91IgrUTjiiXsGx2ip', });