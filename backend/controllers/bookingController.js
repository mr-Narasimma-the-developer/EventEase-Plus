const Booking = require('../models/Booking');
const Service = require('../models/Service');
const Notification = require('../models/Notification');

const PLATFORM_COMMISSION_RATE = 0.10; // 10% commission

// CREATE BOOKING
const createBooking = async (req, res) => {
  try {
    const {
      serviceId,
      vendorId,
      bookingDate,
      numberOfPeople,
      notes,
      totalPrice
    } = req.body;

    if (!serviceId || !vendorId || !bookingDate || !totalPrice) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    const service = await Service.findById(serviceId);
    if (!service) {
      return res.status(404).json({ message: 'Service not found' });
    }

    const booking = await Booking.create({
      serviceId,
      clientId: req.user._id,
      vendorId,
      bookingDate: new Date(bookingDate),
      numberOfPeople: numberOfPeople || null,
      notes: notes || '',
      totalPrice: Number(totalPrice),
      status: 'pending'
    });

    const populatedBooking = await Booking.findById(booking._id)
      .populate('serviceId', 'serviceName price category')
      .populate('clientId', 'name email phone')
      .populate('vendorId', 'name email phone');

    // ─── NOTIFY VENDOR ────────────────────────────────────────────
    try {
      await Notification.create({
        userId: vendorId,
        type: 'booking',
        title: '📋 New Booking Request!',
        message: `${req.user.name} has requested to book "${service.serviceName}" for ${new Date(bookingDate).toLocaleDateString('en-IN')}. Total: ₹${Number(totalPrice).toLocaleString()}. Please accept or reject from your Bookings page.`,
        relatedId: booking._id,
        relatedType: 'booking'
      });
      console.log('✅ Vendor notification created for booking:', booking._id);
    } catch (notifError) {
      console.error('⚠️ Notification failed (non-critical):', notifError.message);
    }

    // ─── NOTIFY ORGANIZER (CONFIRMATION) ─────────────────────────
    try {
      await Notification.create({
        userId: req.user._id,
        type: 'booking',
        title: '✅ Booking Request Sent!',
        message: `Your booking request for "${service.serviceName}" has been sent to the vendor. You will be notified once they respond.`,
        relatedId: booking._id,
        relatedType: 'booking'
      });
    } catch (notifError) {
      console.error('⚠️ Organizer notification failed:', notifError.message);
    }

    return res.status(201).json({
      message: 'Booking request sent successfully',
      booking: populatedBooking
    });

  } catch (error) {
    console.error('Booking creation error:', error);
    return res.status(500).json({
      message: 'Error creating booking',
      error: error.message
    });
  }
};

// GET MY BOOKINGS (organizer/client view)
const getMyBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ clientId: req.user._id })
      .populate('serviceId', 'serviceName price category location')
      .populate('vendorId', 'name email phone')
      .sort('-createdAt');

    return res.json(bookings);
  } catch (error) {
    return res.status(500).json({
      message: 'Error fetching bookings',
      error: error.message
    });
  }
};

// GET VENDOR BOOKINGS (vendor view — NEW)
const getVendorBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ vendorId: req.user._id })
      .populate('serviceId', 'serviceName price category')
      .populate('clientId', 'name email phone')
      .sort('-createdAt');

    return res.json(bookings);
  } catch (error) {
    return res.status(500).json({
      message: 'Error fetching vendor bookings',
      error: error.message
    });
  }
};

// GET BOOKING BY ID
const getBookingById = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id)
      .populate('serviceId', 'serviceName price category')
      .populate('clientId', 'name email phone')
      .populate('vendorId', 'name email phone');

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    return res.json(booking);
  } catch (error) {
    return res.status(500).json({
      message: 'Error fetching booking',
      error: error.message
    });
  }
};

