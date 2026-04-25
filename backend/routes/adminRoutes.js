const express = require('express');
const router = express.Router();
const { protect, admin } = require('../middleware/authMiddleware');
const {
  verifyVendorWithBadge,
  getAllEvents,
  deleteEvent,
  getSystemAnalytics,
  getFraudAlerts,
  getAllUsers,
  updateUserRole,
  deleteUser,
  getPendingVerifications,
  approveVendorVerification,
  rejectVendorVerification
} = require('../controllers/adminController');

// All routes require admin authentication
router.post('/verify-vendor/:vendorId', protect, admin, verifyVendorWithBadge);
router.get('/events', protect, admin, getAllEvents);
router.delete('/events/:eventId', protect, admin, deleteEvent);
router.get('/analytics', protect, admin, getSystemAnalytics);
router.get('/fraud-alerts', protect, admin, getFraudAlerts);
router.get('/users', protect, admin, getAllUsers);
router.put('/users/:userId/role', protect, admin, updateUserRole);
router.delete('/users/:userId', protect, admin, deleteUser);
router.get('/verifications/pending', protect, admin, getPendingVerifications);
router.post('/verifications/:vendorId/approve', protect, admin, approveVendorVerification);
router.post('/verifications/:vendorId/reject', protect, admin, rejectVendorVerification);

module.exports = router;