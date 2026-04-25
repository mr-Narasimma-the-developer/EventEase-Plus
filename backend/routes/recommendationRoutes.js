const express = require('express');
<<<<<<< HEAD
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const {
  getServiceRecommendations,
  getVendorRecommendations
} = require('../controllers/recommendationController');

// Protected routes
router.get('/services', protect, getServiceRecommendations);
router.get('/vendors', getVendorRecommendations);
=======
const {
  getRecommendedServices,
  updateServiceTrustScores
} = require('../controllers/recommendationController');
const { protect, adminOnly } = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/', getRecommendedServices);
router.post('/update-trust-scores', protect, adminOnly, updateServiceTrustScores);
>>>>>>> ed34da906bb3faf0ea102d18bd8c416990098710

module.exports = router;