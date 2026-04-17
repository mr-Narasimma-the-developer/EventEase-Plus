const express = require('express');
const {
  getRecommendedServices,
  updateServiceTrustScores
} = require('../controllers/recommendationController');
const { protect, adminOnly } = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/', getRecommendedServices);
router.post('/update-trust-scores', protect, adminOnly, updateServiceTrustScores);

module.exports = router;