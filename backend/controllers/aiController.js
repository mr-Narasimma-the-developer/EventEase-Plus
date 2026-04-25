const Event = require('../models/Event');
const Service = require('../models/Service');

const chatbot = async (req, res) => {
  try {
    const { message } = req.body;

    if (!message) {
      return res.status(400).json({ message: 'Message is required' });
    }

    const userMessage = message.toLowerCase();

    // Intent detection
    let intent = 'general';
    let response = '';

    // Greeting
    if (/hello|hi|hey|greet|start|help me/i.test(userMessage)) {
      intent = 'greeting';
      response = "Hello! I'm EventEase+ AI Assistant. I can help you with:\n\n• Finding events near you\n• Discovering vendors and services\n• Planning your event budget\n• Getting event recommendations\n\nWhat would you like to know?";
    }
    // Create event
    else if (/create.*event|how.*create|make.*event|organize|new event/i.test(userMessage)) {
      intent = 'create_event';
      response = "To create an event:\n\n1. Go to Menu → Create Event\n2. Fill in event details (title, date, location, description)\n3. Upload a poster (optional)\n4. Set privacy (public/private)\n5. Click 'Create Event'\n\nNeed help with event planning? I can suggest budget estimates and vendors!";
    }
    // Find events
    else if (/find.*event|search.*event|discover.*event|show.*event|nearby|what.*event/i.test(userMessage)) {
      intent = 'find_events';
      const events = await Event.find({ privacy: 'public' })
        .sort('-eventDate')
        .limit(5)
        .populate('organizerId', 'name');

      if (events.length > 0) {
        response = `Here are upcoming events:\n\n${events.map((e, i) => 
          `${i + 1}. ${e.title}\n   📅 ${new Date(e.eventDate).toLocaleDateString()}\n   📍 ${e.location}`
        ).join('\n\n')}`;
      } else {
        response = "No upcoming events found. Check back later or create your own event!";
      }
    }
    // Vendor/service suggestions
    else if (/vendor|photographer|caterer|service|provider|find.*vendor|suggest.*vendor/i.test(userMessage)) {
      intent = 'vendor_suggestion';
      const services = await Service.find()
        .populate('providerId', 'name')
        .limit(5);

      if (services.length > 0) {
        response = `⭐ Top Vendors:\n\n${services.map((s, i) => 
          `${i + 1}. ${s.serviceName}\n   💼 By: ${s.providerId?.name}\n   💰 ₹${s.price}\n   📍 ${s.location}`
        ).join('\n\n')}`;
      } else {
        response = "No services available at the moment. Check our marketplace for more options!";
      }
    }
    // Budget advice
    else if (/budget|cost|price|expensive|how much|estimate/i.test(userMessage)) {
      intent = 'budget_advice';
      response = "For a well-planned budget:\n\n✓ Use the Budget Estimator (in More menu)\n✓ Plan ₹500-600 per person for standard events\n✓ Book vendors 2-3 months early for better rates\n✓ Always keep 10-15% buffer for unexpected costs\n\nWhat's your total budget?";
    }
    // Event planning
    else if (/plan|organize|how to|guide|help.*plan|tips/i.test(userMessage)) {
      intent = 'event_planning';
      response = "Event Planning Checklist:\n\n1️⃣ Set date & budget\n2️⃣ Choose venue & location\n3️⃣ Book vendors (caterer, photographer, etc.)\n4️⃣ Send invitations\n5️⃣ Confirm attendance\n6️⃣ Finalize details 1 week before\n\nNeed vendor recommendations? Just ask!";
    }
    // Default
    else {
      response = "I'm here to help with events and vendors! Try asking:\n\n• 'Find events near me'\n• 'Suggest photographers in Chennai'\n• 'Budget estimation'\n• 'How to create an event'\n\nWhat would you like to know?";
    }

    res.json({
      intent,
      response,
      timestamp: new Date()
    });

  } catch (error) {
    console.error('Chatbot error:', error);
    res.status(500).json({ message: 'Error processing request', error: error.message });
  }
};

module.exports = { chatbot };