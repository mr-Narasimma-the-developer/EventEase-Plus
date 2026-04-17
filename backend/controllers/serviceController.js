const Service = require('../models/Service');
const User = require('../models/User');

// Create Service (Provider Only)
const createService = async (req, res) => {
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