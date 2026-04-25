const express = require('express');
const router = express.Router();

const { protect } = require('../middleware/authMiddleware');

// ✅ FIX: correct names from controller
const {
  registerUser,
  loginUser,
  getUserProfile,
  updateProfile
} = require('../controllers/authController');

// Routes
router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/profile', protect, getUserProfile);
router.put('/profile', protect, updateProfile);

module.exports = router;