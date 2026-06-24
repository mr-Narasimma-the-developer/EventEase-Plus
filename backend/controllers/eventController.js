const Event = require('../models/Event');
const EventAttendance = require('../models/EventAttendance');
const Notification = require('../models/Notification');
const { sendEventConfirmation } = require('../services/emailService');

// Create Event (Organizer)
// const createEvent = async (req, res) => {
//   try {
//     const { title, description, eventType, category, location, venue, eventDate, maxAttendees } = req.body;
    
const createEvent = async (req, res) => {
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

    // Validation
    if (!title || !description || !eventDate || !location || !venue || !category) {
      return res.status(400).json({ message: 'All required fields must be filled' });
    }

    // Upload poster if provided
    let posterUrl = '';
    if (req.file) {
      try {
        const cloudinary = require('../config/cloudinary');
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

    // Populate and return (SINGLE RESPONSE)
    const populatedEvent = await Event.findById(event._id)
      .populate('organizerId', 'name email');

    return res.status(201).json({
      message: 'Event created successfully',
      event: populatedEvent
    });

  } catch (error) {
    console.error('Event creation error:', error);
    // Only send error if headers not sent
    if (!res.headersSent) {
      return res.status(500).json({ 
        message: 'Error creating event', 
        error: error.message 
      });
    }
  }
};

// Get Public Events (for marketplace)
const getPublicEvents = async (req, res) => {
  try {
    const { category, location, date } = req.query;
    
    let filter = { eventType: 'public', status: 'upcoming' };
    
    if (category) filter.category = category;
    if (location) filter.location = { $regex: location, $options: 'i' };
    if (date) {
      const searchDate = new Date(date);
      filter.eventDate = { $gte: searchDate };
    }

    const events = await Event.find(filter)
      .populate('organizerId', 'name email phone')
      .sort('eventDate');
    
    res.json(events);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching events', error: error.message });
  }
};

// Get Nearby Events (Participant)
const getNearbyEvents = async (req, res) => {
  try {
    const { lat, lng, radius = 50 } = req.query;
    
    const events = await Event.find({ 
      eventType: 'public', 
      status: 'upcoming' 
    })
    .populate('organizerId', 'name email')
    .sort('eventDate')
    .limit(20);

    res.json(events);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching nearby events', error: error.message });
  }
};

// Show Interest (Participant)
const showInterest = async (req, res) => {
  try {
    const { eventId } = req.params;
    
    let attendance = await EventAttendance.findOne({
      eventId,
      participantId: req.user._id
    });

    if (attendance) {
      attendance.interestStatus = true;
      attendance.attendanceStatus = 'interested';
      await attendance.save();
    } else {
      attendance = await EventAttendance.create({
        eventId,
        participantId: req.user._id,
        interestStatus: true,
        attendanceStatus: 'interested'
      });
    }

    const event = await Event.findById(eventId);
    await Notification.create({
      userId: event.organizerId,
      type: 'interest',
      title: 'New Interest in Your Event',
      message: `Someone showed interest in ${event.title}`,
      relatedId: eventId,
      relatedType: 'event'
    });

    res.json({ message: 'Interest registered', attendance });
  } catch (error) {
    res.status(500).json({ message: 'Error registering interest', error: error.message });
  }
};

// Confirm Attendance (Participant)
const confirmAttendance = async (req, res) => {
  try {
    const { eventId } = req.params;
    
    const event = await Event.findById(eventId);
    
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    // Check if already confirmed
    let attendance = await EventAttendance.findOne({
      eventId,
      participantId: req.user._id
    });

    if (attendance && attendance.attendanceStatus === 'confirmed') {
      return res.status(400).json({ message: 'Already confirmed attendance' });
    }

    if (!attendance) {
      attendance = await EventAttendance.create({
        eventId,
        participantId: req.user._id,
        attendanceStatus: 'confirmed'
      });
    } else {
      attendance.attendanceStatus = 'confirmed';
      await attendance.save();
    }

    // Update event attendee count
    event.currentAttendees = (event.currentAttendees || 0) + 1;
    await event.save();

    // Send confirmation email
    await sendEventConfirmation(req.user.email, req.user.name, event);

    res.json({
      message: 'Attendance confirmed! Check your email for details.',
      attendance
    });

  } catch (error) {
    res.status(500).json({ message: 'Error confirming attendance', error: error.message });
  }
};

// Get My Events (Organizer)
const getMyEvents = async (req, res) => {
  try {
    const events = await Event.find({ organizerId: req.user._id })
      .sort('-createdAt');
    
    res.json(events);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching events', error: error.message });
  }
};

// Get Event Attendees (Organizer)
const getEventAttendees = async (req, res) => {
  try {
    const { eventId } = req.params;
    
    const event = await Event.findById(eventId);
    
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    if (event.organizerId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Access denied' });
    }

    const attendees = await EventAttendance.find({ eventId })
      .populate('participantId', 'name email phone location')
      .sort('-createdAt');

    res.json(attendees);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching attendees', error: error.message });
  }
};

// Get Single Event
const getEventById = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id)
      .populate('organizerId', 'name email phone location')
      .populate('bookedVendors.vendorId', 'name email phone')
      .populate('bookedVendors.serviceId');

    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    res.json(event);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching event', error: error.message });
  }
};

