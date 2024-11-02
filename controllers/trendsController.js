const axios = require('axios');
const apiKey = process.env.NEWS_API_KEY;

const getPerfumeTrends = async (req, res) => {
    const perfumeKeyword = '(Fragrance) AND (perfume OR cologne) AND (gift OR top OR best) AND (trend OR trending OR trendy) AND (scent) AND (dior OR chanel)';

    try {
        const response = await axios.get(`https://newsapi.org/v2/everything?q=${perfumeKeyword}&apiKey=${apiKey}`);
        const articles = response.data.articles.map(article => ({
            title: article.title,
            description: article.description,
            url: article.url,
            image: article.urlToImage
        }));
        res.json({ success: true, data: articles });
    } catch (error) {
        console.error("Error fetching news articles:", error);
        res.status(500).json({
            success: false,
            message: "Failed to fetch perfume trends data"
        });
    }
};

module.exports = { getPerfumeTrends };