const User = require('../models/User');
<<<<<<< HEAD
const Event = require('../models/Event');
const Service = require('../models/Service');
const Booking = require('../models/Booking');
const VendorProfile = require('../models/VendorProfile');
const Review = require('../models/Review');
const EventAttendance = require('../models/EventAttendance');
const Notification = require('../models/Notification');

// Verify Vendor With Badge
const verifyVendorWithBadge = async (req, res) => {
  try {
    const { vendorId } = req.params;
    const { badgeType } = req.body;

    const vendor = await VendorProfile.findOne({ userId: vendorId });
    
    if (!vendor) {
      return res.status(404).json({ message: 'Vendor profile not found' });
    }

    vendor.isVerified = true;
    vendor.verificationBadge = badgeType || 'standard';
    await vendor.save();

    // Recalculate trust score
    const reviews = await Review.find({ targetId: vendorId, targetType: 'User' });
    const avgRating = reviews.length > 0 
      ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length 
      : 0;

    const reviewScore = (avgRating / 5) * 100 * 0.4;
    const eventScore = Math.min((vendor.completedEvents / 50) * 100, 100) * 0.3;
    const verificationScore = 100 * 0.2;
    const responseScore = 80 * 0.1;

    vendor.trustScore = Math.round(reviewScore + eventScore + verificationScore + responseScore);
    await vendor.save();

    res.json({
      message: 'Vendor verified successfully',
      vendor
    });

=======
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
>>>>>>> ed34da906bb3faf0ea102d18bd8c416990098710
  } catch (error) {
    res.status(500).json({ message: 'Error verifying vendor', error: error.message });
  }
};

<<<<<<< HEAD
// Get All Events
=======
// Get All Events (for moderation)
>>>>>>> ed34da906bb3faf0ea102d18bd8c416990098710
const getAllEvents = async (req, res) => {
  try {
    const events = await Event.find()
      .populate('organizerId', 'name email')
<<<<<<< HEAD
      .sort('-createdAt')
      .limit(100);

    res.json(events);

=======
      .sort('-createdAt');
    
    res.json(events);
>>>>>>> ed34da906bb3faf0ea102d18bd8c416990098710
  } catch (error) {
    res.status(500).json({ message: 'Error fetching events', error: error.message });
  }
};

