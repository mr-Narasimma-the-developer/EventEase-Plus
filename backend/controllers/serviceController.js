const Service = require('../models/Service');
const User = require('../models/User');

// Create Service (Provider Only)
const createService = async (req, res) => {
<<<<<<< HEAD
  try {
    console.log('Service creation request:', req.body);
    console.log('User:', req.user);

    const { serviceName, description, category, price, location } = req.body;

    // Validate required fields
    if (!serviceName || !description || !category || !price || !location) {
      console.log('Missing fields:', { serviceName, description, category, price, location });
      return res.status(400).json({ 
        message: 'All fields are required',
        missing: {
          serviceName: !serviceName,
          description: !description,
          category: !category,
          price: !price,
          location: !location
        }
      });
    }

    // Validate price
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
      rating: 0  // Default rating
    });

    console.log('Service created:', service._id);

    // Populate provider info
    const populatedService = await Service.findById(service._id)
      .populate('providerId', 'name email location');

    console.log('Service populated:', populatedService);

    res.status(201).json({
      message: 'Service created successfully',
      service: populatedService
    });

  } catch (error) {
    console.error('Service creation error:', error);
    res.status(500).json({ 
      message: 'Error creating service', 
      error: error.message,
      details: error.stack
    });
  }
};
// Get All Services (with filters)
const getServices = async (req, res) => {
  try {
    const { category, location, providerId, minPrice, maxPrice } = req.query;

    const query = {};
    if (category) query.category = category;
    if (location) query.location = new RegExp(location, 'i');
    if (providerId) query.providerId = providerId;
    if (minPrice) query.price = { ...query.price, $gte: Number(minPrice) };
    if (maxPrice) query.price = { ...query.price, $lte: Number(maxPrice) };

    const services = await Service.find(query)
      .populate('providerId', 'name email location')
      .sort('-createdAt');

    res.json(services);

  } catch (error) {
    res.status(500).json({ message: 'Error fetching services', error: error.message });
=======
  const { serviceName, category, description, price, location } = req.body;

  try {
    // Check if user is a provider
    if (req.user.role !== 'provider' && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Only providers can create services' });
    }

    const service = await Service.create({
      providerId: req.user._id,
      serviceName,
      category,
      description,
      price,
      location
    });

    res.status(201).json(service);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get All Services (with filters)
const getServices = async (req, res) => {
  const { category, location, minPrice, maxPrice } = req.query;

  try {
    let filter = { availability: true };

    if (category) filter.category = category;
    if (location) filter.location = { $regex: location, $options: 'i' };
    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = Number(minPrice);
      if (maxPrice) filter.price.$lte = Number(maxPrice);
    }

    const services = await Service.find(filter).populate('providerId', 'name email phone rating isVerified');
    res.json(services);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
>>>>>>> ed34da906bb3faf0ea102d18bd8c416990098710
  }
};

// Get Single Service
const getServiceById = async (req, res) => {
  try {
    const service = await Service.findById(req.params.id).populate('providerId', 'name email phone rating isVerified location');

    if (!service) {
      return res.status(404).json({ message: 'Service not found' });
    }

    res.json(service);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Update Service
const updateService = async (req, res) => {
  try {
    const { id } = req.params;
    const { serviceName, description, category, price, location } = req.body;

    const service = await Service.findById(id);

    if (!service) {
      return res.status(404).json({ message: 'Service not found' });
    }

    // Check if user owns this service
    if (service.providerId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to update this service' });
    }

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
};

// Delete Service
const deleteService = async (req, res) => {
  try {
    const { id } = req.params;

    const service = await Service.findById(id);

    if (!service) {
      return res.status(404).json({ message: 'Service not found' });
    }

    // Check if user owns this service
    if (service.providerId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to delete this service' });
    }

    await Service.findByIdAndDelete(id);

    res.json({ message: 'Service deleted successfully' });

  } catch (error) {
    res.status(500).json({ message: 'Error deleting service', error: error.message });
  }
};


// Get My Services (Provider)
const getMyServices = async (req, res) => {
  try {
    const services = await Service.find({ providerId: req.user._id });
    res.json(services);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
// (Duplicate handlers removed; existing updateService/deleteService definitions above are used)



module.exports = {
  createService,
  getServices,
  getServiceById,
  updateService,
  deleteService,
  getMyServices,
  
};