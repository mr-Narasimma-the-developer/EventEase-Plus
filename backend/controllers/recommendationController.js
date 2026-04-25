const Service = require('../models/Service');
const Booking = require('../models/Booking');
const VendorProfile = require('../models/VendorProfile');

// Get Service Recommendations (Content-Based Filtering)
const getServiceRecommendations = async (req, res) => {
  try {
    const userId = req.user._id;

    // Get user's past bookings
    const userBookings = await Booking.find({ userId })
      .populate('serviceId');

    // If user has no bookings, recommend top-rated services
    if (userBookings.length === 0) {
      const topServices = await Service.find()
        .populate('providerId', 'name location')
        .sort('-rating')
        .limit(10);

      return res.json({
        message: 'Top-rated services (no booking history)',
        recommendations: topServices
      });
    }

    // Extract categories and price ranges from past bookings
    const bookedCategories = [...new Set(userBookings.map(b => b.serviceId?.category).filter(Boolean))];
    const avgPrice = userBookings.reduce((sum, b) => sum + (b.serviceId?.price || 0), 0) / userBookings.length;

    // Find similar services
    const recommendations = await Service.find({
      category: { $in: bookedCategories },
      price: { $gte: avgPrice * 0.7, $lte: avgPrice * 1.3 },
      rating: { $gte: 4 }
    })
      .populate('providerId', 'name location')
      .limit(10);

    res.json({
      message: 'Personalized recommendations based on your bookings',
      recommendations,
      basedOn: {
        categories: bookedCategories,
        priceRange: `₹${Math.round(avgPrice * 0.7)} - ₹${Math.round(avgPrice * 1.3)}`
      }
    });

  } catch (error) {
    console.error('Recommendation error:', error);
    res.status(500).json({ message: 'Error generating recommendations', error: error.message });
  }
};

// Get Vendor Recommendations (AI Matching)
const getVendorRecommendations = async (req, res) => {
  try {
    const { budget, location, category } = req.query;

    if (!budget || !location) {
      return res.status(400).json({ message: 'Budget and location are required' });
    }

    // Find services matching criteria
    const services = await Service.find({
      ...(category && { category }),
      location: new RegExp(location, 'i')
    }).populate('providerId');

    // Get vendor profiles with trust scores
    const vendorMatches = [];

    for (const service of services) {
      if (!service.providerId) continue;

      const vendorProfile = await VendorProfile.findOne({ userId: service.providerId._id });
      
      if (!vendorProfile) continue;

      // Calculate match score
      let matchScore = 0;

      // Trust score component (40%)
      const trustComponent = (vendorProfile.trustScore / 100) * 40;
      matchScore += trustComponent;

      // Budget match component (30%)
      const budgetDiff = Math.abs(service.price - Number(budget));
      const budgetMatch = budgetDiff <= Number(budget) * 0.2 ? 30 : Math.max(0, 30 - (budgetDiff / Number(budget) * 30));
      matchScore += budgetMatch;

      // Location match component (20%)
      const locationMatch = service.location.toLowerCase().includes(location.toLowerCase()) ? 20 : 0;
      matchScore += locationMatch;

      // Experience component (10%)
      const experienceScore = Math.min((vendorProfile.completedEvents / 50) * 10, 10);
      matchScore += experienceScore;

      // Only include vendors with score > 50
      if (matchScore > 50) {
        vendorMatches.push({
          vendor: service.providerId,
          service,
          vendorProfile,
          matchScore: Math.round(matchScore),
          breakdown: {
            trustScore: Math.round(trustComponent),
            budgetMatch: Math.round(budgetMatch),
            locationMatch: Math.round(locationMatch),
            experience: Math.round(experienceScore)
          }
        });
      }
    }

    // Sort by match score
    vendorMatches.sort((a, b) => b.matchScore - a.matchScore);

    res.json({
      total: vendorMatches.length,
      criteria: { budget, location, category },
      recommendations: vendorMatches.slice(0, 10)
    });

  } catch (error) {
    console.error('Vendor recommendation error:', error);
    res.status(500).json({ message: 'Error generating vendor recommendations', error: error.message });
  }
};

module.exports = {
  getServiceRecommendations,
  getVendorRecommendations
};