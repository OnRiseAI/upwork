// Agent IDs per vertical — each has a specialized conversation flow
export const AGENT_MAP = {
  lawyer: "agent_4e98a56d42ed2aa6aa821814f5",
  "real-estate": "agent_58535a00d81ac43d7fb8613d8b",
  restaurant: "agent_fcb3e6dbaf8bf5456bc8504305",
  dental: "agent_04b53eed8f2b3a64b31dbc05a1",
  "vet-clinic": "agent_30309bfc50b917547222a5c737",
  "home-services": "agent_6f38941f6f866afe78bc87976e",
  "property-management": "agent_71ae36a157375472600e671b9c",
  insurance: "agent_7ec5e19151f16c68c758bd9053",
  "salon-spa": "agent_79f1e6dcdce17f549f9c298650",
  hotel: "agent_f9c3c17894de4765479bcc1a8b",
};

// Sub-vertical agent IDs (Home Services sub-sectors get their own agents)
export const SUB_AGENT_MAP = {
  hvac: "agent_54f5f7e844cf8b1f0b3a330497",
  plumbing: "agent_495a89bffe3a8b082a99b568ab",
  roofing: "agent_86c38c33df16acbca16bb87578",
  electrical: "agent_49685b634161d09141caf14842",
  landscaping: "agent_b78140ec70121dfca76302c335",
  "pest-control": "agent_6503ed17e85790212cc80abefa",
};

// Fallback agent (generic demo)
export const DEFAULT_AGENT_ID = "agent_4e98a56d42ed2aa6aa821814f5";

export function getAgentId(verticalKey, subVerticalKey) {
  if (subVerticalKey && SUB_AGENT_MAP[subVerticalKey]) {
    return SUB_AGENT_MAP[subVerticalKey];
  }
  return AGENT_MAP[verticalKey] || DEFAULT_AGENT_ID;
}

