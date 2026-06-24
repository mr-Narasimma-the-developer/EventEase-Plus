const express = require('express');
const router = express.Router();
const { protect, vendor } = require('../middleware/authMiddleware');
const Service = require('../models/Service');

// GET all services (public) - MUST be first
router.get('/', async (req, res) => {
  try {
    const { category, location } = req.query;
    
    let query = {};
    
    if (category && category !== 'All Categories') {
      query.category = category;
    }
    
    if (location) {
      query.location = new RegExp(location, 'i');
    }
    
    const services = await Service.find(query)
      .populate('providerId', 'name email')
      .sort('-createdAt');
    
    return res.json(services);
    
  } catch (error) {
    console.error('Get services error:', error);
    return res.status(500).json({ message: 'Error fetching services', error: error.message });
  }
});

// GET my services (vendor) - MUST be before /:id
router.get('/my-services', protect, vendor, async (req, res) => {
  try {
    console.log('Fetching services for vendor:', req.user._id);
    
    const services = await Service.find({ providerId: req.user._id })
      .populate('providerId', 'name email')
      .sort('-createdAt');
    
    console.log(`Found ${services.length} services`);
    
    return res.json(services);
    
  } catch (error) {
    console.error('Get my services error:', error);
    return res.status(500).json({ message: 'Error fetching services', error: error.message });
  }
});

// GET service by ID
router.get('/:id', async (req, res) => {
  try {
    const service = await Service.findById(req.params.id)
      .populate('providerId', 'name email phone location');
    
    if (!service) {
      return res.status(404).json({ message: 'Service not found' });
    }
    
    return res.json(service);
    
  } catch (error) {
    console.error('Get service error:', error);
    return res.status(500).json({ message: 'Error fetching service', error: error.message });
  }
});

// CREATE service (vendor only)
router.post('/', protect, vendor, async (req, res) => {
  try {
    const { serviceName, description, category, price, location } = req.body;
    
    console.log('Creating service:', { serviceName, category, price, location, providerId: req.user._id });
    
    // Validation
    if (!serviceName || !description || !category || !price || !location) {
      return res.status(400).json({ message: 'All fields are required' });
    }
    
    // Convert price to number
    const numericPrice = Number(price);
    if (isNaN(numericPrice) || numericPrice <= 0) {
      return res.status(400).json({ message: 'Invalid price' });
    }
    
    const service = await Service.create({
      serviceName,
      description,
      category,
      price: numericPrice,
      location,
      providerId: req.user._id
    });
    
    const populatedService = await Service.findById(service._id)
      .populate('providerId', 'name email');
    
    console.log('Service created successfully:', service._id);
    
    return res.status(201).json({
      message: 'Service created successfully',
      service: populatedService
    });
    
  } catch (error) {
    console.error('Create service error:', error);
    return res.status(500).json({ message: 'Error creating service', error: error.message });
  }
});

// UPDATE service
router.put('/:id', protect, vendor, async (req, res) => {
  try {
    const service = await Service.findById(req.params.id);
    
    if (!service) {
      return res.status(404).json({ message: 'Service not found' });
    }
    
    if (service.providerId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }
    
    const { serviceName, description, category, price, location } = req.body;
    
    service.serviceName = serviceName || service.serviceName;
    service.description = description || service.description;
    service.category = category || service.category;
    service.price = price ? Number(price) : service.price;
    service.location = location || service.location;
    
    await service.save();
    
    const updatedService = await Service.findById(service._id)
      .populate('providerId', 'name email');
    
    return res.json({
      message: 'Service updated successfully',
      service: updatedService
    });
    
  } catch (error) {
    console.error('Update service error:', error);
    return res.status(500).json({ message: 'Error updating service', error: error.message });
  }
});

// DELETE service
router.delete('/:id', protect, vendor, async (req, res) => {
  try {
    const service = await Service.findById(req.params.id);
    
    if (!service) {
      return res.status(404).json({ message: 'Service not found' });
    }
    
    if (service.providerId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }
    
    await Service.findByIdAndDelete(req.params.id);
    
    return res.json({ message: 'Service deleted successfully' });
    
  } catch (error) {
    console.error('Delete service error:', error);
    return res.status(500).json({ message: 'Error deleting service', error: error.message });
  }
});

const User = require('../models/User');

// POST a review
router.post('/:id/review', protect, async (req, res) => {
  try {
    const { rating, comment } = req.body;

    if (!rating || rating < 1 || rating > 5) {
      return res.status(400).json({ message: 'Rating must be between 1 and 5' });
    }

    const service = await Service.findById(req.params.id);
    if (!service) {
      return res.status(404).json({ message: 'Service not found' });
    }

    // Check if user already reviewed
    const alreadyReviewed = service.reviews.find(
      r => r.userId.toString() === req.user._id.toString()
    );
    if (alreadyReviewed) {
      return res.status(400).json({ message: 'You have already reviewed this service' });
    }

    const user = await User.findById(req.user._id);

    service.reviews.push({
      userId: req.user._id,
      userName: user.name,
      rating: Number(rating),
      comment: comment || ''
    });

    // Recalculate average rating
    const total = service.reviews.reduce((sum, r) => sum + r.rating, 0);
    service.rating = Math.round((total / service.reviews.length) * 10) / 10;

    await service.save();

    return res.json({
      message: 'Review submitted successfully',
      rating: service.rating,
      reviews: service.reviews
    });

  } catch (error) {
    console.error('Review error:', error);
    return res.status(500).json({ message: 'Error submitting review', error: error.message });
  }
});

module.exports = router;