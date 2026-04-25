const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const { chatbot } = require('../controllers/aiController');

router.post('/chat', protect, chatbot);

module.exports = router;