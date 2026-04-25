export const eventTemplates = [
  {
    id: 'music-concert',
    name: 'Music Concert',
    icon: '🎵',
    category: 'music',
    description: 'Live music performance event',
    template: {
      title: '[Artist Name] Live Concert',
      description: 'Join us for an unforgettable evening of live music featuring [Artist Name]. Experience [genre] music at its finest with special guest performances.',
      category: 'music',
      eventType: 'public',
      maxAttendees: 500,
      suggestedBudget: 300000,
      requiredVendors: ['Sound System', 'Lighting', 'Security', 'Catering']
    }
  },
  {
    id: 'tech-workshop',
    name: 'Tech Workshop',
    icon: '💻',
    category: 'workshop',
    description: 'Educational technology workshop',
    template: {
      title: '[Topic] Workshop',
      description: 'Learn [skill/topic] in this hands-on workshop. Perfect for beginners and intermediate learners. Includes practical exercises and certificate of completion.',
      category: 'workshop',
      eventType: 'public',
      maxAttendees: 50,
      suggestedBudget: 25000,
      requiredVendors: ['Training Venue', 'Refreshments', 'Materials']
    }
  },
  {
    id: 'business-conference',
    name: 'Business Conference',
    icon: '💼',
    category: 'conference',
    description: 'Professional business conference',
    template: {
      title: '[Industry] Conference 2026',
      description: 'Annual conference bringing together industry leaders, innovators, and professionals. Features keynote speeches, panel discussions, and networking opportunities.',
      category: 'conference',
      eventType: 'public',
      maxAttendees: 200,
      suggestedBudget: 500000,
      requiredVendors: ['Conference Hall', 'AV Equipment', 'Catering', 'Registration Desk']
    }
  },
  {
    id: 'sports-tournament',
    name: 'Sports Tournament',
    icon: '⚽',
    category: 'sports',
    description: 'Competitive sports event',
    template: {
      title: '[Sport] Tournament',
      description: 'Competitive [sport] tournament for [age group/skill level]. Teams compete for prizes and trophies. Open registration for participants.',
      category: 'sports',
      eventType: 'public',
      maxAttendees: 100,
      suggestedBudget: 150000,
      requiredVendors: ['Sports Venue', 'Refreshments', 'First Aid', 'Photography']
    }
  },
  {
    id: 'cultural-festival',
    name: 'Cultural Festival',
    icon: '🎭',
    category: 'festival',
    description: 'Multi-day cultural celebration',
    template: {
      title: '[Culture/Theme] Festival',
      description: 'Celebrate [culture/theme] with music, dance, food, and art. A family-friendly festival featuring performances, exhibitions, and interactive experiences.',
      category: 'festival',
      eventType: 'public',
      maxAttendees: 1000,
      suggestedBudget: 800000,
      requiredVendors: ['Open Ground', 'Stage Setup', 'Food Stalls', 'Security', 'Entertainment']
    }
  },
  {
    id: 'networking-social',
    name: 'Networking Event',
    icon: '🤝',
    category: 'social',
    description: 'Professional networking mixer',
    template: {
      title: '[Industry] Networking Mixer',
      description: 'Connect with professionals in [industry]. Casual networking event with refreshments. Great opportunity to expand your professional network.',
      category: 'social',
      eventType: 'public',
      maxAttendees: 75,
      suggestedBudget: 50000,
      requiredVendors: ['Lounge Venue', 'Catering', 'Name Tags']
    }
  }
];