<<<<<<< HEAD
// Delete Event
const deleteEvent = async (req, res) => {
  try {
    const { eventId } = req.params;

=======
// Delete Event (moderation)
const deleteEvent = async (req, res) => {
  try {
    const { eventId } = req.params;
    const { reason } = req.body;
    
>>>>>>> ed34da906bb3faf0ea102d18bd8c416990098710
    const event = await Event.findById(eventId);
    
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

<<<<<<< HEAD
    // Delete associated attendance records
    await EventAttendance.deleteMany({ eventId });

    // Delete event
    await Event.findByIdAndDelete(eventId);

    res.json({ message: 'Event deleted successfully' });

=======
    await Event.findByIdAndDelete(eventId);
    
    res.json({ message: 'Event deleted successfully' });
>>>>>>> ed34da906bb3faf0ea102d18bd8c416990098710
  } catch (error) {
    res.status(500).json({ message: 'Error deleting event', error: error.message });
  }
};

// Get System Analytics
const getSystemAnalytics = async (req, res) => {
  try {
<<<<<<< HEAD
    const totalUsers = await User.countDocuments();
    const totalEvents = await Event.countDocuments();
    const totalServices = await Service.countDocuments();
    const totalBookings = await Booking.countDocuments();

    const participants = await User.countDocuments({ role: 'participant' });
    const organizers = await User.countDocuments({ role: 'organizer' });
    const vendors = await User.countDocuments({ role: 'vendor' });
    const admins = await User.countDocuments({ role: 'admin' });

    const bookings = await Booking.find();
    const totalRevenue = bookings.reduce((sum, booking) => {
      return sum + (booking.totalPrice || 0);
    }, 0);

    const recentUsers = await User.find()
      .select('name email role createdAt location')
      .sort('-createdAt')
      .limit(10);

    res.json({
      totalUsers,
      totalEvents,
      totalServices,
      totalBookings,
      totalRevenue,
      usersByRole: {
        participant: participants,
        organizer: organizers,
        vendor: vendors,
        admin: admins
      },
      recentUsers,
      timestamp: new Date()
    });

  } catch (error) {
    console.error('Analytics error:', error);
    res.status(500).json({ message: 'Error fetching analytics', error: error.message });
  }
};

// Get Fraud Alerts
=======
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
>>>>>>> ed34da906bb3faf0ea102d18bd8c416990098710
const getFraudAlerts = async (req, res) => {
  try {
    const vendors = await VendorProfile.find()
      .populate('userId', 'name email location createdAt');
    
    const reviews = await Review.find().populate('reviewerId targetId');

    const fraudAlerts = [];

    for (const vendor of vendors) {
<<<<<<< HEAD
      if (!vendor.userId) continue;

      const vendorReviews = reviews.filter(r => 
        r.targetType === 'User' && 
        r.targetId && 
        r.targetId.toString() === vendor.userId._id.toString()
=======
      const vendorReviews = reviews.filter(r => 
        r.targetType === 'vendor' && r.targetId.toString() === vendor.userId._id.toString()
>>>>>>> ed34da906bb3faf0ea102d18bd8c416990098710
      );

      let suspicionScore = 0;
      const reasons = [];

<<<<<<< HEAD
      // Check 1: Too many 5-star reviews recently
=======
      // Check 1: Too many 5-star reviews in short time
>>>>>>> ed34da906bb3faf0ea102d18bd8c416990098710
      const recentReviews = vendorReviews.filter(r => 
        new Date(r.createdAt) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
      );
      const fiveStarRecent = recentReviews.filter(r => r.rating === 5).length;
      if (fiveStarRecent >= 5) {
        suspicionScore += 30;
        reasons.push(`${fiveStarRecent} five-star reviews in last 7 days`);
      }

<<<<<<< HEAD
      // Check 2: New account with high trust score
=======
      // Check 2: New vendor with high trust score
>>>>>>> ed34da906bb3faf0ea102d18bd8c416990098710
      const accountAge = (Date.now() - new Date(vendor.userId.createdAt)) / (1000 * 60 * 60 * 24);
      if (accountAge < 30 && vendor.trustScore > 80) {
        suspicionScore += 25;
        reasons.push('New account (<30 days) with high trust score');
      }

<<<<<<< HEAD
      // Check 3: Many events but few reviews
=======
      // Check 3: Claimed events but no reviews
>>>>>>> ed34da906bb3faf0ea102d18bd8c416990098710
      if (vendor.completedEvents > 10 && vendorReviews.length < 3) {
        suspicionScore += 20;
        reasons.push('Many events claimed but few reviews');
      }

<<<<<<< HEAD
      // Check 4: Reviews from same accounts
=======
      // Check 4: All reviews from same reviewers
>>>>>>> ed34da906bb3faf0ea102d18bd8c416990098710
      const reviewerIds = vendorReviews.map(r => r.reviewerId._id.toString());
      const uniqueReviewers = new Set(reviewerIds).size;
      if (vendorReviews.length >= 5 && uniqueReviewers < 3) {
        suspicionScore += 35;
        reasons.push('Multiple reviews from same accounts');
      }

<<<<<<< HEAD
      // Check 5: Perfect rating
      const avgRating = vendorReviews.length > 0 
        ? vendorReviews.reduce((sum, r) => sum + r.rating, 0) / vendorReviews.length 
        : 0;
=======
      // Check 5: Perfect rating pattern
      const avgRating = vendorReviews.reduce((sum, r) => sum + r.rating, 0) / vendorReviews.length;
>>>>>>> ed34da906bb3faf0ea102d18bd8c416990098710
      if (vendorReviews.length >= 5 && avgRating === 5) {
        suspicionScore += 20;
        reasons.push('Perfect 5.0 rating across all reviews');
      }

<<<<<<< HEAD
=======
      // Flag if suspicion score is high
>>>>>>> ed34da906bb3faf0ea102d18bd8c416990098710
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

<<<<<<< HEAD
=======
    // Sort by suspicion score (highest first)
>>>>>>> ed34da906bb3faf0ea102d18bd8c416990098710
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

<<<<<<< HEAD
// Get All Users
const getAllUsers = async (req, res) => {
  try {
    const users = await User.find()
      .select('-password')
      .sort('-createdAt');

    res.json({
      total: users.length,
      users
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching users', error: error.message });
  }
};

// Update User Role
const updateUserRole = async (req, res) => {
  try {
    const { userId } = req.params;
    const { role } = req.body;

    const validRoles = ['participant', 'organizer', 'vendor', 'admin'];
    if (!validRoles.includes(role)) {
      return res.status(400).json({ message: 'Invalid role' });
    }

    const user = await User.findById(userId);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    user.role = role;
    await user.save();

    res.json({
      message: 'User role updated successfully',
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Error updating user', error: error.message });
  }
};

// Delete User
const deleteUser = async (req, res) => {
  try {
    const { userId } = req.params;

    const user = await User.findById(userId);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (userId === req.user._id.toString()) {
      return res.status(400).json({ message: 'Cannot delete your own account' });
    }

    await User.findByIdAndDelete(userId);

    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting user', error: error.message });
  }
};

// Get Pending Verifications
const getPendingVerifications = async (req, res) => {
  try {
    const pendingVendors = await VendorProfile.find({
      verificationStatus: 'pending'
    }).populate('userId', 'name email phone location');

    res.json({
      total: pendingVendors.length,
      vendors: pendingVendors
    });

  } catch (error) {
    res.status(500).json({ message: 'Error fetching pending verifications', error: error.message });
  }
};

// Approve Vendor Verification
const approveVendorVerification = async (req, res) => {
  try {
    const { vendorId } = req.params;
    const { badgeType, notes, customTrustScore } = req.body;

    const vendor = await VendorProfile.findOne({ userId: vendorId });
    
    if (!vendor) {
      return res.status(404).json({ message: 'Vendor profile not found' });
    }

    vendor.isVerified = true;
    vendor.verificationStatus = 'verified';
    vendor.verificationBadge = badgeType || 'standard';
    vendor.verificationNotes = notes || 'Verified by admin';

    // Approve all pending documents
    vendor.verificationDocuments.forEach(doc => {
      if (doc.status === 'pending') {
        doc.status = 'approved';
      }
    });

    // Set trust score
    if (customTrustScore) {
      vendor.trustScore = Number(customTrustScore);
    } else {
      const reviews = await Review.find({ targetId: vendorId, targetType: 'User' });
      const avgRating = reviews.length > 0 
        ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length 
        : 0;

      const reviewScore = (avgRating / 5) * 100 * 0.4;
      const eventScore = Math.min((vendor.completedEvents / 50) * 100, 100) * 0.3;
      const verificationScore = 100 * 0.2;
      const responseScore = 80 * 0.1;

      vendor.trustScore = Math.round(reviewScore + eventScore + verificationScore + responseScore);
    }

    await vendor.save();

    // Create notification
    try {
      await Notification.create({
        userId: vendorId,
        type: 'verification',
        title: 'Verification Approved! ✓',
        message: `Congratulations! Your vendor account has been verified. Your trust score is now ${vendor.trustScore}.`
      });
    } catch (notifError) {
      console.log('Notification creation failed:', notifError.message);
    }

    res.json({
      message: 'Vendor verified successfully',
      vendor
    });

  } catch (error) {
    console.error('Verification approval error:', error);
    res.status(500).json({ message: 'Error approving verification', error: error.message });
  }
};

// Reject Vendor Verification
const rejectVendorVerification = async (req, res) => {
  try {
    const { vendorId } = req.params;
    const { reason } = req.body;

    const vendor = await VendorProfile.findOne({ userId: vendorId });
    
    if (!vendor) {
      return res.status(404).json({ message: 'Vendor profile not found' });
    }

    vendor.verificationStatus = 'rejected';
    vendor.verificationNotes = reason || 'Verification rejected by admin';

    // Reject all pending documents
    vendor.verificationDocuments.forEach(doc => {
      if (doc.status === 'pending') {
        doc.status = 'rejected';
      }
    });

    await vendor.save();

    // Create notification
    try {
      await Notification.create({
        userId: vendorId,
        type: 'verification',
        title: 'Verification Rejected',
        message: `Your verification request has been rejected. Reason: ${reason || 'Please contact admin for details.'}`
      });
    } catch (notifError) {
      console.log('Notification creation failed:', notifError.message);
    }

    res.json({
      message: 'Verification rejected',
      vendor
    });

  } catch (error) {
    res.status(500).json({ message: 'Error rejecting verification', error: error.message });
  }
};

module.exports = {
=======

module.exports = {
  getAllUsers,
  verifyProvider,
  getDashboardStats,
  deleteUser,
>>>>>>> ed34da906bb3faf0ea102d18bd8c416990098710
  verifyVendorWithBadge,
  getAllEvents,
  deleteEvent,
  getSystemAnalytics,
<<<<<<< HEAD
  getFraudAlerts,
  getAllUsers,
  updateUserRole,
  deleteUser,
  getPendingVerifications,
  approveVendorVerification,
  rejectVendorVerification
};
=======
  getFraudAlerts
};
>>>>>>> ed34da906bb3faf0ea102d18bd8c416990098710
