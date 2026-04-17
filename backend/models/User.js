const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  role: {
    type: String,
    enum: ['participant', 'organizer', 'vendor', 'admin'],
    default: 'participant'
  },
  preferences: {
    eventCategories: [String],
    notificationEnabled: { type: Boolean, default: true }
  },
  coordinates: {
    lat: Number,
    lng: Number
  },
  phone: {
    type: String
  },
  location: {
    type: String
  },
  isVerified: {
    type: Boolean,
    default: false
  },
  rating: {
    type: Number,
    default: 0
  },
totalBookings: {
  type: Number,
  default: 0
},
// ADD THESE FIELDS TO YOUR EXISTING USER SCHEMA
address: {
  type: String
},
city: {
  type: String
},
state: {
  type: String
},
pincode: {
  type: String
},
bio: {
  type: String
}
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);