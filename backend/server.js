const express = require('express');
<<<<<<< HEAD
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');

// Load env vars
dotenv.config();

// Connect to database
connectDB();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Import routes
=======
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');

// Route imports
>>>>>>> ed34da906bb3faf0ea102d18bd8c416990098710
const authRoutes = require('./routes/authRoutes');
const serviceRoutes = require('./routes/serviceRoutes');
const bookingRoutes = require('./routes/bookingRoutes');
const recommendationRoutes = require('./routes/recommendationRoutes');
const adminRoutes = require('./routes/adminRoutes');
const eventRoutes = require('./routes/eventRoutes');
const vendorRoutes = require('./routes/vendorRoutes');
const reviewRoutes = require('./routes/reviewRoutes');
const notificationRoutes = require('./routes/notificationRoutes');
const aiRoutes = require('./routes/aiRoutes');
<<<<<<< HEAD
const predictionRoutes = require('./routes/predictionRoutes');

// Mount routes with error handling
const mountRoute = (path, router, name) => {
  try {
    if (typeof router !== 'function') {
      console.error(`❌ Route error at ${path}: Not a router function`);
      return;
    }
    app.use(path, router);
    console.log(`✅ Route mounted: ${path}`);
  } catch (error) {
    console.error(`❌ Error mounting route ${name}:`, error.message);
  }
};

// Mount all routes
mountRoute('/api/auth', authRoutes, 'Auth');
mountRoute('/api/services', serviceRoutes, 'Services');
mountRoute('/api/bookings', bookingRoutes, 'Bookings');
mountRoute('/api/recommendations', recommendationRoutes, 'Recommendations');
mountRoute('/api/admin', adminRoutes, 'Admin');
mountRoute('/api/events', eventRoutes, 'Events');
mountRoute('/api/vendors', vendorRoutes, 'Vendors');
mountRoute('/api/reviews', reviewRoutes, 'Reviews');
mountRoute('/api/notifications', notificationRoutes, 'Notifications');
mountRoute('/api/ai', aiRoutes, 'AI');
mountRoute('/api/predictions', predictionRoutes, 'Predictions');

// Health check route
app.get('/', (req, res) => {
  res.json({ 
    message: 'EventEase+ API is running',
    version: '1.0.0',
    status: 'active'
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Server error:', err.stack);
  res.status(500).json({ 
    message: 'Something went wrong!',
    error: process.env.NODE_ENV === 'development' ? err.message : 'Internal server error'
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

const PORT = process.env.PORT || 5000;

=======

dotenv.config();
connectDB();

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check
app.get('/', (req, res) => {
  res.json({ 
    message: 'EventEase+ Multi-Role Event Ecosystem API',
    version: '2.0',
    status: 'running'
  });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/services', serviceRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/recommendations', recommendationRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/vendors', vendorRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/ai', aiRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    message: 'Something went wrong!',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

const PORT = process.env.PORT || 5000;
>>>>>>> ed34da906bb3faf0ea102d18bd8c416990098710
app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
  console.log(`✅ Environment: ${process.env.NODE_ENV || 'development'}`);
});