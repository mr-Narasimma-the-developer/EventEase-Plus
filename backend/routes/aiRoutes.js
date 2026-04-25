const express = require('express');
<<<<<<< HEAD
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const { chatbot } = require('../controllers/aiController');

router.post('/chat', protect, chatbot);
=======
const { getAIResponse, predictAttendance } = require('../controllers/aiController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/chat', protect, getAIResponse);
router.get('/predict/:eventId', protect, predictAttendance);
>>>>>>> ed34da906bb3faf0ea102d18bd8c416990098710

module.exports = router;