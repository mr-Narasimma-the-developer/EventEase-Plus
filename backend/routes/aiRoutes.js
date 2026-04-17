const express = require('express');
const { getAIResponse, predictAttendance } = require('../controllers/aiController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/chat', protect, getAIResponse);
router.get('/predict/:eventId', protect, predictAttendance);

module.exports = router;