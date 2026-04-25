const express = require('express');
const router = express.Router();
const { protect, organizer } = require('../middleware/authMiddleware');
const multer = require('multer');

const {
  createEvent,
  getPublicEvents,
  getEventById,
  updateEvent,
  deleteEventByOrganizer,   // ✅ FIXED
  showInterest,
  confirmAttendance,
  getEventAttendees,        // ✅ FIXED
  generateEventQR,
  scanQRAttendance
} = require('../controllers/eventController');

const storage = multer.diskStorage({});
const upload = multer({ storage });

// Public routes
router.get('/public', getPublicEvents);
router.get('/:id', getEventById);
router.get('/:id/attendees', getEventAttendees);   // ✅ FIXED

// Protected routes
router.post('/', protect, upload.single('poster'), createEvent);
router.put('/:id', protect, upload.single('poster'), updateEvent);
router.delete('/:id', protect, deleteEventByOrganizer); // ✅ FIXED
router.post('/:id/interest', protect, showInterest);
router.post('/:id/confirm-attendance', protect, confirmAttendance);
router.get('/:id/qr-code', protect, generateEventQR);
router.post('/:id/scan-attendance', protect, scanQRAttendance);

module.exports = router;