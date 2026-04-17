const express = require('express');
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

module.exports = router;