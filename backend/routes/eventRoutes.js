const express = require('express');
<<<<<<< HEAD
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
=======
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
>>>>>>> ed34da906bb3faf0ea102d18bd8c416990098710

module.exports = router;