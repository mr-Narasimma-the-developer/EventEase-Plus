const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const {
  getServiceRecommendations,
  getVendorRecommendations
} = require('../controllers/recommendationController');

// Protected routes
router.get('/services', protect, getServiceRecommendations);
router.get('/vendors', getVendorRecommendations);

module.exports = router;