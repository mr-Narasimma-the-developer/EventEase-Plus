const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Generate JWT Token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '7d'
  });
};

// Register User - COMPLETE FIX WITH DEBUG LOGGING
const registerUser = async (req, res) => {
  try {
    const { name, email, password, role, phone, location, city, state, pincode } = req.body;

    console.log('🔵 Registration attempt:', { 
      email, 
      role, 
      hasName: !!name,
      hasPassword: !!password 
    });

    // Validate required fields
    if (!name || !email || !password || !role) {
      console.error('🔴 Missing required fields');
      return res.status(400).json({ message: 'Please provide all required fields' });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      console.error('🔴 Invalid email format:', email);
      return res.status(400).json({ message: 'Invalid email format' });
    }

    // Validate role
    const validRoles = ['participant', 'organizer', 'vendor', 'admin'];
    if (!validRoles.includes(role)) {
      console.error('🔴 Invalid role:', role);
      return res.status(400).json({ message: 'Invalid role' });
    }

    // Check if user exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      console.error('🔴 User already exists:', email);
      return res.status(400).json({ message: 'User already exists with this email' });
    }

    console.log('🔵 Hashing password...');
    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    console.log('🔵 Creating user in database...');
    // Create user
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role,
      phone: phone || '',
      location: location || '',
      city: city || '',
      state: state || '',
      pincode: pincode || ''
    });

    console.log('🟢 User created successfully:', {
      id: user._id,
      email: user.email,
      role: user.role
    });

    // Generate token
    console.log('🔵 Generating JWT token...');
    const token = generateToken(user._id);

    console.log('🟢 Token generated successfully');

    // Prepare response
    const responseData = {
      message: 'User registered successfully',
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        phone: user.phone,
        location: user.location,
        city: user.city,
        state: user.state,
        pincode: user.pincode
      }
    };

    console.log('🟢 Sending success response:', {
      hasToken: !!responseData.token,
      hasUser: !!responseData.user,
      userRole: responseData.user.role
    });

    // CRITICAL: ONLY ONE RESPONSE
    return res.status(201).json(responseData);

  } catch (error) {
    console.error('🔴 Registration error:', error);
    console.error('🔴 Error stack:', error.stack);
    
    // Handle duplicate key error
    if (error.code === 11000) {
      return res.status(400).json({ message: 'User already exists' });
    }
    
    // Generic error response
    return res.status(500).json({ 
      message: 'Error registering user', 
      error: error.message 
    });
  }
};
// Login User - COMPLETE FIX WITH DEBUG LOGGING
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    console.log('🔵 Login attempt:', email);

    // Validate input
    if (!email || !password) {
      console.error('🔴 Missing credentials');
      return res.status(400).json({ message: 'Please provide email and password' });
    }

    console.log('🔵 Finding user in database...');
    // Find user
    const user = await User.findOne({ email });
    
    if (!user) {
      console.error('🔴 User not found:', email);
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    console.log('🟢 User found:', {
      id: user._id,
      email: user.email,
      role: user.role
    });

    console.log('🔵 Checking password...');
    // Check password
    const isMatch = await bcrypt.compare(password, user.password);
    
    if (!isMatch) {
      console.error('🔴 Password mismatch');
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    console.log('🟢 Password verified');

    // Generate token
    console.log('🔵 Generating JWT token...');
    const token = generateToken(user._id);

    console.log('🟢 Token generated');

    // Prepare response
    const responseData = {
      message: 'Login successful',
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        phone: user.phone,
        location: user.location,
        city: user.city,
        state: user.state,
        pincode: user.pincode
      }
    };

    console.log('🟢 Sending login response:', {
      hasToken: !!responseData.token,
      hasUser: !!responseData.user,
      userRole: responseData.user.role
    });

    // CRITICAL: ONLY ONE RESPONSE
    return res.json(responseData);

  } catch (error) {
    console.error('🔴 Login error:', error);
    console.error('🔴 Error stack:', error.stack);
    
    return res.status(500).json({ 
      message: 'Error logging in', 
      error: error.message 
    });
  }
};

// Get Current User
const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    return res.json(user);

  } catch (error) {
    console.error('Get user error:', error);
    return res.status(500).json({ 
      message: 'Error fetching user', 
      error: error.message 
    });
  }
};

// Update Profile
const updateProfile = async (req, res) => {
  try {
    const { name, phone, location, city, state, pincode } = req.body;

    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Update fields if provided
    if (name) user.name = name;
    if (phone !== undefined) user.phone = phone;
    if (location !== undefined) user.location = location;
    if (city !== undefined) user.city = city;
    if (state !== undefined) user.state = state;
    if (pincode !== undefined) user.pincode = pincode;

    await user.save();

    console.log('Profile updated:', user._id);

    return res.json({
      message: 'Profile updated successfully',
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        phone: user.phone,
        location: user.location,
        city: user.city,
        state: user.state,
        pincode: user.pincode
      }
    });

  } catch (error) {
    console.error('Update profile error:', error);
    return res.status(500).json({ 
      message: 'Error updating profile', 
      error: error.message 
    });
  }
};

module.exports = {
  registerUser,
  loginUser,
  getMe,
  getprofile: getMe, // Alias for getMe
  updateProfile
};