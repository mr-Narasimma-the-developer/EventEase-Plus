const Event = require('../models/Event');
const EventAttendance = require('../models/EventAttendance');

// Linear Regression Algorithm for Attendance Prediction
const predictAttendance = async (req, res) => {
  try {
    const { eventId } = req.params;

    // Get current event
    const currentEvent = await Event.findById(eventId);
    if (!currentEvent) {
      return res.status(404).json({ message: 'Event not found' });
    }

    // Check authorization
    if (currentEvent.organizerId.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized' });
    }

    // Fetch historical events by this organizer
    const historicalEvents = await Event.find({
      organizerId: req.user._id,
      eventDate: { $lt: new Date() }, // Only past events
      _id: { $ne: eventId } // Exclude current event
    }).sort('eventDate');

    if (historicalEvents.length < 2) {
      // Not enough data for prediction
      return res.json({
        predicted: null,
        confidence: 'low',
        message: 'Need at least 2 past events for accurate prediction',
        currentInterest: currentEvent.currentAttendees || 0,
        suggestion: 'Based on current interest, expect similar attendance'
      });
    }

    // Collect historical data
    const dataPoints = [];
    for (let i = 0; i < historicalEvents.length; i++) {
      const event = historicalEvents[i];
      const attendanceRecords = await EventAttendance.find({
        eventId: event._id,
        attendanceStatus: { $in: ['confirmed', 'attended'] }
      });
      
      dataPoints.push({
        x: i + 1, // Event sequence number
        y: attendanceRecords.length // Actual attendance
      });
    }

    // Linear Regression Calculation
    const n = dataPoints.length;
    const sumX = dataPoints.reduce((sum, point) => sum + point.x, 0);
    const sumY = dataPoints.reduce((sum, point) => sum + point.y, 0);
    const sumXY = dataPoints.reduce((sum, point) => sum + (point.x * point.y), 0);
    const sumX2 = dataPoints.reduce((sum, point) => sum + (point.x * point.x), 0);

    // Calculate slope (m) and intercept (b) for y = mx + b
    const slope = (n * sumXY - sumX * sumY) / (n * sumX2 - sumX * sumX);
    const intercept = (sumY - slope * sumX) / n;

    // Predict for next event (sequence number = n + 1)
    const nextSequence = n + 1;
    const predictedAttendance = Math.round(slope * nextSequence + intercept);

    // Calculate confidence based on variance
    const avgY = sumY / n;
    const variance = dataPoints.reduce((sum, point) => 
      sum + Math.pow(point.y - avgY, 2), 0) / n;
    const stdDev = Math.sqrt(variance);
    
    // Confidence calculation
    let confidence = 'medium';
    if (stdDev < 10) confidence = 'high';
    else if (stdDev > 30) confidence = 'low';

    // Factor adjustments based on current interest
    const currentInterest = currentEvent.currentAttendees || 0;
    const interestMultiplier = currentInterest > 0 ? Math.min(currentInterest / 50, 1.5) : 1;
    const adjustedPrediction = Math.round(predictedAttendance * interestMultiplier);

    // Category-based adjustment
    const categoryMultipliers = {
      music: 1.3,
      festival: 1.4,
      conference: 1.1,
      workshop: 0.9,
      sports: 1.2,
      social: 1.0
    };
    const categoryMultiplier = categoryMultipliers[currentEvent.category] || 1;
    const finalPrediction = Math.max(1, Math.round(adjustedPrediction * categoryMultiplier));

    res.json({
      predicted: finalPrediction,
      confidence,
      currentInterest,
      historicalEvents: dataPoints,
      algorithm: {
        type: 'Linear Regression',
        slope: slope.toFixed(2),
        intercept: intercept.toFixed(2),
        dataPoints: n
      },
      factors: {
        interestMultiplier: interestMultiplier.toFixed(2),
        categoryMultiplier: categoryMultiplier.toFixed(2),
        categoryFactor: currentEvent.category
      },
      recommendation: finalPrediction > (currentEvent.maxAttendees || Infinity)
        ? 'Consider increasing venue capacity'
        : 'Current capacity is adequate'
    });

  } catch (error) {
    console.error('Prediction error:', error);
    res.status(500).json({ message: 'Error predicting attendance', error: error.message });
  }
};

// Get Attendance Statistics
const getAttendanceStats = async (req, res) => {
  try {
    const { eventId } = req.params;

    const event = await Event.findById(eventId);
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    const attendanceRecords = await EventAttendance.find({ eventId })
      .populate('participantId', 'name email');

    const stats = {
      interested: attendanceRecords.filter(a => a.attendanceStatus === 'interested').length,
      confirmed: attendanceRecords.filter(a => a.attendanceStatus === 'confirmed').length,
      attended: attendanceRecords.filter(a => a.attendanceStatus === 'attended').length,
      total: attendanceRecords.length,
      capacity: event.maxAttendees || 'Unlimited',
      conversionRate: attendanceRecords.length > 0
        ? ((attendanceRecords.filter(a => a.attendanceStatus === 'confirmed').length / attendanceRecords.length) * 100).toFixed(1)
        : 0
    };

    res.json(stats);

  } catch (error) {
    res.status(500).json({ message: 'Error fetching stats', error: error.message });
  }
};

module.exports = {
  predictAttendance,
  getAttendanceStats
};