const QRCode = require('qrcode');

// Generate QR Code for Event
const generateEventQR = async (req, res) => {
  try {
    const { eventId } = req.params;
    
    const event = await Event.findById(eventId);
    
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    // Check if user is organizer
    if (event.organizerId.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized' });
    }

    // Generate QR code data (unique attendance URL)
    const qrData = `${process.env.FRONTEND_URL || 'http://localhost:3000'}/attend/${eventId}`;
    
    // Generate QR code as data URL
    const qrCodeDataURL = await QRCode.toDataURL(qrData, {
      errorCorrectionLevel: 'H',
      type: 'image/png',
      width: 400,
      margin: 2
    });

    res.json({
      eventId,
      eventTitle: event.title,
      qrCode: qrCodeDataURL,
      attendanceUrl: qrData
    });

  } catch (error) {
    res.status(500).json({ message: 'Error generating QR code', error: error.message });
  }
};

// Scan QR and Mark Attendance
const scanQRAttendance = async (req, res) => {
  try {
    const { eventId } = req.params;
    
    const event = await Event.findById(eventId);
    
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    // Mark attendance as 'attended'
    let attendance = await EventAttendance.findOne({
      eventId,
      participantId: req.user._id
    });

    if (!attendance) {
      // Create new attendance record
      attendance = await EventAttendance.create({
        eventId,
        participantId: req.user._id,
        attendanceStatus: 'attended'
      });
    } else {
      attendance.attendanceStatus = 'attended';
      await attendance.save();
    }

    res.json({
      message: 'Attendance marked successfully!',
      event: {
        title: event.title,
        date: event.eventDate
      },
      attendance
    });

  } catch (error) {
    res.status(500).json({ message: 'Error marking attendance', error: error.message });
  }
};

// Update Event
const updateEvent = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      title,
      description,
      category,
      eventDate,
      venue,
      location,
      maxAttendees,
      eventType
    } = req.body;

    const event = await Event.findById(id);

    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    // Check if user is organizer or admin
    if (event.organizerId.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to update this event' });
    }

    event.title = title || event.title;
    event.description = description || event.description;
    event.category = category || event.category;
    event.eventDate = eventDate || event.eventDate;
    event.venue = venue || event.venue;
    event.location = location || event.location;
    event.maxAttendees = maxAttendees || event.maxAttendees;
    event.eventType = eventType || event.eventType;

    // Handle poster upload if new image
    if (req.file) {
      event.posterImage = req.file.path;
    }

    await event.save();

    res.json({
      message: 'Event updated successfully',
      event
    });

  } catch (error) {
    res.status(500).json({ message: 'Error updating event', error: error.message });
  }
};

// Delete Event
const deleteEventByOrganizer = async (req, res) => {
  try {
    const { id } = req.params;

    const event = await Event.findById(id);

    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    // Check if user is organizer or admin
    if (event.organizerId.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to delete this event' });
    }

    // Delete associated attendance records
    await EventAttendance.deleteMany({ eventId: id });

    await Event.findByIdAndDelete(id);

    res.json({ message: 'Event deleted successfully' });

  } catch (error) {
    res.status(500).json({ message: 'Error deleting event', error: error.message });
  }
};

// ADD TO MODULE.EXPORTS
module.exports = {
  createEvent,
  getPublicEvents,
  getNearbyEvents,
  showInterest,
  confirmAttendance,
  getMyEvents,
  getEventAttendees,
  getEventById,
  generateEventQR,
  scanQRAttendance,
  updateEvent,              // ADD
  deleteEventByOrganizer    // ADD
};

// // ADD TO MODULE.EXPORTS
// module.exports = {
//   createEvent,
//   getPublicEvents,
//   getNearbyEvents,
//   showInterest,
//   confirmAttendance,
//   getMyEvents,
//   getEventAttendees,
//   getEventById,
//   generateEventQR,  // NEW
//   scanQRAttendance  // NEW
// };

// module.exports = {
//   createEvent,
//   getPublicEvents,
//   getNearbyEvents,
//   showInterest,
//   confirmAttendance,
//   getMyEvents,
//   getEventAttendees,
//   getEventById
// };