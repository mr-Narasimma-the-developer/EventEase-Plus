const mongoose = require('mongoose');

const vendorProfileSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },
  bio: {
    type: String,
    default: ''
  },
  specializations: [{
    type: String
  }],
  portfolioImages: [{
    type: String
  }],
  trustScore: {
    type: Number,
    default: 0,
    min: 0,
    max: 100
  },
  completedEvents: {
    type: Number,
    default: 0
  },
  isVerified: {
    type: Boolean,
    default: false
  },
  verificationBadge: {
    type: String,
    enum: ['none', 'standard', 'premium', 'elite'],
    default: 'none'
  },
  verificationDocuments: [{
    documentType: {
      type: String,
      enum: ['business_license', 'tax_id', 'insurance', 'portfolio', 'identity_proof', 'other'],
      required: true
    },
    documentUrl: {
      type: String,
      required: true
    },
    documentName: {
      type: String,
      required: true
    },
    uploadedAt: {
      type: Date,
      default: Date.now
    },
    status: {
      type: String,
      enum: ['pending', 'approved', 'rejected'],
      default: 'pending'
    }
  }],
  verificationStatus: {
    type: String,
    enum: ['unverified', 'pending', 'verified', 'rejected'],
    default: 'unverified'
  },
  verificationNotes: {
    type: String,
    default: ''
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('VendorProfile', vendorProfileSchema);