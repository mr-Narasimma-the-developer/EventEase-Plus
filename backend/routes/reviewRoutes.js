const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const { submitReview, getReviews, getVendorReviews } = require('../controllers/reviewController');
const multer = require('multer');

const storage = multer.diskStorage({});
const upload = multer({ storage });

router.post('/', protect, upload.array('images', 5), submitReview);
router.get('/', getReviews);
router.get('/vendor/:vendorId', getVendorReviews);

module.exports = router;