const express = require('express');
<<<<<<< HEAD
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const {
  createBooking,
  getMyBookings,
  getBookingById,
  updateBookingStatus,
  cancelBooking
} = require('../controllers/bookingController');

router.post('/', protect, createBooking);
router.get('/my-bookings', protect, getMyBookings);
router.get('/:id', protect, getBookingById);
router.put('/:id/status', protect, updateBookingStatus);
router.delete('/:id', protect, cancelBooking);

module.exports = router;
=======
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
>>>>>>> ed34da906bb3faf0ea102d18bd8c416990098710
