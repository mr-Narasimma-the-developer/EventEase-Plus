const express = require('express');
<<<<<<< HEAD
const router = express.Router();
const { protect, admin } = require('../middleware/authMiddleware');
const {
=======
const {
  getAllUsers,
  verifyProvider,
  getDashboardStats,
  deleteUser,
>>>>>>> ed34da906bb3faf0ea102d18bd8c416990098710
  verifyVendorWithBadge,
  getAllEvents,
  deleteEvent,
  getSystemAnalytics,
  getFraudAlerts,
<<<<<<< HEAD
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
=======
} = require('../controllers/adminController');
const admin = require("../controllers/adminController");
const { protect, adminOnly } = require('../middleware/authMiddleware');

const router = express.Router();

router.use(protect);
router.use(adminOnly);

router.get('/users', getAllUsers);
router.get('/stats', getDashboardStats);
router.get('/analytics', getSystemAnalytics);
router.get('/events', getAllEvents);

router.put('/verify-provider/:id', verifyProvider);
router.put('/verify-vendor/:userId', verifyVendorWithBadge);

router.delete('/users/:id', deleteUser);
router.delete('/events/:eventId', deleteEvent);
router.get('/fraud-alerts', protect, admin.getFraudAlerts);
>>>>>>> ed34da906bb3faf0ea102d18bd8c416990098710

module.exports = router;