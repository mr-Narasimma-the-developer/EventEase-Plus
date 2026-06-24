const express = require('express');
const router = express.Router();
const { aiChatbot } = require('../controllers/aiController');

// AI Chatbot endpoint
router.post('/chat', aiChatbot);

module.exports = router;