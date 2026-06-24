const express = require('express');
const router = express.Router();
const multer = require('multer');
const { protect, organizer } = require('../middleware/authMiddleware');
const Event = require('../models/Event');
const EventAttendance = require('../models/EventAttendance');
const qrcode = require('qrcode');
const cloudinary = require('../config/cloudinary');

const storage = multer.diskStorage({});
const upload = multer({ storage });

/// GET all public events
router.get('/public', async (req, res) => {
  try {
    const { category, location, date } = req.query;

    console.log('Fetching public events...');

    // CRITICAL FIX: Don't filter by privacy/eventType at all
    // Just exclude events explicitly marked private
    // This handles both field naming conventions
    let query = {
      $and: [
        { privacy: { $ne: 'private' } },
        { eventType: { $ne: 'private' } }
      ]
    };

    if (category) query.category = category;
    if (location) query.location = new RegExp(location, 'i');
    if (date) {
      const searchDate = new Date(date);
      query.eventDate = {
        $gte: searchDate,
        $lt: new Date(searchDate.getTime() + 24 * 60 * 60 * 1000)
      };
    }

    const events = await Event.find(query)
      .populate('organizerId', 'name email')
      .sort('eventDate');

    console.log(`Found ${events.length} public events`);

    return res.json(events);

  } catch (error) {
    console.error('Get public events error:', error);
    return res.status(500).json({ message: 'Error fetching events', error: error.message });
  }
});

// GET my events - CRITICAL: Must be BEFORE /:id route
router.get('/my-events', protect, organizer, async (req, res) => {
  try {
    console.log('Fetching events for organizer:', req.user._id);
    
    const events = await Event.find({ organizerId: req.user._id })
      .sort('-createdAt');
    
    console.log(`Found ${events.length} events`);
    
    return res.json(events);
    
  } catch (error) {
    console.error('Get my events error:', error);
    return res.status(500).json({ message: 'Error fetching events', error: error.message });
  }
});

// GET event by ID
router.get('/:id', async (req, res) => {
  try {
    const event = await Event.findById(req.params.id)
      .populate('organizerId', 'name email phone location');
    
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }
    
    return res.json(event);
    
  } catch (error) {
    console.error('Get event error:', error);
    return res.status(500).json({ message: 'Error fetching event', error: error.message });
  }
});

// CREATE event
router.post('/', protect, organizer, upload.single('poster'), async (req, res) => {
  try {
    const {
      title,
      description,
      eventDate,
      location,
      venue,
      category,
      privacy,
      maxAttendees
    } = req.body;
    
    console.log('Creating event:', { title, eventDate, location });
    
    // Validation
    if (!title || !description || !eventDate || !location || !venue || !category) {
      return res.status(400).json({ message: 'All required fields must be filled' });
    }
    
    // Handle poster upload
    let posterUrl = '';
    if (req.file) {
      try {
        const result = await cloudinary.uploader.upload(req.file.path);
        posterUrl = result.secure_url;
      } catch (uploadError) {
        console.error('Poster upload error:', uploadError);
      }
    }
    
    // Create event
    const event = await Event.create({
      title,
      description,
      eventDate: new Date(eventDate),
      location,
      venue,
      category,
      privacy: privacy || 'public',
      maxAttendees: maxAttendees || null,
      poster: posterUrl,
      organizerId: req.user._id,
      currentAttendees: 0,
      interestedCount: 0,
      confirmedCount: 0
    });
    
    const populatedEvent = await Event.findById(event._id)
      .populate('organizerId', 'name email');
    
    console.log('Event created successfully:', event._id);
    
    return res.status(201).json({
      message: 'Event created successfully',
      event: populatedEvent
    });
    
  } catch (error) {
    console.error('Event creation error:', error);
    return res.status(500).json({ message: 'Error creating event', error: error.message });
  }
});

// UPDATE event
router.put('/:id', protect, organizer, upload.single('poster'), async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }
    
    if (event.organizerId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }
    
    const {
      title,
      description,
      eventDate,
      location,
      venue,
      category,
      privacy,
      maxAttendees
    } = req.body;
    
    // Update fields
    event.title = title || event.title;
    event.description = description || event.description;
    event.eventDate = eventDate || event.eventDate;
    event.location = location || event.location;
    event.venue = venue || event.venue;
    event.category = category || event.category;
    event.privacy = privacy || event.privacy;
    event.maxAttendees = maxAttendees || event.maxAttendees;
    
    // Handle poster update
    if (req.file) {
      try {
        const result = await cloudinary.uploader.upload(req.file.path);
        event.poster = result.secure_url;
      } catch (uploadError) {
        console.error('Poster upload error:', uploadError);
      }
    }
    
    await event.save();
    
    return res.json({
      message: 'Event updated successfully',
      event
    });
    
  } catch (error) {
    console.error('Update event error:', error);
    return res.status(500).json({ message: 'Error updating event', error: error.message });
  }
});

// DELETE event
router.delete('/:id', protect, organizer, async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }
    
    if (event.organizerId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }
    
    // Delete attendance records
    await EventAttendance.deleteMany({ eventId: req.params.id });
    
    // Delete event
    await Event.findByIdAndDelete(req.params.id);
    
    return res.json({ message: 'Event deleted successfully' });
    
  } catch (error) {
    console.error('Delete event error:', error);
    return res.status(500).json({ message: 'Error deleting event', error: error.message });
  }
});

