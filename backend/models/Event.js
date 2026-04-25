const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  organizerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  eventType: { type: String, enum: ['public', 'private'], default: 'public' },
  category: { type: String, required: true },
  location: { type: String, required: true },
  venue: { type: String, required: true },
  eventDate: { type: Date, required: true },
  posterImage: { type: String },
  maxAttendees: { type: Number },
  currentAttendees: { type: Number, default: 0 },
  status: { type: String, enum: ['upcoming', 'ongoing', 'completed', 'cancelled'], default: 'upcoming' },
  bookedVendors: [{
    vendorId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    serviceId: { type: mongoose.Schema.Types.ObjectId, ref: 'Service' },
    status: { type: String, enum: ['pending', 'confirmed', 'completed'], default: 'pending' }
  }]
}, { timestamps: true });

module.exports = mongoose.model('Event', eventSchema);