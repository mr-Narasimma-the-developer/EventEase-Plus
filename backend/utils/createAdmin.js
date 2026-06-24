const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
require('dotenv').config();

const createDefaultAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected to MongoDB');

    // Delete any existing admin
    await User.deleteOne({ email: 'admin@eventease.com' });
    
    // Create fresh admin
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('Admin@123', salt);

    const admin = await User.create({
      name: 'System Admin',
      email: 'admin@eventease.com',
      password: hashedPassword,
      role: 'admin',
      phone: '9999999999',
      location: 'System',
      city: 'System',
      state: 'System',
      pincode: '000000'
    });

    console.log('\n✅ ADMIN CREATED SUCCESSFULLY!');
    console.log('═══════════════════════════════════════');
    console.log('📧 Email:    admin@eventease.com');
    console.log('🔑 Password: Admin@123');
    console.log('═══════════════════════════════════════\n');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
};

createDefaultAdmin();