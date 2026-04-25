const Booking = require('../models/Booking');
const Service = require('../models/Service');

<<<<<<< HEAD
const createBooking = async (req, res) => {
  try {
    const { serviceId, eventDate, numberOfPeople, specialRequests } = req.body;

    const service = await Service.findById(serviceId);
=======
// Create Booking (Customer)
const createBooking = async (req, res) => {
  const { serviceId, eventDate, peopleCount, customerNotes } = req.body;

  try {
    const service = await Service.findById(serviceId);

>>>>>>> ed34da906bb3faf0ea102d18bd8c416990098710
    if (!service) {
      return res.status(404).json({ message: 'Service not found' });
    }

<<<<<<< HEAD
    const totalPrice = service.price * (numberOfPeople || 1);

    const booking = await Booking.create({
      userId: req.user._id,
      serviceId,
      eventDate,
      numberOfPeople: numberOfPeople || 1,
      totalPrice,
      specialRequests,
      status: 'pending'
    });

    const populatedBooking = await Booking.findById(booking._id)
      .populate('serviceId')
      .populate('userId', 'name email');

    res.status(201).json({
      message: 'Booking created successfully',
      booking: populatedBooking
    });

  } catch (error) {
    res.status(500).json({ message: 'Error creating booking', error: error.message });
  }
};

const getMyBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ userId: req.user._id })
      .populate('serviceId')
=======
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
>>>>>>> ed34da906bb3faf0ea102d18bd8c416990098710
      .sort('-createdAt');

    res.json(bookings);
  } catch (error) {
<<<<<<< HEAD
    res.status(500).json({ message: 'Error fetching bookings', error: error.message });
  }
};

const getBookingById = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id)
      .populate('serviceId')
      .populate('userId', 'name email');
=======
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
>>>>>>> ed34da906bb3faf0ea102d18bd8c416990098710

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

<<<<<<< HEAD
    res.json(booking);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching booking', error: error.message });
  }
};

const updateBookingStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
=======
    // Check if user is the provider
    if (booking.providerId.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized' });
>>>>>>> ed34da906bb3faf0ea102d18bd8c416990098710
    }

    booking.status = status;
    await booking.save();

<<<<<<< HEAD
    res.json({ message: 'Booking status updated', booking });
  } catch (error) {
    res.status(500).json({ message: 'Error updating booking', error: error.message });
  }
};

const cancelBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
=======
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
>>>>>>> ed34da906bb3faf0ea102d18bd8c416990098710

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

<<<<<<< HEAD
    if (booking.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    await Booking.findByIdAndDelete(req.params.id);

    res.json({ message: 'Booking cancelled successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error cancelling booking', error: error.message });
=======
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
>>>>>>> ed34da906bb3faf0ea102d18bd8c416990098710
  }
};

module.exports = {
  createBooking,
  getMyBookings,
<<<<<<< HEAD
  getBookingById,
  updateBookingStatus,
  cancelBooking
=======
  getProviderBookings,
  updateBookingStatus,
  getBookingById
>>>>>>> ed34da906bb3faf0ea102d18bd8c416990098710
};