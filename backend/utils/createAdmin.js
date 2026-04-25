const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
require('dotenv').config();

const createDefaultAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    
    console.log('Connected to MongoDB');

    // Check if admin already exists
    const existingAdmin = await User.findOne({ email: 'admin@eventease.com' });
    
    if (existingAdmin) {
      console.log('Admin user already exists!');
      console.log('Email: admin@eventease.com');
      console.log('Password: Admin@123');
      process.exit(0);
    }

    // Create admin user
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

    console.log('✅ Admin user created successfully!');
    console.log('==========================================');
    console.log('Email: admin@eventease.com');
    console.log('Password: Admin@123');
    console.log('==========================================');
    console.log('Use these credentials to login as admin');

    process.exit(0);

  } catch (error) {
    console.error('Error creating admin:', error);
    process.exit(1);
  }
};

createDefaultAdmin();