const express = require('express');
const router = express.Router();
const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const { protect, vendor: vendorOnly } = require('../middleware/authMiddleware');
const VendorProfile = require('../models/VendorProfile');

// CRITICAL FIX: Import cloudinary instance correctly
const { cloudinary } = require('../config/cloudinary');

// Configure Cloudinary storage for vendor documents
const vendorDocStorage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'vendor-verifications',
    allowed_formats: ['jpg', 'jpeg', 'png', 'pdf'],
    resource_type: 'auto'
  }
});

const upload = multer({
  storage: vendorDocStorage,
  limits: { fileSize: 5 * 1024 * 1024 } // 5MB
});

// Map frontend display values to model enum values
const documentTypeMap = {
  'Identity Proof':    'identity_proof',
  'Business License':  'business_license',
  'Business Licence':  'business_license',
  'Tax ID':            'tax_id',
  'Insurance':         'insurance',
  'Portfolio':         'portfolio',
  'Other':             'other',
  // Already correct values pass through
  'identity_proof':    'identity_proof',
  'business_license':  'business_license',
  'tax_id':            'tax_id',
  'insurance':         'insurance',
  'portfolio':         'portfolio',
  'other':             'other'
};

// ─── GET verification status ─────────────────────────────────────
router.get('/verification/status', protect, vendorOnly, async (req, res) => {
  try {
    const profile = await VendorProfile.findOne({ userId: req.user._id });

    if (!profile) {
      return res.json({
        isVerified: false,
        verificationStatus: 'unverified',
        documents: []
      });
    }

    return res.json({
      isVerified: profile.isVerified,
      verificationStatus: profile.verificationStatus,
      verificationBadge: profile.verificationBadge,
      documents: profile.verificationDocuments || [],
      rejectionReason: profile.verificationNotes || ''
    });

  } catch (error) {
    console.error('Get verification status error:', error);
    return res.status(500).json({
      message: 'Error fetching verification status',
      error: error.message
    });
  }
});

// ─── UPLOAD verification document ────────────────────────────────
router.post('/verification/upload', protect, vendorOnly, upload.single('document'), async (req, res) => {
  try {
    console.log('📄 Upload request received:', {
      userId: req.user._id,
      body: req.body,
      file: req.file ? `${req.file.originalname} → ${req.file.path}` : 'MISSING'
    });

    // Check file
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded. Please select a file.' });
    }

    const { documentType, documentName } = req.body;

    if (!documentType || !documentName) {
      return res.status(400).json({ message: 'Document type and name are required' });
    }

    // CRITICAL FIX: Normalize documentType to match enum
    const normalizedType = documentTypeMap[documentType] || 'other';

    console.log('📄 Document type mapping:', documentType, '→', normalizedType);

    // Get Cloudinary URL
    const documentUrl = req.file.path || req.file.secure_url || req.file.url;

    if (!documentUrl) {
      console.error('❌ No URL from Cloudinary. File object:', req.file);
      return res.status(500).json({ message: 'File upload to cloud failed. No URL returned.' });
    }

    console.log('✅ Cloudinary URL:', documentUrl);

    // Find or create vendor profile
    let profile = await VendorProfile.findOne({ userId: req.user._id });

    if (!profile) {
      console.log('📝 Creating new vendor profile for:', req.user._id);
      profile = new VendorProfile({
        userId: req.user._id,
        isVerified: false,
        verificationStatus: 'unverified',
        trustScore: 0,
        completedEvents: 0,
        verificationDocuments: []
      });
    }

    // Add document to profile
    const newDocument = {
      documentType: normalizedType,
      documentName: documentName.trim(),
      documentUrl: documentUrl,
      uploadedAt: new Date(),
      status: 'pending'
    };

    profile.verificationDocuments.push(newDocument);
    profile.verificationStatus = 'pending';

    await profile.save();

    console.log('✅ Document saved successfully:', newDocument);

    return res.json({
      message: 'Document uploaded successfully! Pending admin review.',
      document: newDocument,
      profile: {
        verificationStatus: profile.verificationStatus,
        documentsCount: profile.verificationDocuments.length
      }
    });

  } catch (error) {
    console.error('❌ Upload error:', error);
    console.error('❌ Error stack:', error.stack);

    // Mongoose validation error — give specific message
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(e => e.message);
      return res.status(400).json({
        message: `Validation failed: ${messages.join(', ')}`,
        error: error.message
      });
    }

    return res.status(500).json({
      message: 'Something went wrong during upload',
      error: error.message
    });
  }
});

// ─── GET vendor search ────────────────────────────────────────────
router.post('/search', protect, async (req, res) => {
  try {
    const { category, location, minTrustScore } = req.body;

    let query = { isVerified: true };
    if (minTrustScore) query.trustScore = { $gte: Number(minTrustScore) };

    const vendors = await VendorProfile.find(query)
      .populate('userId', 'name email phone location')
      .sort('-trustScore')
      .limit(20);

    let filtered = vendors;
    if (location) {
      filtered = vendors.filter(v =>
        v.userId?.location?.toLowerCase().includes(location.toLowerCase())
      );
    }

    return res.json(filtered);

  } catch (error) {
    console.error('Vendor search error:', error);
    return res.status(500).json({
      message: 'Error searching vendors',
      error: error.message
    });
  }
});

// GET public vendor profile (for service detail page)
router.get('/profile/:userId', async (req, res) => {
  try {
    const profile = await VendorProfile.findOne({ userId: req.params.userId });

    if (!profile) {
      return res.status(404).json({ message: 'Vendor profile not found' });
    }

    return res.json({
      isVerified: profile.isVerified,
      verificationBadge: profile.verificationBadge,
      trustScore: profile.trustScore,
      completedEvents: profile.completedEvents,
      bio: profile.bio,
      specializations: profile.specializations
    });

  } catch (error) {
    console.error('Get vendor profile error:', error);
    return res.status(500).json({ message: 'Error fetching vendor profile', error: error.message });
  }
});

module.exports = router;