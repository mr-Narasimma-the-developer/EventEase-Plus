const express = require('express');
const {
  createService,
  getServices,
  getServiceById,
  updateService,
  deleteService,
  getMyServices
} = require('../controllers/serviceController');
const { protect, providerOnly } = require('../middleware/authMiddleware');

const router = express.Router();

router.route('/')
  .get(getServices)
  .post(protect, providerOnly, createService);

router.get('/my-services', protect, providerOnly, getMyServices);
router.put('/:id', protect, updateService);
router.delete('/:id', protect, deleteService);

router.route('/:id')
  .get(getServiceById)
  .put(protect, providerOnly, updateService)
  .delete(protect, providerOnly, deleteService);

module.exports = router;