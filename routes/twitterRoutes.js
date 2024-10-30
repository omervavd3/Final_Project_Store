const express = require('express');
const twitterRouter = express.Router();

const { postTweet } = require('../controllers/twitterController');
twitterRouter
    .post("/postTweet", postTweet)
module.exports = twitterRouter;