const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const {
  predictAttendance,
  getAttendanceStats
} = require('../controllers/predictionController');

router.get('/:eventId/predict', protect, predictAttendance);
router.get('/:eventId/stats', protect, getAttendanceStats);

module.exports = router;