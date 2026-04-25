const express = require('express');
<<<<<<< HEAD
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const Service = require('../models/Service');

// Get all services (public)
router.get('/', async (req, res) => {
  try {
    const { category, location, providerId } = req.query;

    const query = {};
    if (category) query.category = category;
    if (location) query.location = new RegExp(location, 'i');
    if (providerId) query.providerId = providerId;

    const services = await Service.find(query)
      .populate('providerId', 'name email location')
      .sort('-createdAt');

    res.json(services);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching services', error: error.message });
  }
});

// Get my services (vendor only)
router.get('/my-services', protect, async (req, res) => {
  try {
    const services = await Service.find({ providerId: req.user._id })
      .populate('providerId', 'name email location')
      .sort('-createdAt');
    
    console.log(`Found ${services.length} services for user ${req.user._id}`);
    res.json(services);
  } catch (error) {
    console.error('Error fetching my services:', error);
    res.status(500).json({ message: 'Error fetching services', error: error.message });
  }
});

// Get service by ID (public)
router.get('/:id', async (req, res) => {
  try {
    const service = await Service.findById(req.params.id)
      .populate('providerId', 'name email location');
    
    if (!service) {
      return res.status(404).json({ message: 'Service not found' });
    }

    res.json(service);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching service', error: error.message });
  }
});

// Create service (vendor only)
router.post('/', protect, async (req, res) => {
  try {
    console.log('=== SERVICE CREATION REQUEST ===');
    console.log('User:', req.user);
    console.log('Body:', req.body);

    const { serviceName, description, category, price, location } = req.body;

    // Validate
    if (!serviceName || !description || !category || !price || !location) {
      console.log('Validation failed - missing fields');
      return res.status(400).json({ 
        message: 'All fields are required',
        received: { serviceName, description, category, price, location }
      });
    }

    const priceNumber = Number(price);
    if (isNaN(priceNumber) || priceNumber <= 0) {
      return res.status(400).json({ message: 'Price must be a positive number' });
    }

    // Create service
    const service = await Service.create({
      serviceName: serviceName.trim(),
      description: description.trim(),
      category,
      price: priceNumber,
      location: location.trim(),
      providerId: req.user._id,
      rating: 0
    });

    console.log('Service created with ID:', service._id);

    // Populate and return
    const populatedService = await Service.findById(service._id)
      .populate('providerId', 'name email location');

    console.log('Service creation SUCCESS');
    
    res.status(201).json({
      message: 'Service created successfully',
      service: populatedService
    });

  } catch (error) {
    console.error('=== SERVICE CREATION ERROR ===');
    console.error('Error:', error);
    res.status(500).json({ 
      message: 'Error creating service', 
      error: error.message
    });
  }
});

// Update service (vendor only)
router.put('/:id', protect, async (req, res) => {
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
    service.price = price || service.price;
    service.location = location || service.location;

    await service.save();

    res.json({
      message: 'Service updated successfully',
      service
    });
  } catch (error) {
    res.status(500).json({ message: 'Error updating service', error: error.message });
  }
});

// Delete service (vendor only)
router.delete('/:id', protect, async (req, res) => {
  try {
    const service = await Service.findById(req.params.id);

    if (!service) {
      return res.status(404).json({ message: 'Service not found' });
    }

    if (service.providerId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    await Service.findByIdAndDelete(req.params.id);

    res.json({ message: 'Service deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting service', error: error.message });
  }
});
=======
const {
  createService,
  getServices,
  getServiceById,
  updateService,
  deleteService,
  getMyServices
} = require('../controllers/serviceController');
const { protect, providerOnly } = require('../middleware/authMiddleware');

const router = express.Router();

router.route('/')
  .get(getServices)
  .post(protect, providerOnly, createService);

router.get('/my-services', protect, providerOnly, getMyServices);
router.put('/:id', protect, updateService);
router.delete('/:id', protect, deleteService);

router.route('/:id')
  .get(getServiceById)
  .put(protect, providerOnly, updateService)
  .delete(protect, providerOnly, deleteService);
>>>>>>> ed34da906bb3faf0ea102d18bd8c416990098710

module.exports = router;