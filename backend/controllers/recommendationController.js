const Service = require('../models/Service');
<<<<<<< HEAD
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
=======
const User = require('../models/User');
const { calculateTrustScore } = require('../utils/trustScore');

// Get Recommended Services
const getRecommendedServices = async (req, res) => {
  const { category, location, maxPrice, peopleCount } = req.query;

  try {
    // Build filter
    let filter = { availability: true };
    if (category) filter.category = category;
    if (maxPrice) filter.price = { $lte: Number(maxPrice) };

    // Get services with provider info
    let services = await Service.find(filter).populate('providerId', 'name email phone rating isVerified location');

    // Filter by location match if provided
    if (location) {
      services = services.filter(service => {
        const serviceLocation = service.location.toLowerCase();
        const searchLocation = location.toLowerCase();
        return serviceLocation.includes(searchLocation);
      });
    }

    // Calculate average market price for category
    const avgMarketPrice = services.length > 0
      ? services.reduce((sum, s) => sum + s.price, 0) / services.length
      : 5000;

    // Calculate trust score for each service and add to response
    services = services.map(service => {
      const serviceObj = service.toObject();
      const provider = serviceObj.providerId;

      // Use provider rating if service rating is 0
      const effectiveRating = service.rating > 0 ? service.rating : (provider?.rating || 0);

      // Calculate trust score
      const trustScore = calculateTrustScore(
        effectiveRating,
        service.price,
        provider?.isVerified || false,
        avgMarketPrice
      );

      return {
        ...serviceObj,
        trustScore,
        locationMatch: location ? serviceObj.location.toLowerCase().includes(location.toLowerCase()) : true,
        budgetMatch: maxPrice ? serviceObj.price <= Number(maxPrice) : true
      };
    });

    // Sort by recommendation priority:
    // 1. Location match (if provided)
    // 2. Budget match (if provided)
    // 3. Trust score (descending)
    services.sort((a, b) => {
      // Location match first
      if (location) {
        if (a.locationMatch && !b.locationMatch) return -1;
        if (!a.locationMatch && b.locationMatch) return 1;
      }

      // Budget match second
      if (maxPrice) {
        if (a.budgetMatch && !b.budgetMatch) return -1;
        if (!a.budgetMatch && b.budgetMatch) return 1;
      }

      // Trust score last
      return b.trustScore - a.trustScore;
    });

    // Add estimated cost if peopleCount provided
    if (peopleCount) {
      services = services.map(service => ({
        ...service,
        estimatedCost: service.price * Number(peopleCount)
      }));
    }

    res.json({
      total: services.length,
      avgMarketPrice: Math.round(avgMarketPrice),
      recommendations: services
    });

  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Update Service Trust Score (Background job - can be called manually or via cron)
const updateServiceTrustScores = async (req, res) => {
  try {
    const services = await Service.find().populate('providerId', 'rating isVerified');

    // Calculate average price per category
    const categoryPrices = {};
    services.forEach(service => {
      if (!categoryPrices[service.category]) {
        categoryPrices[service.category] = [];
      }
      categoryPrices[service.category].push(service.price);
    });

    // Get average per category
    const categoryAvgPrices = {};
    Object.keys(categoryPrices).forEach(category => {
      const prices = categoryPrices[category];
      categoryAvgPrices[category] = prices.reduce((sum, p) => sum + p, 0) / prices.length;
    });

    // Update each service
    const updatePromises = services.map(async (service) => {
      const provider = service.providerId;
      const avgPrice = categoryAvgPrices[service.category] || 5000;
      const effectiveRating = service.rating > 0 ? service.rating : (provider?.rating || 0);

      const trustScore = calculateTrustScore(
        effectiveRating,
        service.price,
        provider?.isVerified || false,
        avgPrice
      );

      return Service.findByIdAndUpdate(service._id, { trustScore });
    });

    await Promise.all(updatePromises);

    res.json({ message: 'Trust scores updated successfully', updatedCount: services.length });

  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
>>>>>>> ed34da906bb3faf0ea102d18bd8c416990098710
  }
};

module.exports = {
<<<<<<< HEAD
  getServiceRecommendations,
  getVendorRecommendations
=======
  getRecommendedServices,
  updateServiceTrustScores
>>>>>>> ed34da906bb3faf0ea102d18bd8c416990098710
};