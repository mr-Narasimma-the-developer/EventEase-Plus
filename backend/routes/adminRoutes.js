const express = require('express');
const {
  getAllUsers,
  verifyProvider,
  getDashboardStats,
  deleteUser,
  verifyVendorWithBadge,
  getAllEvents,
  deleteEvent,
  getSystemAnalytics,
  getFraudAlerts,
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

module.exports = router;