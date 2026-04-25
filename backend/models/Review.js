const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
<<<<<<< HEAD
  reviewerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  targetId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    refPath: 'targetType'
  },
  targetType: {
    type: String,
    required: true,
    enum: ['User', 'Event', 'Service']  // Changed from 'vendor' to 'User'
  },
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5
  },
  comment: {
    type: String,
    required: true
  },
  images: [{
    type: String
  }]
}, {
  timestamps: true
});
=======
  reviewerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  targetId: { type: mongoose.Schema.Types.ObjectId, required: true },
  targetType: { type: String, enum: ['event', 'vendor', 'service'], required: true },
  rating: { type: Number, min: 1, max: 5, required: true },
  comment: { type: String, required: true },
  images: [{ type: String }],
  helpful: { type: Number, default: 0 }
}, { timestamps: true });
>>>>>>> ed34da906bb3faf0ea102d18bd8c416990098710

module.exports = mongoose.model('Review', reviewSchema);