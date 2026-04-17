const mongoose = require('mongoose');

const attendanceSchema = new mongoose.Schema({
  eventId: { type: mongoose.Schema.Types.ObjectId, ref: 'Event', required: true },
  participantId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  interestStatus: { type: Boolean, default: false },
  attendanceStatus: { type: String, enum: ['none', 'interested', 'confirmed', 'attended', 'cancelled'], default: 'none' },
  registeredAt: { type: Date, default: Date.now },
  reviewSubmitted: { type: Boolean, default: false }
}, { timestamps: true });

attendanceSchema.index({ eventId: 1, participantId: 1 }, { unique: true });

module.exports = mongoose.model('EventAttendance', attendanceSchema);