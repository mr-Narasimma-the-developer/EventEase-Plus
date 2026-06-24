const Event = require('../models/Event');
const Service = require('../models/Service');

// ─── INTENT DETECTION ─────────────────────────────────────────────
const detectIntent = (message) => {
  const msg = message.toLowerCase();

  if (/hello|hi|hey|greet|start|help me/i.test(msg))
    return 'greeting';

  if (/create.*event|how.*create|make.*event|organize|new event/i.test(msg))
    return 'create_event';

  if (/find.*event|search.*event|show.*event|upcoming|events|what.*event|discover/i.test(msg))
    return 'find_events';

  if (/vendor|photographer|caterer|catering|dj|decorator|service|provider|suggest.*vendor|need.*vendor|find.*vendor/i.test(msg))
    return 'vendor_suggestion';

  if (/budget|cost|price|expensive|how much|estimate/i.test(msg))
    return 'budget_advice';

  if (/plan|organize|how to|guide|help.*plan|tips|checklist/i.test(msg))
    return 'event_planning';

  return 'general';
};

// ─── FETCH PUBLIC EVENTS (FIXED QUERY) ────────────────────────────
const fetchPublicEvents = async () => {
  // CRITICAL FIX: Don't filter by privacy='public' strictly.
  // Exclude only explicitly private events — handles both field names.
  return await Event.find({
    $and: [
      { privacy:   { $ne: 'private' } },
      { eventType: { $ne: 'private' } }
    ]
  })
    .populate('organizerId', 'name')
    .sort({ eventDate: 1 })
    .limit(5);
};

