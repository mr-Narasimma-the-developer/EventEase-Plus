const express = require('express');
<<<<<<< HEAD
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
=======
const { registerUser, loginUser, getUserProfile, updateProfile } = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

>>>>>>> ed34da906bb3faf0ea102d18bd8c416990098710
router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/profile', protect, getUserProfile);
router.put('/profile', protect, updateProfile);
<<<<<<< HEAD

module.exports = router;
=======
module.exports = router;
>>>>>>> ed34da906bb3faf0ea102d18bd8c416990098710
