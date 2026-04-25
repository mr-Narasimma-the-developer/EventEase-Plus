const Review = require('../models/Review');
const VendorProfile = require('../models/VendorProfile');
const Event = require('../models/Event');
const cloudinary = require('../config/cloudinary');

// Submit Review
const submitReview = async (req, res) => {
  try {
    const { targetId, targetType, rating, comment } = req.body;

    // Validate target type
    const validTypes = ['User', 'Event', 'Service'];
    if (!validTypes.includes(targetType)) {
      return res.status(400).json({ message: 'Invalid target type' });
    }

    // Check if already reviewed
    const existingReview = await Review.findOne({
      reviewerId: req.user._id,
      targetId,
      targetType
    });

    if (existingReview) {
      return res.status(400).json({ message: 'You have already reviewed this' });
    }

    // Handle image uploads
    let imageUrls = [];
    if (req.files && req.files.length > 0) {
      for (const file of req.files) {
        try {
          const result = await cloudinary.uploader.upload(file.path);
          imageUrls.push(result.secure_url);
        } catch (uploadError) {
          console.error('Image upload error:', uploadError);
        }
      }
    }

    const review = await Review.create({
      reviewerId: req.user._id,
      targetId,
      targetType,
      rating: Number(rating),
      comment,
      images: imageUrls
    });

    // Update vendor trust score if reviewing a vendor (User with vendor role)
    if (targetType === 'User') {
      const vendor = await VendorProfile.findOne({ userId: targetId });
      if (vendor) {
        const allReviews = await Review.find({ targetId, targetType: 'User' });
        const avgRating = allReviews.reduce((sum, r) => sum + r.rating, 0) / allReviews.length;
        
        // Recalculate trust score
        const reviewScore = (avgRating / 5) * 100 * 0.4;
        const eventScore = Math.min((vendor.completedEvents / 50) * 100, 100) * 0.3;
        const verificationScore = vendor.isVerified ? 100 * 0.2 : 0;
        const responseScore = 80 * 0.1;
        
        vendor.trustScore = Math.round(reviewScore + eventScore + verificationScore + responseScore);
        await vendor.save();
      }
    }

    const populatedReview = await Review.findById(review._id)
      .populate('reviewerId', 'name email');

    res.status(201).json({
      message: 'Review submitted successfully',
      review: populatedReview
    });

  } catch (error) {
    console.error('Review submission error:', error);
    res.status(500).json({ message: 'Error submitting review', error: error.message });
  }
};

// Get Reviews
const getReviews = async (req, res) => {
  try {
    const { targetId, targetType } = req.query;

    const query = {};
    if (targetId) query.targetId = targetId;
    if (targetType) query.targetType = targetType;

    const reviews = await Review.find(query)
      .populate('reviewerId', 'name email')
      .sort('-createdAt');

    res.json(reviews);

  } catch (error) {
    res.status(500).json({ message: 'Error fetching reviews', error: error.message });
  }
};

// Get Vendor Reviews
const getVendorReviews = async (req, res) => {
  try {
    const { vendorId } = req.params;

    const reviews = await Review.find({
      targetId: vendorId,
      targetType: 'User'  // Changed to 'User' for vendor reviews
    })
      .populate('reviewerId', 'name email')
      .sort('-createdAt');

    res.json(reviews);

  } catch (error) {
    res.status(500).json({ message: 'Error fetching vendor reviews', error: error.message });
  }
};

module.exports = {
  submitReview,
  getReviews,
  getVendorReviews
};