// ─── AI CHATBOT CONTROLLER ────────────────────────────────────────
const aiChatbot = async (req, res) => {
  try {
    const { message } = req.body;

    if (!message) {
      return res.status(400).json({ message: 'Message is required' });
    }

    console.log('🤖 Chatbot received:', message);

    const intent = detectIntent(message);
    console.log('🎯 Intent detected:', intent);

    let response = '';

    switch (intent) {

      // ── GREETING ──────────────────────────────────────────────────
      case 'greeting':
        response = `Hello! 👋 Welcome to EventEase+. I'm your AI assistant here to help you with:

- 🎉 Creating and managing events
- 🤝 Finding the perfect verified vendors
- 💰 Budget planning and cost estimation
- 📅 Discovering upcoming events nearby

How can I assist you today?`;
        break;

      // ── CREATE EVENT ──────────────────────────────────────────────
      case 'create_event':
        response = `I'd be happy to help you create an event! 🎉

Here's what you need to do:
1️⃣ Click "+ Create Event" in the top navbar
2️⃣ Fill in: Title, Description, Date & Time, Venue, Location
3️⃣ Choose a Category (Music, Workshop, Conference, Festival...)
4️⃣ Upload a poster image (optional but recommended)
5️⃣ Set Privacy (Public/Private) and Max Capacity
6️⃣ Click Submit — your event goes live instantly!

💡 Tip: Use our Event Templates for a quick start!

Would you like tips on promoting your event after creating it?`;
        break;

      // ── FIND EVENTS ───────────────────────────────────────────────
      case 'find_events':
        try {
          const events = await fetchPublicEvents();

          console.log(`🔍 Chatbot found ${events.length} events`);

          if (events.length === 0) {
            response = `I checked but there are no public events listed right now. 📭

Here's what you can do:
- Check back soon — new events are added regularly!
- Use the Dashboard filters to search by category or location
- Or create your own event and invite others 🎉`;
          } else {
            response = `Here are the upcoming events I found for you! 🎉\n\n`;

            events.forEach((event, i) => {
              const date = new Date(event.eventDate).toLocaleDateString('en-IN', {
                day: 'numeric', month: 'short', year: 'numeric'
              });
              response += `${i + 1}. 🎭 **${event.title}**\n`;
              response += `   📅 ${date}\n`;
              response += `   📍 ${event.venue ? event.venue + ', ' : ''}${event.location}\n`;
              response += `   🏷️ ${event.category}\n`;
              if (event.organizerId?.name) {
                response += `   👤 By: ${event.organizerId.name}\n`;
              }
              response += `\n`;
            });

            response += `👉 Visit the Dashboard to see all events and register!`;
          }
        } catch (err) {
          console.error('❌ Chatbot event fetch error:', err);
          response = `I had trouble fetching events right now. Please visit the Dashboard directly to see all upcoming events! 📅`;
        }
        break;

      // ── VENDOR SUGGESTION ─────────────────────────────────────────
      case 'vendor_suggestion':
        try {
          const services = await Service.find({ availability: true })
            .populate('providerId', 'name')
            .sort({ rating: -1, totalBookings: -1 })
            .limit(5);

          if (services.length === 0) {
            response = `No vendor services are listed yet. 😔

Check out the **Marketplace** page to browse available services, or come back after vendors join the platform!`;
          } else {
            response = `Here are some top vendors I recommend for you! 🤝\n\n`;

            services.forEach((svc, i) => {
              response += `${i + 1}. 🏢 **${svc.serviceName}**\n`;
              response += `   👤 Provider: ${svc.providerId?.name || 'N/A'}\n`;
              response += `   💼 Category: ${svc.category}\n`;
              response += `   💰 Price: ₹${svc.price?.toLocaleString()}\n`;
              response += `   📍 Location: ${svc.location}\n`;
              if (svc.rating > 0) {
                response += `   ⭐ Rating: ${svc.rating}/5\n`;
              }
              response += `\n`;
            });

            response += `👉 Visit the **Marketplace** to compare vendors, check trust scores & book!`;
          }
        } catch (err) {
          console.error('❌ Chatbot vendor fetch error:', err);
          response = `Check out our **Marketplace** for a wide selection of verified vendors — photographers, caterers, decorators, DJs, and more! 🎯`;
        }
        break;

      // ── BUDGET ADVICE ─────────────────────────────────────────────
      case 'budget_advice':
        response = `Let me help you plan your event budget! 💰

**General Budget Breakdown:**
- 🏛️ Venue: 25-30%
- 🍽️ Catering: 30-35%
- 🎵 Entertainment: 15-20%
- 🎨 Decoration: 10-15%
- 📸 Photography & Misc: 10-15%

**Money-Saving Tips:**
1. ✅ Book vendors early (saves 10-20%)
2. ✅ Use our Vendor Comparison tool to get best prices
3. ✅ Set budget before contacting vendors
4. ✅ Prioritize must-haves over nice-to-haves
5. ✅ Check verified vendors — they have transparent pricing

💡 Use our **Budget Estimator Tool** (in the Organizer menu) for a detailed breakdown based on your event type, guest count, and location!

What type of event are you planning? I can give more specific advice!`;
        break;

      // ── EVENT PLANNING GUIDE ──────────────────────────────────────
      case 'event_planning':
        response = `Here's your complete event planning guide! 📋

1️⃣ **Define Your Event** (Week 1)
   • Set objectives & target audience
   • Fix budget and date
   • Choose venue

2️⃣ **Create on EventEase+** (Week 2)
   • Create event with all details
   • Upload poster
   • Set capacity & privacy

3️⃣ **Book Vendors** (Week 2-3)
   • Browse Marketplace
   • Use AI Vendor Recommendations
   • Compare using our comparison tool
   • Book early!

4️⃣ **Promote** (Ongoing)
   • Share on social media (our sharing tool)
   • Send email invites
   • Track registrations on dashboard

5️⃣ **Day of Event**
   • Use QR code for attendance scanning
   • Monitor real-time attendee count
   • Enjoy your event! 🎉

6️⃣ **Post-Event**
   • View analytics on dashboard
   • Export attendance CSV
   • Collect vendor reviews

Need help with any specific step?`;
        break;

      // ── GENERAL ───────────────────────────────────────────────────
      default:
        response = `I'm here to help with your event planning! 🤖

Here's what I can do:

🎉 **Events** — Find upcoming events or help you create one
🤝 **Vendors** — Suggest vendors for your event needs
💰 **Budget** — Estimate costs and allocation tips
📋 **Planning** — Step-by-step event planning guide

Just ask me something like:
- "Show me upcoming events"
- "I need a catering vendor"
- "Help me plan my budget"
- "How do I create an event?"

What would you like to know?`;
    }

    return res.json({
      message: response,
      intent,
      timestamp: new Date()
    });

  } catch (error) {
    console.error('❌ AI Chatbot error:', error);
    return res.status(500).json({
      message: 'Sorry, I encountered an error. Please try again.',
      error: error.message
    });
  }
};

module.exports = { aiChatbot };