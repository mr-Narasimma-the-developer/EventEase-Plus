const Event = require('../models/Event');
const Service = require('../models/Service');

<<<<<<< HEAD
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
=======
const chatResponses = {
  greetings: [
    "Hello! I'm your EventEase+ AI assistant. I can help you with:\n• Creating events\n• Finding vendors\n• Budget planning\n• Event recommendations\n\nWhat would you like help with?",
    "Hi there! I'm here to help you plan amazing events. Ask me about vendors, budgets, or event planning tips!",
    "Welcome! I can assist with event planning, vendor selection, and budget estimation. How can I help you today?"
  ],
  
  eventPlanning: [
    "Great! Here's how to create a successful event:\n\n1. Define your event type and audience\n2. Set a realistic budget\n3. Book venue early (2-3 months ahead)\n4. Select vendors based on trust scores\n5. Promote your event\n\nNeed help with any specific step?",
    "I can help you plan! First, tell me:\n• What type of event? (music, workshop, conference, etc.)\n• How many people?\n• What's your budget?\n\nI'll suggest the perfect vendors!",
    "Event planning made easy:\n• Use our Budget Estimator for cost planning\n• Check Vendor Recommendations for trusted providers\n• Create your event and track analytics\n\nWhat's your event about?"
  ],
  
  vendorSuggestion: [
    "Looking for vendors? Here's what I recommend:\n\n1. Go to 'Vendors & Services' in the menu\n2. Use filters for location and budget\n3. Check vendor Trust Scores (aim for 70+)\n4. Look for verified badges ✓\n\nOr use 'Find Vendors (AI)' for smart recommendations!",
    "I can help you find the perfect vendors! Tell me:\n• What service do you need? (catering, photography, etc.)\n• Your budget range?\n• Preferred location?\n\nI'll find vendors with high trust scores!",
    "Smart vendor selection:\n• Trust Score above 70 = Reliable\n• Verified badge = Admin approved\n• Check completed events count\n• Read reviews from real clients\n\nWant me to search for specific vendors?"
  ],
  
  budgetAdvice: [
    "Budget Planning Guide:\n\n💰 Typical breakdown:\n• Venue: 30%\n• Catering: 35%\n• Entertainment: 20%\n• Decoration: 10%\n• Other: 5%\n\nUse our Budget Estimator tool for accurate calculations!",
    "For a well-planned budget:\n\n✓ Use the Budget Estimator (in More menu)\n✓ Plan ₹500-600 per person for standard events\n✓ Book vendors 2-3 months early for better rates\n✓ Always keep 10-15% buffer for unexpected costs\n\nWhat's your total budget?",
    "Budget Tips:\n• Music events: ₹500-600/person\n• Workshops: ₹300-400/person\n• Conferences: ₹400-500/person\n\nGo to 'Budget Estimator' for detailed breakdown!"
  ],
  
  createEvent: [
    "To create an event:\n\n1. Click 'Create Event' button (top right)\n2. Fill in event details\n3. Upload a poster image\n4. Set capacity and date\n5. Publish!\n\nYour event will appear in the feed immediately. Want me to guide you?",
    "Creating events is easy! You need:\n• Event title and description\n• Date and venue\n• Category (music, workshop, etc.)\n• Optional: poster image\n\nGo to the '+Create Event' button to start!"
  ],
  
  findEvents: [
    "To discover events:\n\n1. Check your Dashboard (Home) for event feed\n2. Use filters on the left sidebar\n3. Click events to see details\n4. Show Interest or Confirm Attendance\n\nI can also help you find events by category. What interests you?"
  ]
};

const detectIntent = (message) => {
  const msg = message.toLowerCase();
  
  if (msg.match(/hello|hi|hey|greet|start|help me/i)) return 'greetings';
  if (msg.match(/create.*event|how.*create|make.*event|organize|new event/i)) return 'createEvent';
  if (msg.match(/find.*event|search.*event|discover.*event|show.*event|nearby|what.*event/i)) return 'findEvents';
  if (msg.match(/vendor|photographer|caterer|service|provider|find.*vendor|suggest.*vendor/i)) return 'vendorSuggestion';
  if (msg.match(/budget|cost|price|expensive|how much|estimate/i)) return 'budgetAdvice';
  if (msg.match(/plan|organize|how to|guide|help.*plan|tips/i)) return 'eventPlanning';
  
  return 'general';
};

