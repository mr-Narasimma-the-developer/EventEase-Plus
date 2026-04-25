const Booking = require('../models/Booking');
const Service = require('../models/Service');

const createBooking = async (req, res) => {
  try {
    const { serviceId, eventDate, numberOfPeople, specialRequests } = req.body;

    const service = await Service.findById(serviceId);
    if (!service) {
      return res.status(404).json({ message: 'Service not found' });
    }

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
      .sort('-createdAt');

    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching bookings', error: error.message });
  }
};

const getBookingById = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id)
      .populate('serviceId')
      .populate('userId', 'name email');

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

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
    }

    booking.status = status;
    await booking.save();

    res.json({ message: 'Booking status updated', booking });
  } catch (error) {
    res.status(500).json({ message: 'Error updating booking', error: error.message });
  }
};

const cancelBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    if (booking.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    await Booking.findByIdAndDelete(req.params.id);

    res.json({ message: 'Booking cancelled successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error cancelling booking', error: error.message });
  }
};

module.exports = {
  createBooking,
  getMyBookings,
  getBookingById,
  updateBookingStatus,
  cancelBooking
};