const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const multer = require('multer');
const {
  createProfile,
  getProfile,
  updateProfile,
  searchVendors,
  getVendorById,
  uploadVerificationDocuments,
  getVerificationStatus
} = require('../controllers/vendorController');

// Multer configuration for file uploads
const storage = multer.diskStorage({});
const upload = multer({ storage });

// Public routes
router.get('/search', searchVendors);
router.get('/:id', getVendorById);

// Protected routes (require authentication)
router.post('/profile', protect, createProfile);
router.get('/profile/me', protect, getProfile);
router.put('/profile', protect, upload.array('portfolioImages', 5), updateProfile);

// Verification routes
router.post('/verification/upload', protect, upload.single('document'), uploadVerificationDocuments);
router.get('/verification/status', protect, getVerificationStatus);

module.exports = router;