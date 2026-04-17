const mongoose = require('mongoose');

const vendorProfileSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
  portfolioImages: [{ type: String }],
  bio: { type: String },
  specializations: [{ type: String }],
  completedEvents: { type: Number, default: 0 },
  responseRate: { type: Number, default: 0 },
  trustScore: { type: Number, default: 0 },
  isVerified: { type: Boolean, default: false },
  verificationBadge: { type: String },
  workGallery: [{
    image: String,
    title: String,
    eventType: String
  }]
}, { timestamps: true });

module.exports = mongoose.model('VendorProfile', vendorProfileSchema);