export const VERTICALS = {
  lawyer: {
    label: "Law Firm",
    icon: "scale",
    defaultName: "Summit Legal Group",
    description: "AI receptionist for law firms — qualifies leads, schedules consultations, and routes by practice area.",
    capabilities: [
      "Schedule consultations",
      "Intake new client information",
      "Route to practice areas",
      "Provide hours & office directions",
    ],
    sampleQuestions: [
      "I need help with a personal injury case",
      "Can I schedule a free consultation?",
      "What practice areas do you cover?",
      "Are you taking new clients?",
    ],
  },
  "real-estate": {
    label: "Real Estate Agency",
    icon: "building",
    defaultName: "Horizon Realty Group",
    description: "AI receptionist for real estate — books showings, captures buyer leads, and answers property questions.",
    capabilities: [
      "Schedule property showings",
      "Capture buyer & seller leads",
      "Answer listing questions",
      "Provide agent availability",
    ],
    sampleQuestions: [
      "I'd like to schedule a showing",
      "Do you have 3-bedroom homes under $400k?",
      "I want to list my property for sale",
      "Can I speak with an agent?",
    ],
  },
  restaurant: {
    label: "Restaurant",
    icon: "utensils",
    defaultName: "The Golden Fork",
    description: "AI host for restaurants — handles reservations, answers menu questions, and manages takeout orders.",
    capabilities: [
      "Make & modify reservations",
      "Answer menu & allergy questions",
      "Handle takeout inquiries",
      "Share hours & location",
    ],
    sampleQuestions: [
      "I'd like to make a reservation for 4",
      "Do you have gluten-free options?",
      "What are your hours on Sunday?",
      "Can I order takeout?",
    ],
  },
  dental: {
    label: "Dental Office",
    icon: "tooth",
    defaultName: "Bright Smile Dental",
    description: "AI receptionist for dental practices — books appointments, handles insurance questions, and manages recalls.",
    capabilities: [
      "Book & reschedule appointments",
      "Answer insurance questions",
      "Handle new patient intake",
      "Manage recall reminders",
    ],
    sampleQuestions: [
      "I need to schedule a cleaning",
      "Do you accept Delta Dental insurance?",
      "I'm a new patient, how do I get started?",
      "I have a toothache, can I come in today?",
    ],
  },
  "vet-clinic": {
    label: "Veterinary Clinic",
    icon: "paw",
    defaultName: "Companion Care Veterinary",
    description: "AI receptionist for vet clinics — schedules visits, triages urgency, and handles prescription refills.",
    capabilities: [
      "Schedule wellness & sick visits",
      "Triage urgency levels",
      "Handle prescription refills",
      "Provide after-hours guidance",
    ],
    sampleQuestions: [
      "My dog needs his annual shots",
      "My cat isn't eating, should I come in?",
      "Can I get a prescription refill?",
      "Do you see exotic pets?",
    ],
  },
  "home-services": {
    label: "Home Services",
    icon: "wrench",
    defaultName: "Reliable Home Pros",
    description: "AI receptionist for HVAC, plumbing, and electrical — books jobs, dispatches emergencies, and captures leads while techs are on-site.",
    capabilities: [
      "Book service appointments",
      "Handle emergency dispatch calls",
      "Provide quotes & availability",
      "Capture new customer details",
    ],
    sampleQuestions: [
      "My AC stopped working, can someone come today?",
      "How much do you charge for a drain cleaning?",
      "I need an electrician for a panel upgrade",
      "Do you offer free estimates?",
    ],
    subVerticals: {
      hvac: {
        label: "HVAC",
        defaultName: "Summit Air Comfort",
        description: "AI receptionist for HVAC companies — books installations, dispatches emergency repairs, and captures leads.",
        capabilities: [
          "Book AC & heating appointments",
          "Dispatch emergency repair calls",
          "Provide seasonal maintenance quotes",
          "Capture new customer details",
        ],
        sampleQuestions: [
          "My AC stopped working, can someone come today?",
          "How much does a new furnace installation cost?",
          "I need my ducts cleaned",
          "Do you offer maintenance plans?",
        ],
      },
      plumbing: {
        label: "Plumbing",
        defaultName: "FlowRight Plumbing",
        description: "AI receptionist for plumbers — handles emergency calls, books drain cleaning, and manages service requests.",
        capabilities: [
          "Handle emergency plumbing calls",
          "Book drain cleaning & repairs",
          "Provide upfront pricing estimates",
          "Schedule water heater installs",
        ],
        sampleQuestions: [
          "I have a burst pipe, can someone come now?",
          "How much do you charge for a drain cleaning?",
          "My water heater isn't working",
          "Do you offer free estimates?",
        ],
      },
      roofing: {
        label: "Roofing",
        defaultName: "Peak Roofing Co.",
        description: "AI receptionist for roofers — books inspections, handles storm damage calls, and captures repair leads.",
        capabilities: [
          "Schedule roof inspections",
          "Handle storm damage inquiries",
          "Provide repair & replacement quotes",
          "Capture insurance claim details",
        ],
        sampleQuestions: [
          "I need a roof inspection after the storm",
          "How much does a roof replacement cost?",
          "I have a leak in my ceiling",
          "Do you work with insurance companies?",
        ],
      },
      electrical: {
        label: "Electrical",
        defaultName: "BrightWire Electric",
        description: "AI receptionist for electricians — books panel upgrades, handles emergency calls, and schedules inspections.",
        capabilities: [
          "Book electrical inspections",
          "Handle emergency power outage calls",
          "Schedule panel upgrades & rewiring",
          "Provide installation quotes",
        ],
        sampleQuestions: [
          "I need an electrician for a panel upgrade",
          "My power keeps tripping, can someone come?",
          "How much does it cost to wire a new addition?",
          "Do you install EV chargers?",
        ],
      },
      landscaping: {
        label: "Landscaping",
        defaultName: "GreenScape Pros",
        description: "AI receptionist for landscapers — books lawn care, handles seasonal projects, and captures new client details.",
        capabilities: [
          "Schedule lawn care & mowing",
          "Book landscape design consultations",
          "Handle seasonal cleanup requests",
          "Provide project estimates",
        ],
        sampleQuestions: [
          "I need weekly lawn mowing service",
          "Can you design a new patio area?",
          "How much does spring cleanup cost?",
          "Do you offer snow removal in winter?",
        ],
      },
      "pest-control": {
        label: "Pest Control",
        defaultName: "ShieldGuard Pest Control",
        description: "AI receptionist for pest control — books treatments, handles urgent infestations, and schedules recurring service.",
        capabilities: [
          "Book pest treatment appointments",
          "Handle urgent infestation calls",
          "Schedule recurring prevention plans",
          "Answer pest identification questions",
        ],
        sampleQuestions: [
          "I found termites in my basement",
          "How much does a general pest treatment cost?",
          "Do you offer monthly prevention plans?",
          "I have a wasp nest near my front door",
        ],
      },
    },
  },
  "property-management": {
    label: "Property Management",
    icon: "key",
    defaultName: "Keystone Property Group",
    description: "AI receptionist for property managers — handles tenant inquiries, schedules showings, and logs maintenance requests 24/7.",
    capabilities: [
      "Schedule property showings",
      "Log maintenance requests",
      "Answer tenant inquiries",
      "Handle after-hours emergencies",
    ],
    sampleQuestions: [
      "I'd like to schedule a tour of a unit",
      "My kitchen sink is leaking",
      "When is rent due?",
      "Is the 2-bedroom on Oak Street still available?",
    ],
  },
  insurance: {
    label: "Insurance Agency",
    icon: "shield",
    defaultName: "Guardian Insurance Group",
    description: "AI receptionist for insurance agencies — captures quote requests, routes by policy type, and handles claims intake.",
    capabilities: [
      "Capture quote requests",
      "Route by policy type",
      "Handle claims intake calls",
      "Answer coverage questions",
    ],
    sampleQuestions: [
      "I need a quote for auto insurance",
      "I want to file a claim",
      "Can you bundle home and auto?",
      "What does my policy cover?",
    ],
  },
  "salon-spa": {
    label: "Salon & Spa",
    icon: "scissors",
    defaultName: "Luxe Beauty Studio",
    description: "AI receptionist for salons and spas — books appointments, answers service questions, and manages cancellations.",
    capabilities: [
      "Book & reschedule appointments",
      "Answer service & pricing questions",
      "Manage cancellations & waitlist",
      "Recommend services to new clients",
    ],
    sampleQuestions: [
      "I'd like to book a haircut for Saturday",
      "Do you offer balayage?",
      "How much is a deep tissue massage?",
      "I need to cancel my appointment tomorrow",
    ],
  },
  hotel: {
    label: "Hotel & Hospitality",
    icon: "bed",
    defaultName: "The Grand Meridian Hotel",
    description: "AI receptionist for hotels — handles reservations, answers guest questions, and manages room inquiries around the clock.",
    capabilities: [
      "Book & modify reservations",
      "Answer room & amenity questions",
      "Handle group & event inquiries",
      "Provide directions & local info",
    ],
    sampleQuestions: [
      "Do you have rooms available this weekend?",
      "What's the rate for a king suite?",
      "Is there a pool and gym?",
      "I need to modify my reservation",
    ],
  },
};

export const VERTICAL_KEYS = Object.keys(VERTICALS);

export function getVertical(key) {
  return VERTICALS[key] || null;
}
