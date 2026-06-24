const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  userName: { type: String, required: true },
  rating: { type: Number, required: true, min: 1, max: 5 },
  comment: { type: String, default: '' },
  createdAt: { type: Date, default: Date.now }
});

const serviceSchema = new mongoose.Schema({
  providerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  serviceName: { type: String, required: true },
  category: {
    type: String,
    required: true,
    enum: ['catering', 'photography', 'decoration', 'venue', 'entertainment', 'other']
  },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  location: { type: String, required: true },
  availability: { type: Boolean, default: true },
  rating: { type: Number, default: 0 },
  totalBookings: { type: Number, default: 0 },
  trustScore: { type: Number, default: 0 },
  reviews: [reviewSchema]
}, { timestamps: true });

module.exports = mongoose.model('Service', serviceSchema); 