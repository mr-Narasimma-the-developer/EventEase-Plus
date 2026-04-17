const User = require('../models/User');
const Service = require('../models/Service');
const Booking = require('../models/Booking');

// Get All Users
const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password');
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Verify Provider
const verifyProvider = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (user.role !== 'provider') {
      return res.status(400).json({ message: 'User is not a provider' });
    }

    user.isVerified = true;
    await user.save();

    res.json({ message: 'Provider verified successfully', user });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get Dashboard Stats
const getDashboardStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalProviders = await User.countDocuments({ role: 'provider' });
    const totalCustomers = await User.countDocuments({ role: 'customer' });
    const verifiedProviders = await User.countDocuments({ role: 'provider', isVerified: true });
    const totalServices = await Service.countDocuments();
    const totalBookings = await Booking.countDocuments();
    const pendingBookings = await Booking.countDocuments({ status: 'pending' });
    const acceptedBookings = await Booking.countDocuments({ status: 'accepted' });

    res.json({
      totalUsers,
      totalProviders,
      totalCustomers,
      verifiedProviders,
      totalServices,
      totalBookings,
      pendingBookings,
      acceptedBookings
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Delete User
const deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    await User.findByIdAndDelete(req.params.id);
    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
// ADD THESE NEW FUNCTIONS

const VendorProfile = require('../models/VendorProfile');
const Event = require('../models/Event');
const Review = require('../models/Review');

// Verify Vendor with Badge
const verifyVendorWithBadge = async (req, res) => {
  try {
    const { userId } = req.params;
    const { badgeType } = req.body;
    
    const user = await User.findById(userId);
    if (!user || user.role !== 'vendor') {
      return res.status(400).json({ message: 'Invalid vendor' });
    }

    user.isVerified = true;
    await user.save();

    let profile = await VendorProfile.findOne({ userId });
    if (!profile) {
      profile = await VendorProfile.create({ userId });
    }

    profile.isVerified = true;
    profile.verificationBadge = badgeType || 'verified';
    await profile.save();

    res.json({ message: 'Vendor verified successfully', user, profile });
  } catch (error) {
    res.status(500).json({ message: 'Error verifying vendor', error: error.message });
  }
};

// Get All Events (for moderation)
const getAllEvents = async (req, res) => {
  try {
    const events = await Event.find()
      .populate('organizerId', 'name email')
      .sort('-createdAt');
    
    res.json(events);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching events', error: error.message });
  }
};

// Delete Event (moderation)
const deleteEvent = async (req, res) => {
  try {
    const { eventId } = req.params;
    const { reason } = req.body;
    
    const event = await Event.findById(eventId);
    
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    await Event.findByIdAndDelete(eventId);
    
    res.json({ message: 'Event deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting event', error: error.message });
  }
};

// Get System Analytics
const getSystemAnalytics = async (req, res) => {
  try {
    const totalEvents = await Event.countDocuments();
    const upcomingEvents = await Event.countDocuments({ status: 'upcoming' });
    const completedEvents = await Event.countDocuments({ status: 'completed' });
    
    const totalVendors = await User.countDocuments({ role: 'vendor' });
    const verifiedVendors = await VendorProfile.countDocuments({ isVerified: true });
    
    const totalParticipants = await User.countDocuments({ role: 'participant' });
    const totalOrganizers = await User.countDocuments({ role: 'organizer' });
    
    const totalReviews = await Review.countDocuments();
    const avgRating = await Review.aggregate([
      { $group: { _id: null, avg: { $avg: '$rating' } } }
    ]);

    res.json({
      events: {
        total: totalEvents,
        upcoming: upcomingEvents,
        completed: completedEvents
      },
      users: {
        participants: totalParticipants,
        organizers: totalOrganizers,
        vendors: totalVendors,
        verifiedVendors
      },
      reviews: {
        total: totalReviews,
        averageRating: avgRating.length > 0 ? avgRating[0].avg : 0
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching analytics', error: error.message });
  }
};
const getFraudAlerts = async (req, res) => {
  try {
    const vendors = await VendorProfile.find()
      .populate('userId', 'name email location createdAt');
    
    const reviews = await Review.find().populate('reviewerId targetId');

    const fraudAlerts = [];

    for (const vendor of vendors) {
      const vendorReviews = reviews.filter(r => 
        r.targetType === 'vendor' && r.targetId.toString() === vendor.userId._id.toString()
      );

      let suspicionScore = 0;
      const reasons = [];

      // Check 1: Too many 5-star reviews in short time
      const recentReviews = vendorReviews.filter(r => 
        new Date(r.createdAt) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
      );
      const fiveStarRecent = recentReviews.filter(r => r.rating === 5).length;
      if (fiveStarRecent >= 5) {
        suspicionScore += 30;
        reasons.push(`${fiveStarRecent} five-star reviews in last 7 days`);
      }

      // Check 2: New vendor with high trust score
      const accountAge = (Date.now() - new Date(vendor.userId.createdAt)) / (1000 * 60 * 60 * 24);
      if (accountAge < 30 && vendor.trustScore > 80) {
        suspicionScore += 25;
        reasons.push('New account (<30 days) with high trust score');
      }

      // Check 3: Claimed events but no reviews
      if (vendor.completedEvents > 10 && vendorReviews.length < 3) {
        suspicionScore += 20;
        reasons.push('Many events claimed but few reviews');
      }

      // Check 4: All reviews from same reviewers
      const reviewerIds = vendorReviews.map(r => r.reviewerId._id.toString());
      const uniqueReviewers = new Set(reviewerIds).size;
      if (vendorReviews.length >= 5 && uniqueReviewers < 3) {
        suspicionScore += 35;
        reasons.push('Multiple reviews from same accounts');
      }

      // Check 5: Perfect rating pattern
      const avgRating = vendorReviews.reduce((sum, r) => sum + r.rating, 0) / vendorReviews.length;
      if (vendorReviews.length >= 5 && avgRating === 5) {
        suspicionScore += 20;
        reasons.push('Perfect 5.0 rating across all reviews');
      }

      // Flag if suspicion score is high
      if (suspicionScore >= 40) {
        fraudAlerts.push({
          vendorId: vendor.userId._id,
          vendorName: vendor.userId.name,
          email: vendor.userId.email,
          trustScore: vendor.trustScore,
          completedEvents: vendor.completedEvents,
          reviewCount: vendorReviews.length,
          suspicionScore,
          reasons,
          severity: suspicionScore >= 70 ? 'HIGH' : suspicionScore >= 50 ? 'MEDIUM' : 'LOW'
        });
      }
    }

    // Sort by suspicion score (highest first)
    fraudAlerts.sort((a, b) => b.suspicionScore - a.suspicionScore);

    res.json({
      totalAlerts: fraudAlerts.length,
      alerts: fraudAlerts,
      timestamp: new Date()
    });

  } catch (error) {
    res.status(500).json({ message: 'Error detecting fraud', error: error.message });
  }
};


module.exports = {
  getAllUsers,
  verifyProvider,
  getDashboardStats,
  deleteUser,
  verifyVendorWithBadge,
  getAllEvents,
  deleteEvent,
  getSystemAnalytics,
  getFraudAlerts
};
