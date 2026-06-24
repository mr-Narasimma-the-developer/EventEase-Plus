const express = require('express');
const router = express.Router();

const { protect } = require('../middleware/authMiddleware');

const {
  registerUser,
  loginUser,
  getMe,            // ✅ CORRECT NAME
  updateProfile
} = require('../controllers/authController');

router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/profile', protect, getMe);   // ✅ FIXED
router.put('/profile', protect, updateProfile);

module.exports = router;