// UPDATE BOOKING STATUS (vendor accepts/rejects)
const updateBookingStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const validStatuses = ['pending', 'confirmed', 'completed', 'cancelled'];

    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }

    const booking = await Booking.findById(req.params.id)
      .populate('serviceId', 'serviceName');

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    // Only vendor or client can update
    const isVendor = booking.vendorId.toString() === req.user._id.toString();
    const isClient = booking.clientId.toString() === req.user._id.toString();

    if (!isVendor && !isClient && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized' });
    }

    const oldStatus = booking.status;
    booking.status = status;
    await booking.save();

    // ─── NOTIFY THE OTHER PARTY ───────────────────────────────────
    try {
      const serviceName = booking.serviceId?.serviceName || 'Service';

      if (isVendor) {
        // Vendor updated status → notify organizer/client
        const statusMessages = {
          confirmed: `🎉 Your booking for "${serviceName}" has been ACCEPTED by the vendor! Date: ${new Date(booking.bookingDate).toLocaleDateString('en-IN')}.`,
          cancelled: `❌ Your booking for "${serviceName}" has been REJECTED by the vendor. Please try another vendor.`,
          completed: `✅ Your booking for "${serviceName}" has been marked as COMPLETED.`
        };

        if (statusMessages[status]) {
          await Notification.create({
            userId: booking.clientId,
            type: 'booking',
            title: status === 'confirmed' ? '🎉 Booking Accepted!' :
                   status === 'cancelled' ? '❌ Booking Rejected' : '✅ Booking Completed',
            message: statusMessages[status],
            relatedId: booking._id,
            relatedType: 'booking'
          });
        }
      } else if (isClient && status === 'cancelled') {
        // Client cancelled → notify vendor
        await Notification.create({
          userId: booking.vendorId,
          type: 'booking',
          title: '🚫 Booking Cancelled',
          message: `The organizer has cancelled the booking for "${serviceName}" on ${new Date(booking.bookingDate).toLocaleDateString('en-IN')}.`,
          relatedId: booking._id,
          relatedType: 'booking'
        });
      }
    } catch (notifError) {
      console.error('⚠️ Status notification failed:', notifError.message);
    }

    return res.json({
      message: `Booking ${status} successfully`,
      booking
    });

  } catch (error) {
    return res.status(500).json({
      message: 'Error updating booking',
      error: error.message
    });
  }
};

// CANCEL BOOKING
const cancelBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id)
      .populate('serviceId', 'serviceName');

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    const isOwner = booking.clientId.toString() === req.user._id.toString();
    if (!isOwner && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized' });
    }

    booking.status = 'cancelled';
    await booking.save();

    // Notify vendor
    try {
      await Notification.create({
        userId: booking.vendorId,
        type: 'booking',
        title: '🚫 Booking Cancelled',
        message: `A booking for "${booking.serviceId?.serviceName}" has been cancelled by the organizer.`,
        relatedId: booking._id,
        relatedType: 'booking'
      });
    } catch (notifError) {
      console.error('⚠️ Cancel notification failed:', notifError.message);
    }

    return res.json({ message: 'Booking cancelled successfully' });

  } catch (error) {
    return res.status(500).json({
      message: 'Error cancelling booking',
      error: error.message
    });
  }
};

// GET PLATFORM REVENUE STATS (for admin analytics)
const getRevenueStats = async (req, res) => {
  try {
    const completedBookings = await Booking.find({ status: 'completed' });
    const totalRevenue = completedBookings.reduce(
      (sum, b) => sum + (b.totalPrice || 0), 0
    );
    const platformCommission = Math.round(totalRevenue * PLATFORM_COMMISSION_RATE);

    return res.json({
      totalBookingValue: totalRevenue,
      platformCommission,
      commissionRate: `${PLATFORM_COMMISSION_RATE * 100}%`,
      completedBookings: completedBookings.length
    });
  } catch (error) {
    return res.status(500).json({ message: 'Error fetching revenue', error: error.message });
  }
};

module.exports = {
  createBooking,
  getMyBookings,
  getVendorBookings,
  getBookingById,
  updateBookingStatus,
  cancelBooking,
  getRevenueStats,
  PLATFORM_COMMISSION_RATE
};