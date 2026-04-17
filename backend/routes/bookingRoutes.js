const express = require('express');
const {
  createBooking,
  getMyBookings,
  getProviderBookings,
  updateBookingStatus,
  getBookingById
} = require('../controllers/bookingController');
const { protect, providerOnly } = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/', protect, createBooking);
router.get('/my-bookings', protect, getMyBookings);
router.get('/provider-bookings', protect, providerOnly, getProviderBookings);
router.get('/:id', protect, getBookingById);
router.put('/:id/status', protect, providerOnly, updateBookingStatus);

module.exports = router;
