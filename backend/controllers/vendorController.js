const VendorProfile = require('../models/VendorProfile');
<<<<<<< HEAD
const User = require('../models/User');
const Review = require('../models/Review');
const cloudinary = require('../config/cloudinary');

// Create Vendor Profile
const createProfile = async (req, res) => {
  try {
    const { bio, specializations } = req.body;

    // Check if profile already exists
    const existingProfile = await VendorProfile.findOne({ userId: req.user._id });
    
    if (existingProfile) {
      return res.status(400).json({ message: 'Vendor profile already exists. Use update endpoint.' });
    }

    // Create new profile
    const profile = await VendorProfile.create({
      userId: req.user._id,
      bio: bio || '',
      specializations: specializations || [],
      trustScore: 0,
      completedEvents: 0,
      isVerified: false
    });

    res.status(201).json({
      message: 'Vendor profile created successfully',
      profile
    });

  } catch (error) {
    console.error('Profile creation error:', error);
    res.status(500).json({ message: 'Error creating profile', error: error.message });
  }
};

// Get Own Vendor Profile
const getProfile = async (req, res) => {
  try {
    const profile = await VendorProfile.findOne({ userId: req.user._id })
      .populate('userId', 'name email phone location');

    if (!profile) {
      return res.status(404).json({ message: 'Vendor profile not found' });
    }

    // Get reviews
    const reviews = await Review.find({ 
      targetId: req.user._id, 
      targetType: 'User' 
    }).populate('reviewerId', 'name email');

    res.json({
      profile,
      reviews,
      reviewCount: reviews.length,
      avgRating: reviews.length > 0 
        ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
        : 0
    });

=======
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
>>>>>>> ed34da906bb3faf0ea102d18bd8c416990098710
  } catch (error) {
    res.status(500).json({ message: 'Error fetching profile', error: error.message });
  }
};

// Update Vendor Profile
<<<<<<< HEAD
const updateProfile = async (req, res) => {
  try {
    const { bio, specializations } = req.body;

    let profile = await VendorProfile.findOne({ userId: req.user._id });

    if (!profile) {
      // Create profile if doesn't exist
      profile = await VendorProfile.create({
        userId: req.user._id,
        bio: bio || '',
        specializations: specializations || [],
        trustScore: 0,
        completedEvents: 0
      });
    } else {
      // Update existing profile
      if (bio) profile.bio = bio;
      if (specializations) profile.specializations = specializations;
      await profile.save();
    }

    // Handle image uploads if present
    if (req.files && req.files.length > 0) {
      for (const file of req.files) {
        try {
          const result = await cloudinary.uploader.upload(file.path);
          profile.portfolioImages.push(result.secure_url);
        } catch (uploadError) {
          console.error('Image upload error:', uploadError);
        }
      }
      await profile.save();
    }

    res.json({
      message: 'Profile updated successfully',
      profile
    });

  } catch (error) {
    console.error('Profile update error:', error);
=======
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
>>>>>>> ed34da906bb3faf0ea102d18bd8c416990098710
    res.status(500).json({ message: 'Error updating profile', error: error.message });
  }
};

<<<<<<< HEAD
// Search Vendors
const searchVendors = async (req, res) => {
  try {
    const { location, specialization, verified, minTrustScore } = req.query;

    const query = {};
    
    if (verified === 'true') {
      query.isVerified = true;
    }
    
    if (minTrustScore) {
      query.trustScore = { $gte: Number(minTrustScore) };
    }
    
    if (specialization) {
      query.specializations = { $in: [specialization] };
    }

    const vendors = await VendorProfile.find(query)
      .populate('userId', 'name email phone location');

    // Filter by location if provided
    let filteredVendors = vendors;
    if (location) {
      filteredVendors = vendors.filter(v => 
        v.userId.location && v.userId.location.toLowerCase().includes(location.toLowerCase())
      );
    }

    res.json(filteredVendors);

  } catch (error) {
    res.status(500).json({ message: 'Error searching vendors', error: error.message });
  }
};

