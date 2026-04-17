const VendorProfile = require('../models/VendorProfile');
const Review = require('../models/Review');
const Service = require('../models/Service');
const User = require('../models/User');

// Calculate Trust Score
const calculateTrustScore = (reviews, completedEvents, isVerified, responseRate) => {
  const avgRating = reviews.length > 0 
    ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length 
    : 0;
  
  const reviewScore = (avgRating / 5) * 100;
  const eventScore = Math.min(completedEvents * 2, 100);
  const verificationScore = isVerified ? 100 : 0;
  const responseScore = responseRate * 100;

  const trustScore = (
    (reviewScore * 0.4) +
    (eventScore * 0.3) +
    (verificationScore * 0.2) +
    (responseScore * 0.1)
  );

  return Math.round(trustScore * 10) / 10;
};

// Get/Create Vendor Profile
const getVendorProfile = async (req, res) => {
  try {
    let profile = await VendorProfile.findOne({ userId: req.user._id });
    
    if (!profile) {
      profile = await VendorProfile.create({ userId: req.user._id });
    }

    res.json(profile);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching profile', error: error.message });
  }
};

// Update Vendor Profile
const updateVendorProfile = async (req, res) => {
  try {
    const { bio, specializations } = req.body;
    
    let profile = await VendorProfile.findOne({ userId: req.user._id });
    
    if (!profile) {
      profile = await VendorProfile.create({ userId: req.user._id });
    }

    profile.bio = bio || profile.bio;
    profile.specializations = specializations || profile.specializations;
    
    if (req.files && req.files.length > 0) {
      const newImages = req.files.map(file => file.path);
      profile.portfolioImages = [...profile.portfolioImages, ...newImages];
    }

    await profile.save();
    res.json(profile);
  } catch (error) {
    res.status(500).json({ message: 'Error updating profile', error: error.message });
  }
};

// Get Vendor with Trust Score
const getVendorById = async (req, res) => {
  try {
    const profile = await VendorProfile.findOne({ userId: req.params.id })
      .populate('userId', 'name email phone location isVerified');
    
    if (!profile) {
      return res.status(404).json({ message: 'Vendor not found' });
    }

    const reviews = await Review.find({ 
      targetId: req.params.id, 
      targetType: 'vendor' 
    }).populate('reviewerId', 'name');

    const services = await Service.find({ providerId: req.params.id });

    const trustScore = calculateTrustScore(
      reviews,
      profile.completedEvents,
      profile.isVerified,
      profile.responseRate
    );

    profile.trustScore = trustScore;
    await profile.save();

    res.json({
      profile,
      reviews,
      services,
      trustScore
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching vendor', error: error.message });
  }
};

// Search Vendors with Trust Score Ranking
const searchVendors = async (req, res) => {
  try {
    const { category, location, minTrustScore } = req.query;
    
    let filter = {};
    
    const profiles = await VendorProfile.find(filter)
      .populate('userId', 'name email phone location isVerified');

    const vendorsWithScores = await Promise.all(
      profiles.map(async (profile) => {
        const reviews = await Review.find({ 
          targetId: profile.userId._id, 
          targetType: 'vendor' 
        });

        const trustScore = calculateTrustScore(
          reviews,
          profile.completedEvents,
          profile.isVerified,
          profile.responseRate
        );

        return {
          ...profile.toObject(),
          trustScore
        };
      })
    );

    let filtered = vendorsWithScores;
    
    if (minTrustScore) {
      filtered = filtered.filter(v => v.trustScore >= Number(minTrustScore));
    }

    filtered.sort((a, b) => b.trustScore - a.trustScore);

    res.json(filtered);
  } catch (error) {
    res.status(500).json({ message: 'Error searching vendors', error: error.message });
  }
};

module.exports = {
  getVendorProfile,
  updateVendorProfile,
  getVendorById,
  searchVendors
};