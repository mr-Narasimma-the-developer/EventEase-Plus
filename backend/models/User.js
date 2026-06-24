const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide a name'],
    trim: true
  },
  email: {
    type: String,
    required: [true, 'Please provide an email'],
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please provide a valid email']
  },
  password: {
    type: String,
    required: [true, 'Please provide a password'],
    minlength: 6
  },
  role: {
    type: String,
    enum: ['participant', 'organizer', 'vendor', 'admin'],
    default: 'participant',
    required: [true, 'Please provide a role']
  },
  phone: {
    type: String,
    default: ''
  },
  location: {
    type: String,
    default: ''
  },
  city: {
    type: String,
    default: ''
  },
  state: {
    type: String,
    default: ''
  },
  pincode: {
    type: String,
    default: ''
  }
}, {
  timestamps: true
});

// Index for faster queries
userSchema.index({ email: 1 });
userSchema.index({ role: 1 });

// Log before save
userSchema.pre('save', function(next) {
  console.log('💾 Saving user:', {
    email: this.email,
    role: this.role,
    isNew: this.isNew
  });
  next();
});

// Log after save
userSchema.post('save', function(doc) {
  console.log('✅ User saved:', {
    id: doc._id,
    email: doc.email,
    role: doc.role
  });
});

module.exports = mongoose.model('User', userSchema);