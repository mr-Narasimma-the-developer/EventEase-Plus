const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const Service = require('../models/Service');
const VendorProfile = require('../models/VendorProfile');

// Get vendor recommendations based on criteria
router.post('/vendors/search', protect, async (req, res) => {
  try {
    const { serviceType, budget, location, eventDate } = req.body;

    console.log('Vendor search:', { serviceType, budget, location });

    // Build query
    let query = {};
    
    if (serviceType && serviceType !== 'all') {
      query.category = serviceType;
    }
    
    if (location) {
      query.location = new RegExp(location, 'i');
    }
    
    if (budget) {
      query.price = { $lte: Number(budget) };
    }

    // Find matching services
    const services = await Service.find(query)
      .populate('providerId', 'name email phone location')
      .limit(20);

    // Get vendor profiles for trust scores
    const vendorIds = services.map(s => s.providerId._id);
    const vendorProfiles = await VendorProfile.find({ 
      userId: { $in: vendorIds } 
    });

    // Create vendor map
    const vendorMap = {};
    vendorProfiles.forEach(profile => {
      vendorMap[profile.userId.toString()] = profile;
    });

    // Calculate match scores
    const recommendations = services.map(service => {
      const vendorProfile = vendorMap[service.providerId._id.toString()];
      const trustScore = vendorProfile?.trustScore || 0;
      const completedEvents = vendorProfile?.completedEvents || 0;
      
      // Match Score Calculation
      let matchScore = 0;
      
      // Trust Score component (40%)
      matchScore += (trustScore / 100) * 40;
      
      // Budget Match component (30%)
      if (budget) {
        const priceDiff = Math.abs(service.price - budget) / budget;
        matchScore += Math.max(0, (1 - priceDiff) * 30);
      } else {
        matchScore += 30;
      }
      
      // Location Match component (20%)
      if (location && service.location.toLowerCase().includes(location.toLowerCase())) {
        matchScore += 20;
      }
      
      // Experience component (10%)
      matchScore += Math.min((completedEvents / 50) * 10, 10);

      return {
        service,
        vendorProfile,
        matchScore: Math.round(matchScore)
      };
    });

    // Filter and sort
    const filtered = recommendations
      .filter(r => r.matchScore > 50)
      .sort((a, b) => b.matchScore - a.matchScore);

    console.log(`Found ${filtered.length} recommendations`);

    return res.json(filtered);

  } catch (error) {
    console.error('Recommendation error:', error);
    return res.status(500).json({ 
      message: 'Error getting recommendations', 
      error: error.message 
    });
  }
});

module.exports = router;