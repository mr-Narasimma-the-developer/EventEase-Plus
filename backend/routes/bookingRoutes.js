// const express = require('express');
// const router = express.Router();
// const { protect, organizer , vendor} = require('../middleware/authMiddleware');
// const Booking = require('../models/Booking');

// // CREATE booking
// router.post('/', protect, organizer, async (req, res) => {
//   try {
//     const { serviceId, vendorId, bookingDate, numberOfPeople, notes, totalPrice } = req.body;

//     console.log('Creating booking:', {
//       serviceId,
//       vendorId,
//       clientId: req.user._id,
//       bookingDate,
//       totalPrice
//     });

//     // Validation
//     if (!serviceId || !vendorId || !bookingDate || !totalPrice) {
//       return res.status(400).json({ message: 'Missing required fields' });
//     }

//     const booking = await Booking.create({
//       serviceId,
//       clientId: req.user._id,
//       vendorId,
//       bookingDate: new Date(bookingDate),
//       numberOfPeople: numberOfPeople || null,
//       notes: notes || '',
//       totalPrice,
//       status: 'pending'
//     });

//     const populatedBooking = await Booking.findById(booking._id)
//       .populate('serviceId', 'serviceName')
//       .populate('clientId', 'name email phone')
//       .populate('vendorId', 'name email phone');

//     console.log('Booking created successfully:', booking._id);

//     return res.status(201).json({
//       message: 'Booking created successfully',
//       booking: populatedBooking
//     });

//   } catch (error) {
//     console.error('Booking creation error:', error);
//     return res.status(500).json({ 
//       message: 'Error creating booking', 
//       error: error.message 
//     });
//   }
// });

// // GET my bookings (as client)
// router.get('/my-bookings', protect, async (req, res) => {
//   try {
//     const bookings = await Booking.find({ clientId: req.user._id })
//       .populate('serviceId', 'serviceName')
//       .populate('vendorId', 'name email phone')
//       .sort('-createdAt');

//     return res.json(bookings);

//   } catch (error) {
//     console.error('Get my bookings error:', error);
//     return res.status(500).json({ message: 'Error fetching bookings', error: error.message });
//   }
// });

// // GET bookings for vendor
// router.get('/vendor-bookings', protect, async (req, res) => {
//   try {
//     const bookings = await Booking.find({ vendorId: req.user._id })
//       .populate('serviceId', 'serviceName')
//       .populate('clientId', 'name email phone')
//       .sort('-createdAt');

//     return res.json(bookings);

//   } catch (error) {
//     console.error('Get vendor bookings error:', error);
//     return res.status(500).json({ message: 'Error fetching bookings', error: error.message });
//   }
// });

// // UPDATE booking status
// router.put('/:id/status', protect, async (req, res) => {
//   try {
//     const { status } = req.body;

//     const booking = await Booking.findById(req.params.id);

//     if (!booking) {
//       return res.status(404).json({ message: 'Booking not found' });
//     }

//     // Only vendor can update
//     if (booking.vendorId.toString() !== req.user._id.toString()) {
//       return res.status(403).json({ message: 'Not authorized' });
//     }

//     booking.status = status;
//     await booking.save();

//     return res.json({
//       message: 'Booking status updated',
//       booking
//     });

//   } catch (error) {
//     console.error('Update booking error:', error);
//     return res.status(500).json({ message: 'Error updating booking', error: error.message });
//   }
// });

// module.exports = router;


const express = require('express');
const router = express.Router();
const { protect, organizer, vendor } = require('../middleware/authMiddleware');
const {
  createBooking,
  getMyBookings,
  getVendorBookings,
  getBookingById,
  updateBookingStatus,
  cancelBooking
} = require('../controllers/bookingController');

// Organizer routes
router.post('/', protect, organizer, createBooking);
router.get('/my-bookings', protect, getMyBookings);

// Vendor routes — NEW
router.get('/vendor-bookings', protect, getVendorBookings);

// Shared routes
router.get('/:id', protect, getBookingById);
router.put('/:id/status', protect, updateBookingStatus);
router.delete('/:id', protect, cancelBooking);

module.exports = router;