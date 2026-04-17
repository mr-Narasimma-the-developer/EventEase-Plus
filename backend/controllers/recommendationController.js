const Service = require('../models/Service');
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
  }
};

module.exports = {
  getRecommendedServices,
  updateServiceTrustScores
};