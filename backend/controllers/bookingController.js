const Booking = require('../models/Booking');
const Service = require('../models/Service');

// Create Booking (Customer)
const createBooking = async (req, res) => {
  const { serviceId, eventDate, peopleCount, customerNotes } = req.body;

  try {
    const service = await Service.findById(serviceId);

    if (!service) {
      return res.status(404).json({ message: 'Service not found' });
    }

    if (!service.availability) {
      return res.status(400).json({ message: 'Service not available' });
    }

    // Calculate estimated cost
    const estimatedCost = peopleCount * service.price;

    const booking = await Booking.create({
      customerId: req.user._id,
      serviceId,
      providerId: service.providerId,
      eventDate,
      peopleCount,
      estimatedCost,
      customerNotes
    });

    const populatedBooking = await Booking.findById(booking._id)
      .populate('serviceId', 'serviceName category price')
      .populate('providerId', 'name email phone')
      .populate('customerId', 'name email phone');

    res.status(201).json(populatedBooking);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get My Bookings (Customer)
const getMyBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ customerId: req.user._id })
      .populate('serviceId', 'serviceName category price')
      .populate('providerId', 'name email phone')
      .sort('-createdAt');

    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get Bookings for My Services (Provider)
const getProviderBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ providerId: req.user._id })
      .populate('serviceId', 'serviceName category price')
      .populate('customerId', 'name email phone location')
      .sort('-createdAt');

    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Update Booking Status (Provider)
const updateBookingStatus = async (req, res) => {
  const { status } = req.body;

  try {
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    // Check if user is the provider
    if (booking.providerId.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized' });
    }

    booking.status = status;
    await booking.save();

    // Update service totalBookings if accepted
    if (status === 'accepted') {
      await Service.findByIdAndUpdate(booking.serviceId, {
        $inc: { totalBookings: 1 }
      });
    }

    const updatedBooking = await Booking.findById(booking._id)
      .populate('serviceId', 'serviceName category price')
      .populate('customerId', 'name email phone')
      .populate('providerId', 'name email phone');

    res.json(updatedBooking);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get Single Booking
const getBookingById = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id)
      .populate('serviceId', 'serviceName category price description')
      .populate('customerId', 'name email phone location')
      .populate('providerId', 'name email phone location');

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    // Check authorization
    const isCustomer = booking.customerId._id.toString() === req.user._id.toString();
    const isProvider = booking.providerId._id.toString() === req.user._id.toString();
    const isAdmin = req.user.role === 'admin';

    if (!isCustomer && !isProvider && !isAdmin) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    res.json(booking);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = {
  createBooking,
  getMyBookings,
  getProviderBookings,
  updateBookingStatus,
  getBookingById
};