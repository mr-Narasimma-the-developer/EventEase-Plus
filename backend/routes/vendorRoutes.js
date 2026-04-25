const express = require('express');
<<<<<<< HEAD
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

=======
const {
  getVendorProfile,
  updateVendorProfile,
  getVendorById,
  searchVendors
} = require('../controllers/vendorController');
const { protect } = require('../middleware/authMiddleware');
const { upload } = require('../config/cloudinary');

const router = express.Router();

router.get('/profile', protect, getVendorProfile);
router.put('/profile', protect, upload.array('portfolio', 10), updateVendorProfile);
router.get('/search', searchVendors);
router.get('/:id', getVendorById);

>>>>>>> ed34da906bb3faf0ea102d18bd8c416990098710
module.exports = router;