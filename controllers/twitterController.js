const { TwitterApi } = require('twitter-api-v2');
const twitterClient = new TwitterApi({
    appKey: process.env.API_KEY,
    appSecret: process.env.API_SECRET_KEY,
    accessToken: process.env.ACCESS_TOKEN,
    accessSecret: process.env.ACCESS_TOKEN_SECRET,
});

exports.postTweet = async(req,res) => {
    try {
        const {tweet} = req.body
        const response = await twitterClient.v2.tweet({ text: tweet });
        res.status(200).send({ success: true, response });
    } catch (error) {
        console.error("Error posting tweet:", error);
        res.status(500).send({ success: false, error: error.message });
    }
}