// Get Vendor By ID (Public)
const getVendorById = async (req, res) => {
  try {
    const { id } = req.params;

    const profile = await VendorProfile.findOne({ userId: id })
      .populate('userId', 'name email phone location');

    if (!profile) {
      return res.status(404).json({ message: 'Vendor profile not found' });
    }

    // Get reviews
    const reviews = await Review.find({ 
      targetId: id, 
      targetType: 'User' 
    }).populate('reviewerId', 'name email');
=======
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
>>>>>>> ed34da906bb3faf0ea102d18bd8c416990098710

    res.json({
      profile,
      reviews,
<<<<<<< HEAD
      reviewCount: reviews.length,
      avgRating: reviews.length > 0 
        ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
        : 0
    });

=======
      services,
      trustScore
    });
>>>>>>> ed34da906bb3faf0ea102d18bd8c416990098710
  } catch (error) {
    res.status(500).json({ message: 'Error fetching vendor', error: error.message });
  }
};

<<<<<<< HEAD
// Upload Verification Documents
const uploadVerificationDocuments = async (req, res) => {
  try {
    const { documentType, documentName } = req.body;

    if (!req.file) {
      return res.status(400).json({ message: 'Please upload a document' });
    }

    // Upload to Cloudinary
    const result = await cloudinary.uploader.upload(req.file.path);

    // Get or create vendor profile
    let vendor = await VendorProfile.findOne({ userId: req.user._id });
    
    if (!vendor) {
      vendor = await VendorProfile.create({
        userId: req.user._id,
        bio: '',
        specializations: [],
        trustScore: 0,
        completedEvents: 0,
        isVerified: false
      });
    }

    // Add document
    vendor.verificationDocuments.push({
      documentType,
      documentUrl: result.secure_url,
      documentName: documentName || req.file.originalname,
      status: 'pending',
      uploadedAt: new Date()
    });

    // Update verification status to pending
    if (vendor.verificationStatus === 'unverified' || vendor.verificationStatus === 'rejected') {
      vendor.verificationStatus = 'pending';
    }

    await vendor.save();

    res.json({
      message: 'Document uploaded successfully. Awaiting admin verification.',
      vendor
    });

  } catch (error) {
    console.error('Document upload error:', error);
    res.status(500).json({ message: 'Error uploading document', error: error.message });
  }
};

// Get Verification Status
const getVerificationStatus = async (req, res) => {
  try {
    const vendor = await VendorProfile.findOne({ userId: req.user._id });

    if (!vendor) {
      return res.json({
        verificationStatus: 'unverified',
        isVerified: false,
        verificationBadge: 'none',
        documents: [],
        verificationNotes: '',
        trustScore: 0,
        message: 'No profile found. Upload documents to get verified.'
      });
    }

    res.json({
      verificationStatus: vendor.verificationStatus,
      isVerified: vendor.isVerified,
      verificationBadge: vendor.verificationBadge,
      documents: vendor.verificationDocuments,
      verificationNotes: vendor.verificationNotes,
      trustScore: vendor.trustScore
    });

  } catch (error) {
    res.status(500).json({ message: 'Error fetching verification status', error: error.message });
  }
};

// Recalculate Trust Score
const recalculateTrustScore = async (vendorId) => {
  try {
    const vendor = await VendorProfile.findOne({ userId: vendorId });
    
    if (!vendor) {
      return;
    }

    // Get reviews
    const reviews = await Review.find({ targetId: vendorId, targetType: 'User' });
    const avgRating = reviews.length > 0 
      ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length 
      : 0;

    // Calculate trust score components
    const reviewScore = (avgRating / 5) * 100 * 0.4;
    const eventScore = Math.min((vendor.completedEvents / 50) * 100, 100) * 0.3;
    const verificationScore = vendor.isVerified ? 100 * 0.2 : 0;
    const responseScore = 80 * 0.1; // Default response rate

    vendor.trustScore = Math.round(reviewScore + eventScore + verificationScore + responseScore);
    await vendor.save();

    return vendor.trustScore;

  } catch (error) {
    console.error('Trust score calculation error:', error);
=======
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
>>>>>>> ed34da906bb3faf0ea102d18bd8c416990098710
  }
};

module.exports = {
<<<<<<< HEAD
  createProfile,
  getProfile,
  updateProfile,
  searchVendors,
  getVendorById,
  uploadVerificationDocuments,
  getVerificationStatus,
  recalculateTrustScore
=======
  getVendorProfile,
  updateVendorProfile,
  getVendorById,
  searchVendors
>>>>>>> ed34da906bb3faf0ea102d18bd8c416990098710
};