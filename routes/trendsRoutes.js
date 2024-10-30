const express = require('express');
const router = express.Router();
const { getPerfumeTrends } = require('../controllers/trendsController');

// Define the route
router.get('/perfume-trends', getPerfumeTrends);

module.exports = router;
