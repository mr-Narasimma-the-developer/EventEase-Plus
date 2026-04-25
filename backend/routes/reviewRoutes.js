const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
<<<<<<< HEAD
const multer = require('multer');
const {
  submitReview,
  getReviews,
  getVendorReviews
} = require('../controllers/reviewController');
=======
const { submitReview, getReviews, getVendorReviews } = require('../controllers/reviewController');
const multer = require('multer');
>>>>>>> ed34da906bb3faf0ea102d18bd8c416990098710

const storage = multer.diskStorage({});
const upload = multer({ storage });

router.post('/', protect, upload.array('images', 5), submitReview);
router.get('/', getReviews);
router.get('/vendor/:vendorId', getVendorReviews);

module.exports = router;