// SHOW INTEREST - CRITICAL ROUTE
router.post('/:id/interest', protect, async (req, res) => {
  try {
    const { id } = req.params;
    
    console.log('Show interest request:', { eventId: id, userId: req.user._id });
    
    // Check if already registered
    const existing = await EventAttendance.findOne({
      eventId: id,
      participantId: req.user._id
    });
    
    if (existing) {
      return res.status(400).json({ message: 'Already registered for this event' });
    }
    
    // Create attendance record
    await EventAttendance.create({
      eventId: id,
      participantId: req.user._id,
      attendanceStatus: 'interested'
    });
    
    // Update event counts
    const event = await Event.findById(id);
    event.interestedCount = (event.interestedCount || 0) + 1;
    event.currentAttendees = (event.currentAttendees || 0) + 1;
    await event.save();
    
    console.log('Interest registered successfully');
    
    return res.json({ 
      message: 'Interest registered successfully',
      attendanceStatus: 'interested'
    });
    
  } catch (error) {
    console.error('Interest registration error:', error);
    return res.status(500).json({ message: 'Error registering interest', error: error.message });
  }
});

// CONFIRM ATTENDANCE - CRITICAL ROUTE
router.post('/:id/confirm-attendance', protect, async (req, res) => {
  try {
    const { id } = req.params;
    
    console.log('Confirm attendance request:', { eventId: id, userId: req.user._id });
    
    // Find existing attendance
    let attendance = await EventAttendance.findOne({
      eventId: id,
      participantId: req.user._id
    });
    
    if (!attendance) {
      // Create new attendance
      attendance = await EventAttendance.create({
        eventId: id,
        participantId: req.user._id,
        attendanceStatus: 'confirmed'
      });
      
      // Update counts
      const event = await Event.findById(id);
      event.confirmedCount = (event.confirmedCount || 0) + 1;
      event.currentAttendees = (event.currentAttendees || 0) + 1;
      await event.save();
      
    } else {
      // Update existing attendance
      const oldStatus = attendance.attendanceStatus;
      attendance.attendanceStatus = 'confirmed';
      await attendance.save();
      
      // Update counts
      const event = await Event.findById(id);
      if (oldStatus === 'interested') {
        event.interestedCount = Math.max(0, (event.interestedCount || 0) - 1);
      }
      event.confirmedCount = (event.confirmedCount || 0) + 1;
      await event.save();
    }
    
    console.log('Attendance confirmed successfully');
    
    return res.json({ 
      message: 'Attendance confirmed successfully',
      attendanceStatus: 'confirmed'
    });
    
  } catch (error) {
    console.error('Attendance confirmation error:', error);
    return res.status(500).json({ message: 'Error confirming attendance', error: error.message });
  }
});

// GET user's attendance status for an event
router.get('/:id/attendance-status', protect, async (req, res) => {
  try {
    const attendance = await EventAttendance.findOne({
      eventId: req.params.id,
      participantId: req.user._id
    });
    
    return res.json({
      hasAttendance: !!attendance,
      status: attendance ? attendance.attendanceStatus : null
    });
    
  } catch (error) {
    console.error('Get attendance status error:', error);
    return res.status(500).json({ message: 'Error fetching status', error: error.message });
  }
});

// GENERATE QR CODE
router.get('/:id/qr', protect, organizer, async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }
    
    if (event.organizerId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }
    
    const qrData = `${process.env.FRONTEND_URL || 'http://localhost:3000'}/attend/${event._id}`;
    
    const qrCodeUrl = await qrcode.toDataURL(qrData, {
      errorCorrectionLevel: 'H',
      type: 'image/png',
      width: 400,
      margin: 2
    });
    
    console.log('QR code generated successfully');
    
    return res.json({
      qrCode: qrCodeUrl,
      attendUrl: qrData,
      eventId: event._id,
      eventTitle: event.title
    });
    
  } catch (error) {
    console.error('QR generation error:', error);
    return res.status(500).json({ message: 'Error generating QR code', error: error.message });
  }
});

// SCAN QR ATTENDANCE
router.post('/:id/scan-attendance', protect, async (req, res) => {
  try {
    const { id } = req.params;
    
    console.log('Scan attendance:', { eventId: id, userId: req.user._id });
    
    const event = await Event.findById(id);
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }
    
    // Check existing attendance
    let attendance = await EventAttendance.findOne({
      eventId: id,
      participantId: req.user._id
    });
    
    if (attendance) {
      if (attendance.attendanceStatus === 'attended') {
        return res.status(400).json({ message: 'Attendance already marked' });
      }
      
      const oldStatus = attendance.attendanceStatus;
      attendance.attendanceStatus = 'attended';
      await attendance.save();
      
      // Update counts
      if (oldStatus === 'interested') {
        event.interestedCount = Math.max(0, (event.interestedCount || 0) - 1);
      } else if (oldStatus === 'confirmed') {
        event.confirmedCount = Math.max(0, (event.confirmedCount || 0) - 1);
      }
      event.currentAttendees = (event.currentAttendees || 0) + 1;
      await event.save();
      
    } else {
      // Create new attendance
      await EventAttendance.create({
        eventId: id,
        participantId: req.user._id,
        attendanceStatus: 'attended'
      });
      
      event.currentAttendees = (event.currentAttendees || 0) + 1;
      await event.save();
    }
    
    console.log('Attendance marked successfully');
    
    return res.json({ 
      message: 'Attendance marked successfully',
      eventTitle: event.title
    });
    
  } catch (error) {
    console.error('Scan attendance error:', error);
    return res.status(500).json({ message: 'Error marking attendance', error: error.message });
  }
});

// GET event attendees
router.get('/:id/attendees', async (req, res) => {
  try {
    const attendees = await EventAttendance.find({ eventId: req.params.id })
      .populate('participantId', 'name email phone');
    
    return res.json(attendees);
    
  } catch (error) {
    console.error('Get attendees error:', error);
    return res.status(500).json({ message: 'Error fetching attendees', error: error.message });
  }
});

module.exports = router;