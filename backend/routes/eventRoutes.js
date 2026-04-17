const express = require('express');
const {
  createEvent,
  getPublicEvents,
  getNearbyEvents,
  showInterest,
  confirmAttendance,
  getMyEvents,
  getEventAttendees,
  getEventById,
  generateEventQR,   
  scanQRAttendance,
  updateEvent,            
  deleteEventByOrganizer
} = require('../controllers/eventController');
const { protect } = require('../middleware/authMiddleware');
const { upload } = require('../config/cloudinary');

const router = express.Router();

router.get('/public', getPublicEvents);
router.get('/nearby', protect, getNearbyEvents);
router.get('/my-events', protect, getMyEvents);
router.get('/:id', getEventById);
router.get('/:eventId/attendees', protect, getEventAttendees);

router.post('/', protect, upload.single('poster'), createEvent);
router.post('/:eventId/interest', protect, showInterest);
router.post('/:eventId/confirm', protect, confirmAttendance);
router.get('/:eventId/qr-code', protect, generateEventQR);
router.post('/:eventId/scan-attendance', protect, scanQRAttendance);

router.put('/:id', protect, upload.single('poster'), updateEvent);
router.delete('/:id', protect, deleteEventByOrganizer);

module.exports = router;