const getAIResponse = async (req, res) => {
  try {
    const { message } = req.body;
    
    const intent = detectIntent(message);
    
    let response;
    
    switch(intent) {
      case 'greetings':
        response = chatResponses.greetings[Math.floor(Math.random() * chatResponses.greetings.length)];
        break;
        
      case 'createEvent':
        response = chatResponses.createEvent[Math.floor(Math.random() * chatResponses.createEvent.length)];
        break;
        
      case 'findEvents':
        response = chatResponses.findEvents[0];
        
        const events = await Event.find({ eventType: 'public', status: 'upcoming' })
          .limit(5)
          .populate('organizerId', 'name')
          .sort('eventDate');
        
        if (events.length > 0) {
          response += "\n\n📅 Upcoming Events:\n\n";
          events.forEach((e, i) => {
            response += `${i + 1}. ${e.title}\n   📍 ${e.location} | 📅 ${new Date(e.eventDate).toLocaleDateString()}\n\n`;
          });
        }
        break;
        
      case 'eventPlanning':
        response = chatResponses.eventPlanning[Math.floor(Math.random() * chatResponses.eventPlanning.length)];
        break;
        
      case 'vendorSuggestion':
        response = chatResponses.vendorSuggestion[Math.floor(Math.random() * chatResponses.vendorSuggestion.length)];
        
        const vendors = await Service.find().limit(3).populate('providerId', 'name isVerified');
        if (vendors.length > 0) {
          response += "\n\n⭐ Top Vendors:\n\n";
          vendors.forEach((v, i) => {
            response += `${i + 1}. ${v.serviceName}\n   By: ${v.providerId?.name} ${v.providerId?.isVerified ? '✓' : ''}\n   Price: ₹${v.price}/person\n\n`;
          });
        }
        break;
        
      case 'budgetAdvice':
        response = chatResponses.budgetAdvice[Math.floor(Math.random() * chatResponses.budgetAdvice.length)];
        break;
        
      default:
        response = "I can help you with:\n\n🎯 Finding events\n📅 Creating events\n👥 Vendor recommendations\n💰 Budget planning\n\nJust ask me anything about these topics!";
    }
    
    setTimeout(() => {
      res.json({
        message: response,
        intent,
        timestamp: new Date()
      });
    }, 800);
    
  } catch (error) {
    res.status(500).json({ message: 'AI service error', error: error.message });
  }
};

// Fake Attendance Prediction
const predictAttendance = async (req, res) => {
  try {
    const { eventId } = req.params;
    
    const event = await Event.findById(eventId);
    
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    const baseRate = 0.6;
    const categoryBoost = event.category === 'music' ? 0.15 : event.category === 'workshop' ? 0.1 : 0.05;
    const typeBoost = event.eventType === 'public' ? 0.1 : 0;
    const locationBoost = 0.05;
    
    const predictedRate = Math.min(baseRate + categoryBoost + typeBoost + locationBoost, 0.95);
    const predictedAttendees = event.maxAttendees 
      ? Math.round(event.maxAttendees * predictedRate)
      : Math.round(100 * predictedRate);
    
    const confidence = 75 + Math.floor(Math.random() * 15);
    
    res.json({
      eventId,
      predictedAttendees,
      predictedRate: Math.round(predictedRate * 100),
      confidence,
      factors: {
        category: event.category,
        eventType: event.eventType,
        timing: 'optimal',
        location: 'favorable'
      },
      recommendation: predictedRate > 0.7 
        ? "High interest expected! Consider increasing capacity."
        : "Moderate interest. Promote more on social media."
    });
    
  } catch (error) {
    res.status(500).json({ message: 'Prediction error', error: error.message });
  }
};

module.exports = {
  getAIResponse,
  predictAttendance
};
>>>>>>> ed34da906bb3faf0ea102d18bd8c416990098710
