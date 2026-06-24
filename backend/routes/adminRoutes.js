const express = require('express');
const router = express.Router();
const { protect, admin } = require('../middleware/authMiddleware');
const Event = require('../models/Event');
const Service = require('../models/Service');
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

// ─── USERS ────────────────────────────────────────────────────────
router.get('/users', protect, admin, getAllUsers);
router.put('/users/:userId/role', protect, admin, updateUserRole);
router.delete('/users/:userId', protect, admin, deleteUser);

// ─── EVENTS ───────────────────────────────────────────────────────
router.get('/events', protect, admin, getAllEvents);
router.delete('/events/:eventId', protect, admin, deleteEvent);

router.put('/events/:id', protect, admin, async (req, res) => {
  try {
    const { title, description, location, venue, category, eventDate, maxAttendees } = req.body;

    const event = await Event.findByIdAndUpdate(
      req.params.id,
      { title, description, location, venue, category, eventDate, maxAttendees },
      { new: true, runValidators: true }
    );

    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    return res.json({ message: 'Event updated successfully', event });

  } catch (error) {
    console.error('Update event error:', error);
    return res.status(500).json({ message: 'Error updating event', error: error.message });
  }
});

// ─── SERVICES ─────────────────────────────────────────────────────
router.get('/services', protect, admin, async (req, res) => {
  try {
    const services = await Service.find()
      .populate('providerId', 'name email phone location')
      .sort('-createdAt');
    return res.json(services);
  } catch (error) {
    console.error('Get services error:', error);
    return res.status(500).json({ message: 'Error fetching services', error: error.message });
  }
});

router.put('/services/:id', protect, admin, async (req, res) => {
  try {
    const { serviceName, price, description, category, location } = req.body;

    const service = await Service.findByIdAndUpdate(
      req.params.id,
      { serviceName, price, description, category, location },
      { new: true, runValidators: true }
    );

    if (!service) {
      return res.status(404).json({ message: 'Service not found' });
    }

    return res.json({ message: 'Service updated successfully', service });

  } catch (error) {
    console.error('Update service error:', error);
    return res.status(500).json({ message: 'Error updating service', error: error.message });
  }
});

router.delete('/services/:id', protect, admin, async (req, res) => {
  try {
    const service = await Service.findByIdAndDelete(req.params.id);

    if (!service) {
      return res.status(404).json({ message: 'Service not found' });
    }

    return res.json({ message: 'Service deleted successfully' });

  } catch (error) {
    console.error('Delete service error:', error);
    return res.status(500).json({ message: 'Error deleting service', error: error.message });
  }
});

// ─── ANALYTICS ────────────────────────────────────────────────────
router.get('/analytics', protect, admin, getSystemAnalytics);
router.get('/fraud-alerts', protect, admin, getFraudAlerts);

// ─── VENDOR VERIFICATION ──────────────────────────────────────────
router.post('/verify-vendor/:vendorId', protect, admin, verifyVendorWithBadge);
router.get('/verifications/pending', protect, admin, getPendingVerifications);
router.post('/verifications/:vendorId/approve', protect, admin, approveVendorVerification);
router.post('/verifications/:vendorId/reject', protect, admin, rejectVendorVerification);

module.exports = router;