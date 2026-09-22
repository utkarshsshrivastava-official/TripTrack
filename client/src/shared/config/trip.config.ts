import { TripSegment, SightseeingSpot, CabAgency, HillCabInspectionItem, RoadsideStop, SacredRitualSlot, DayOutfitGuidance, DayCashUpiGuidance, TravelPhrase } from '../types';

export const TRIP_SEED_SEGMENTS: TripSegment[] = [
  // Day 1: Sep 24
  {
    id: "seg-1",
    title: "Overnight Train Transit to Capital",
    origin: "Durg Junction (DURG)",
    destination: "New Delhi Railway Station (NDLS)",
    departureTime: "2026-09-24T16:30:00+05:30",
    arrivalTime: "2026-09-25T10:40:00+05:30",
    mode: "TRAIN",
    status: "UPCOMING",
    logistics: {
      serviceName: "12441 / BSP NDLS RAJ EX (2AC)",
      identifier: "PNR: 6709136735 (Coach A2: 19, 20, 21, 22)",
      pickupLocation: "Durg Junction Platform 1",
      driverPhone: "139 (Railway Helpline)"
    },
    elevationMeters: 216,
    isHighAltitude: false,
    checkpoints: [
      { id: "cp-1-1", name: "Boarding Durg Jn (PF 1)", estimatedTime: "16:30", done: false, elderComfortNote: "Coach A2: Sanjay Ji (19-LB), Rajnish Ji (21-LB), Shreyas (20-UB), Utkarsh (22-UB)" },
      { id: "cp-1-2", name: "Nagpur Halt & Dinner Meds", estimatedTime: "19:40", done: false, elderComfortNote: "Pantry Dinner: Jain meal for Rajnish Ji, Veg for all + evening BP medicines" },
      { id: "cp-1-3", name: "Bhopal Night Sleep Halt", estimatedTime: "00:05", done: false, elderComfortNote: "Restful sleep across Central India" },
      { id: "cp-1-4", name: "Agra Cantt Morning Tea", estimatedTime: "07:15", done: false, elderComfortNote: "Morning refreshments in coach cabin" },
      { id: "cp-1-5", name: "Arrival at NDLS (PF 1)", estimatedTime: "10:40", done: false, elderComfortNote: "1362 KM completed. Coolie assistance towards Ajmeri Gate Cab Bay" }
    ]
  },

  // Day 2: Sep 25
  {
    id: "seg-2",
    title: "Plains Expressway Transfer & Haridwar Agency Booking",
    origin: "New Delhi (NDLS)",
    destination: "Haridwar (Devpura / Station Area)",
    departureTime: "2026-09-25T11:45:00+05:30",
    arrivalTime: "2026-09-25T17:00:00+05:30",
    mode: "CAB_PLAINS",
    status: "UPCOMING",
    logistics: {
      serviceName: "Savaari / MMT Outstation (Ertiga / Crysta)",
      identifier: "Assigned ~2h prior to arrival",
      pickupLocation: "NDLS Ajmeri Gate Cab Bay",
      driverPhone: "Pending assignment"
    },
    elevationMeters: 314,
    isHighAltitude: false,
    checkpoints: [
      { id: "cp-2-1", name: "Cab Meetup at NDLS Ajmeri Gate", estimatedTime: "11:45", done: false, elderComfortNote: "Fathers seated in comfortable middle row captain seats" },
      { id: "cp-2-2", name: "Delhi-Meerut Expressway Transit", estimatedTime: "13:00", done: false },
      { id: "cp-2-3", name: "Lunch Halt (Namaste Midway / Cheetal)", estimatedTime: "14:15", done: false, elderComfortNote: "Clean restrooms & warm light vegetarian meal" },
      { id: "cp-2-4", name: "Haridwar Hotel Check-in", estimatedTime: "17:00", done: false, elderComfortNote: "Fathers rest in hotel room; unpack freshen up" },
      { id: "cp-2-5", name: "Book Badrinath Round-Trip Cab", estimatedTime: "18:30", done: false, elderComfortNote: "Sons finalize dedicated Innova Crysta / Ertiga with trusted local Haridwar travel desk" }
    ]
  },

  // Day 3: Sep 26
  {
    id: "seg-3",
    title: "The Mountain Ascent (NH-7 Highway)",
    origin: "Haridwar",
    destination: "Joshimath / Badrinath",
    departureTime: "2026-09-26T05:30:00+05:30",
    arrivalTime: "2026-09-26T17:30:00+05:30",
    mode: "CAB_HILLS",
    status: "UPCOMING",
    logistics: {
      serviceName: "Dedicated Hill Agency (Innova Crysta / Ertiga)",
      identifier: "UK Commercial Yellow Plate",
      pickupLocation: "Haridwar Hotel Porch",
      driverPhone: "Pre-arranged in Haridwar"
    },
    elevationMeters: 1890,
    isHighAltitude: false,
    checkpoints: [
      { id: "cp-3-1", name: "Early Departure from Haridwar (5:30 AM)", estimatedTime: "05:30", done: false, elderComfortNote: "Motion sickness tablet 30 min before mountain curves" },
      { id: "cp-3-2", name: "Devprayag Sangam Halt", estimatedTime: "08:15", done: false, elderComfortNote: "Highway viewing deck; stretch legs; avoid steep stone steps" },
      { id: "cp-3-3", name: "Srinagar Garhwal Breakfast Halt", estimatedTime: "09:45", done: false, elderComfortNote: "Warm ginger tea & light breakfast" },
      { id: "cp-3-4", name: "Rudraprayag Sangam Drive-by", estimatedTime: "11:30", done: false },
      { id: "cp-3-5", name: "Karnaprayag / Pipalkoti Lunch", estimatedTime: "13:30", done: false, elderComfortNote: "Hydration check for both fathers" },
      { id: "cp-3-6", name: "Arrival at Joshimath / Badrinath Base", estimatedTime: "17:30", done: false, elderComfortNote: "Reach safely before nightfall; unpack thermals; warm water bath; early sleep" }
    ]
  },

  // Day 4: Sep 27
  {
    id: "seg-4",
    title: "Badrinath Dham Darshan, Brahma Kapal & Mana Village",
    origin: "Joshimath / Badrinath Base",
    destination: "Badrinath Dham & Mana Village",
    departureTime: "2026-09-27T05:30:00+05:30",
    arrivalTime: "2026-09-27T18:00:00+05:30",
    mode: "CAB_HILLS",
    status: "UPCOMING",
    logistics: {
      serviceName: "Dedicated Mountain Cab",
      identifier: "UK-08 / UK-14 Hill Pass",
      pickupLocation: "Hotel Base",
      driverPhone: "Hill Driver"
    },
    elevationMeters: 3133,
    isHighAltitude: true,
    checkpoints: [
      { id: "cp-4-1", name: "Morning Drive to Badrinath Temple", estimatedTime: "05:30", done: false, elderComfortNote: "Fathers dressed in layered thermals, monkey caps & windcheaters" },
      { id: "cp-4-2", name: "Brahma Kapal Pind Daan & Tarpan", estimatedTime: "07:30", done: false, elderComfortNote: "Sit on insulated wool mats; perform Pitru Paksha rituals unhurriedly" },
      { id: "cp-4-3", name: "Badrinath Temple Special Darshan", estimatedTime: "10:30", done: false, elderComfortNote: "Use Senior Citizen priority queue or palanquin/dandi if fatigued" },
      { id: "cp-4-4", name: "Lunch & Rest at Badrinath", estimatedTime: "12:30", done: false, elderComfortNote: "Warm satvik meal, hot tea and restful pause" },
      { id: "cp-4-5", name: "Mana Village Excursion (Vyas Gufa & Bheem Pul)", estimatedTime: "14:00", done: false, elderComfortNote: "Paved trail, India's last tea stall; optional based on fathers' stamina" },
      { id: "cp-4-6", name: "Night Stay at Badrinath or Joshimath", estimatedTime: "18:00", done: false, elderComfortNote: "Check O2 saturation on pulse oximeter; comfortable night sleep" }
    ]
  },

  // Day 5: Sep 28
  {
    id: "seg-5",
    title: "Himalayan Descent via Panch Prayags & Dhari Devi",
    origin: "Joshimath / Badrinath",
    destination: "Haridwar (Devpura)",
    departureTime: "2026-09-28T07:00:00+05:30",
    arrivalTime: "2026-09-28T17:30:00+05:30",
    mode: "CAB_HILLS",
    status: "UPCOMING",
    logistics: {
      serviceName: "Dedicated Mountain Cab",
      identifier: "UK Commercial Cab",
      pickupLocation: "Hotel Porch",
      driverPhone: "Hill Driver"
    },
    elevationMeters: 314,
    isHighAltitude: false,
    checkpoints: [
      { id: "cp-5-1", name: "Morning Descent Departure", estimatedTime: "07:00", done: false, elderComfortNote: "Gentle downhill speed; smooth pace" },
      { id: "cp-5-2", name: "Nandaprayag & Karnaprayag Halts", estimatedTime: "09:30", done: false, elderComfortNote: "Brief roadside views of river confluences" },
      { id: "cp-5-3", name: "Rudraprayag Sangam Halt", estimatedTime: "11:30", done: false, elderComfortNote: "Alaknanda & Mandakini confluence viewpoint" },
      { id: "cp-5-4", name: "Maa Dhari Devi Temple Darshan", estimatedTime: "13:00", done: false, elderComfortNote: "Protector deity of Char Dham. Elevated suspension walkway makes it very easy for elders!" },
      { id: "cp-5-5", name: "Lunch Halt near Srinagar / Byasi", estimatedTime: "14:15", done: false, elderComfortNote: "Comfortable meal halt & hydration" },
      { id: "cp-5-6", name: "Arrival at Haridwar Hotel Check-in", estimatedTime: "17:30", done: false, elderComfortNote: "Oxygen levels normalize completely; hot bath & relaxing sleep" }
    ]
  },

  // Day 6: Sep 29
  {
    id: "seg-6",
    title: "Haridwar Full Day Sacred Sightseeing",
    origin: "Haridwar Hotel",
    destination: "Haridwar Sightseeing Circuit",
    departureTime: "2026-09-29T08:30:00+05:30",
    arrivalTime: "2026-09-29T20:30:00+05:30",
    mode: "CAB_PLAINS",
    status: "UPCOMING",
    logistics: {
      serviceName: "Local E-Rickshaw / Hotel Cab",
      identifier: "City Tour",
      pickupLocation: "Haridwar Hotel",
      driverPhone: "Local Desk"
    },
    elevationMeters: 314,
    isHighAltitude: false,
    checkpoints: [
      { id: "cp-6-1", name: "Mansa Devi Temple via Ropeway", estimatedTime: "09:00", done: false, elderComfortNote: "Udan Khatola cable car avoids 1.5km climb; senior priority boarding" },
      { id: "cp-6-2", name: "Maya Devi Temple & Shanti Kunj", estimatedTime: "11:30", done: false, elderComfortNote: "Flat courtyard, peaceful serene ashram gardens" },
      { id: "cp-6-3", name: "Afternoon Rest & Satvik Lunch", estimatedTime: "13:30", done: false, elderComfortNote: "Crucial afternoon recovery nap for fathers before evening crowds" },
      { id: "cp-6-4", name: "Chandi Devi Temple via Ropeway (Optional)", estimatedTime: "16:00", done: false, elderComfortNote: "Scenic cable car over Neel Parvat" },
      { id: "cp-6-5", name: "Har Ki Pauri Ganga Sandhya Aarti", estimatedTime: "17:45", done: false, elderComfortNote: "Arrive by 17:45 for comfortable seated chair spots at Malviya Dweep; sublime Aarti experience" },
      { id: "cp-6-6", name: "Bara Bazaar Sweets & Pooja Samagri", estimatedTime: "19:30", done: false, elderComfortNote: "Gentle flat stroll for famous Mohan Ji pedas & ayurvedic oils" }
    ]
  },

  // Day 7: Sep 30
  {
    id: "seg-7",
    title: "Rishikesh Sacred Exploration & Ganga Ghats",
    origin: "Haridwar Hotel",
    destination: "Rishikesh (Ram Jhula / Parmarth)",
    departureTime: "2026-09-30T09:00:00+05:30",
    arrivalTime: "2026-09-30T20:30:00+05:30",
    mode: "CAB_PLAINS",
    status: "UPCOMING",
    logistics: {
      serviceName: "Outstation Day Cab (Innova / Ertiga)",
      identifier: "Haridwar -> Rishikesh Day Tour",
      pickupLocation: "Haridwar Hotel Porch",
      driverPhone: "Pre-assigned"
    },
    elevationMeters: 372,
    isHighAltitude: false,
    checkpoints: [
      { id: "cp-7-1", name: "Morning Drive to Rishikesh (35 min)", estimatedTime: "09:00", done: false, elderComfortNote: "Smooth highway drive to Ram Jhula parking" },
      { id: "cp-7-2", name: "Janki Setu & Ram Jhula Walk", estimatedTime: "10:15", done: false, elderComfortNote: "Janki Setu has dedicated electric cart path for zero walking strain" },
      { id: "cp-7-3", name: "Beatles Ashram or Haridwar Spillover", estimatedTime: "11:45", done: false, elderComfortNote: "Shaded peaceful forest walk; or finish remaining Haridwar spots if delayed" },
      { id: "cp-7-4", name: "Lunch at Chotiwala / Ganga View Cafe", estimatedTime: "13:30", done: false, elderComfortNote: "Delightful vegetarian North Indian thali by the river" },
      { id: "cp-7-5", name: "Parmarth Niketan Ashram & Ganga Aarti", estimatedTime: "17:30", done: false, elderComfortNote: "World-renowned Ganga Aarti with Pujya Swamiji's satsang; seated ghat view" },
      { id: "cp-7-6", name: "Return to Haridwar / Rishikesh Hotel", estimatedTime: "19:45", done: false, elderComfortNote: "Relaxing evening dinner & packing review" }
    ]
  },

  // Day 8: Oct 01
  {
    id: "seg-8",
    title: "Flexible Buffer Day (Mussoorie / Dehradun / Relax)",
    origin: "Haridwar / Rishikesh",
    destination: "Mussoorie or Dehradun -> Airport Base Hotel",
    departureTime: "2026-10-01T09:30:00+05:30",
    arrivalTime: "2026-10-01T19:30:00+05:30",
    mode: "CAB_PLAINS",
    status: "UPCOMING",
    logistics: {
      serviceName: "Dedicated Day Cab (Ertiga / Innova)",
      identifier: "Buffer Tour & Airport Hotel Drop",
      pickupLocation: "Hotel Porch",
      driverPhone: "Pre-assigned"
    },
    elevationMeters: 450,
    isHighAltitude: false,
    checkpoints: [
      { id: "cp-8-1", name: "Decision Point: Mussoorie vs Dehradun vs Relax", estimatedTime: "09:30", done: false, elderComfortNote: "Select based on fathers' energy levels: Mussoorie hill excursion OR Dehradun Robber's cave OR peaceful riverside stay" },
      { id: "cp-8-2", name: "Option A: Mussoorie Kempty Falls & Mall Road", estimatedTime: "11:30", done: false, elderComfortNote: "Cable car at Kempty Falls avoids stairs; Gun Hill ropeway for Doon valley view" },
      { id: "cp-8-3", name: "Option B: Dehradun Sahastradhara & Robber's Cave", estimatedTime: "11:30", done: false, elderComfortNote: "Gentle nature walk, sulphur springs ropeway, cool shade" },
      { id: "cp-8-4", name: "Option C: Relaxed Riverside & Souvenir Shopping", estimatedTime: "11:30", done: false, elderComfortNote: "No transit rush; peaceful ayurvedic massage or riverside chai" },
      { id: "cp-8-5", name: "Check-in at Hotel Near Jolly Grant Airport (DED)", estimatedTime: "18:00", done: false, elderComfortNote: "Stay within 15-20 min of airport; early sleep for next day's 13:15 flight" }
    ]
  },

  // Day 9: Oct 02
  {
    id: "seg-9",
    title: "Flight Return Journey Home (IndiGo)",
    origin: "Dehradun Jolly Grant Airport (DED)",
    destination: "Raipur Airport (RPR) -> Durg",
    departureTime: "2026-10-02T13:15:00+05:30",
    arrivalTime: "2026-10-02T18:10:00+05:30",
    mode: "FLIGHT",
    status: "UPCOMING",
    logistics: {
      serviceName: "IndiGo 6E 2476 / 6E 734 (A320)",
      identifier: "PNRs: VGLHWK & L8CM7C (Rows 27 & 28)",
      pickupLocation: "DED Airport Terminal Departure Bay",
      driverPhone: "+91 9910383838 (IndiGo Helpline)"
    },
    elevationMeters: 298,
    isHighAltitude: false,
    checkpoints: [
      { id: "cp-9-1", name: "DED Bag Drop & Check-in", estimatedTime: "12:15", done: false, elderComfortNote: "Bag drop closes at 12:15. Senior citizen priority for Sanjay & Rajnish Ji. Bags checked through to Raipur." },
      { id: "cp-9-2", name: "Leg 1: 6E 2476 Takeoff (DED->DEL)", estimatedTime: "13:15", done: false, elderComfortNote: "Airbus A320. Row 27 (Fathers: 27F-Win, 27E-Mid) & Row 28 (Sons: 28F-Win, 28E-Mid)." },
      { id: "cp-9-3", name: "Delhi Transit: T2 to T1 Shuttle", estimatedTime: "14:10", done: false, elderComfortNote: "130m layover. Deplane at Terminal 2, take airport shuttle coach to Terminal 1 for Leg 2 boarding." },
      { id: "cp-9-4", name: "Leg 2: 6E 734 Takeoff (DEL->RPR)", estimatedTime: "16:20", done: false, elderComfortNote: "Boarding from T1. Row 27 (Fathers: 27A-Win, 27B-Mid) & Row 28 (Sons: 28A-Win, 28B-Mid)." },
      { id: "cp-9-5", name: "Raipur Landing & Home Cab to Durg", estimatedTime: "18:10", done: false, elderComfortNote: "18:10 touchdown at Swami Vivekananda Airport. Smooth luggage pickup and cab drive home to Durg!" }
    ]
  }
];

// Rich Curated Sightseeing Recommendations Pool
export const SIGHTSEEING_RECOMMENDATIONS_POOL: SightseeingSpot[] = [
  // --- HARIDWAR ---
  {
    id: "spot-hw-1",
    name: "Har Ki Pauri Sandhya Ganga Aarti",
    hindiName: "हर की पौड़ी संध्या गंगा आरती",
    location: "HARIDWAR",
    category: "GHAT_AARTI",
    elderDifficulty: "EASY",
    elderComfortTip: "Reach Malviya Dweep by 17:45 for reserved chair seating; avoids standing in crowds.",
    recommendedTimeSlot: "EVENING",
    durationMinutes: 90,
    description: "The world-famous Ganga Aarti with thousands of floating diyas, chanting priests, and ringing temple bells.",
    highlights: ["VIP seated ghat viewing", "Floating diya pooja", "Wheelchair accessible via bridge ramp"],
    hasRopewayOrLift: false
  },
  {
    id: "spot-hw-2",
    name: "Mansa Devi Temple (Bilwa Parvat)",
    hindiName: "मनसा देवी मंदिर (रोपवे)",
    location: "HARIDWAR",
    category: "ROPEWAY",
    elderDifficulty: "EASY",
    elderComfortTip: "Udan Khatola cable car takes you straight to the top, bypassing 1.5km steep climb.",
    recommendedTimeSlot: "MORNING",
    durationMinutes: 75,
    description: "Wish-fulfilling Goddess temple atop Bilwa Parvat with panoramic view of Haridwar and holy Ganges.",
    highlights: ["Smooth cable car ride", "Senior citizen express queue", "Scenic mountain views"],
    hasRopewayOrLift: true
  },
  {
    id: "spot-hw-3",
    name: "Chandi Devi Temple (Neel Parvat)",
    hindiName: "चंडी देवी मंदिर (रोपवे)",
    location: "HARIDWAR",
    category: "ROPEWAY",
    elderDifficulty: "EASY",
    elderComfortTip: "Modern ropeway ride across the forest valley; minimal walking needed.",
    recommendedTimeSlot: "AFTERNOON",
    durationMinutes: 80,
    description: "Ancient Siddhapeeth established by Adi Shankaracharya atop Neel Parvat facing Mansa Devi.",
    highlights: ["Valley cable car experience", "Ancient Shakti temple", "Prasad shops"],
    hasRopewayOrLift: true
  },
  {
    id: "spot-hw-4",
    name: "Maya Devi Temple",
    hindiName: "माया देवी मंदिर (सिद्धपीठ)",
    location: "HARIDWAR",
    category: "TEMPLE",
    elderDifficulty: "EASY",
    elderComfortTip: "Completely flat marble courtyard; no steps or climbing required.",
    recommendedTimeSlot: "MORNING",
    durationMinutes: 40,
    description: "One of the primordial Siddhapeeths of Haridwar (the heart of Sati fell here). Presiding deity of Mayapuri.",
    highlights: ["Siddhapeeth darshan", "Zero stair climbing", "Peaceful inner sanctum"],
    hasRopewayOrLift: false
  },
  {
    id: "spot-hw-5",
    name: "Moti Bazaar & Bara Bazaar",
    hindiName: "मोती बाज़ार एवं बड़ा बाज़ार",
    location: "HARIDWAR",
    category: "SHOPPING",
    elderDifficulty: "MODERATE",
    elderComfortTip: "Flat walking street; E-rickshaw can drop right at the market entrance.",
    recommendedTimeSlot: "EVENING",
    durationMinutes: 60,
    description: "Historic market lanes famous for original Haridwar pedas (Mohan Ji), Ayurvedic remedies, and brass pooja items.",
    highlights: ["Authentic sweets & pedas", "Ayurvedic medicines & oils", "Handcrafted pooja samagri"],
    hasRopewayOrLift: false
  },
  {
    id: "spot-hw-6",
    name: "Bharat Mata Mandir",
    hindiName: "भारत माता मंदिर (लिफ्ट युक्त)",
    location: "HARIDWAR",
    category: "HERITAGE",
    elderDifficulty: "EASY",
    elderComfortTip: "Equipped with a high-speed elevator serving all 8 floors; ideal for seniors.",
    recommendedTimeSlot: "AFTERNOON",
    durationMinutes: 50,
    description: "Unique 8-story architectural tribute dedicated to Indian heritage, freedom fighters, and deities.",
    highlights: ["Elevator accessible to all floors", "Panoramic top floor view", "Airy & comfortable"],
    hasRopewayOrLift: true
  },
  {
    id: "spot-hw-7",
    name: "Shanti Kunj Ashram & Gardens",
    hindiName: "शांति कुंज आश्रम एवं औषधीय उद्यान",
    location: "HARIDWAR",
    category: "HERITAGE",
    elderDifficulty: "EASY",
    elderComfortTip: "Flat, paved garden walkways with abundant resting benches; peaceful atmosphere.",
    recommendedTimeSlot: "MORNING",
    durationMinutes: 60,
    description: "Spiritual headquarters of All World Gayatri Pariwar featuring Yagya Shala, medicinal herbs, and pure satvik energy.",
    highlights: ["Wheelchair friendly pathways", "Ayurvedic medicinal garden", "Serene spiritual atmosphere"],
    hasRopewayOrLift: false
  },

  // --- RISHIKESH ---
  {
    id: "spot-rk-1",
    name: "Parmarth Niketan Ganga Aarti",
    hindiName: "परमार्थ निकेतन संध्या आरती",
    location: "RISHIKESH",
    category: "GHAT_AARTI",
    elderDifficulty: "EASY",
    elderComfortTip: "Wide seated marble steps directly facing the Lord Shiva statue on the Ganga.",
    recommendedTimeSlot: "EVENING",
    durationMinutes: 90,
    description: "Soul-stirring evening Ganga Aarti with Vedic chanting, havan fire, and serene bhajan singing.",
    highlights: ["Seated marble amphitheater", "Lord Shiva idol on river", "Soothing bhajans"],
    hasRopewayOrLift: false
  },
  {
    id: "spot-rk-2",
    name: "Janki Setu & Ram Jhula Walk",
    hindiName: "जानकी सेतु एवं राम झूला",
    location: "RISHIKESH",
    category: "NATURE_VIEW",
    elderDifficulty: "EASY",
    elderComfortTip: "Janki Setu has dedicated electric cart lanes; seniors can ride across with zero effort.",
    recommendedTimeSlot: "MORNING",
    durationMinutes: 45,
    description: "Modern suspension bridge with glass viewing points and battery cart lanes connecting Swargashram and Muni Ki Reti.",
    highlights: ["Battery golf-cart ride available", "Stunning Ganga vistas", "No swaying like older bridges"],
    hasRopewayOrLift: false
  },
  {
    id: "spot-rk-3",
    name: "Triveni Ghat Maha Aarti",
    hindiName: "त्रिवेणी घाट महा आरती",
    location: "RISHIKESH",
    category: "GHAT_AARTI",
    elderDifficulty: "EASY",
    elderComfortTip: "Electric rickshaws drop directly at the ghat; comfortable wide seating.",
    recommendedTimeSlot: "EVENING",
    durationMinutes: 60,
    description: "Confluence of holy Ganga, Yamuna, and Saraswati. The evening Aarti features grand multi-tiered brass oil lamps.",
    highlights: ["Multi-tier brass lamps", "Holy bath ghat", "Direct vehicle drop-off"],
    hasRopewayOrLift: false
  },
  {
    id: "spot-rk-4",
    name: "Beatles Ashram (Chaurasi Kutia)",
    hindiName: "बीटल्स आश्रम (चौरासी कुटिया)",
    location: "RISHIKESH",
    category: "HERITAGE",
    elderDifficulty: "MODERATE",
    elderComfortTip: "Shaded forest trail inside Rajaji Reserve; numerous shaded benches along the path.",
    recommendedTimeSlot: "MORNING",
    durationMinutes: 75,
    description: "Historic meditation retreat of Maharishi Mahesh Yogi where the Beatles composed the White Album in 1968.",
    highlights: ["Meditation stone domes", "Graffiti art gallery", "Forest bird songs & breeze"],
    hasRopewayOrLift: false
  },
  {
    id: "spot-rk-5",
    name: "Vashistha Gufa (Cave)",
    hindiName: "वशिष्ठ गुफा (ध्यान स्थल)",
    location: "RISHIKESH",
    category: "NATURE_VIEW",
    elderDifficulty: "MODERATE",
    elderComfortTip: "Requires walking down ~120 wide stone stairs through banyan trees to the cave entrance.",
    recommendedTimeSlot: "AFTERNOON",
    durationMinutes: 60,
    description: "Ancient natural cave where Sage Vashistha meditated. Unbelievably peaceful, cool natural air, and private river beach.",
    highlights: ["Deep natural silence", "Ancient Shiva Lingam inside", "Private white-sand Ganga beach"],
    hasRopewayOrLift: false
  },

  // --- EN-ROUTE / PANCH PRAYAG & DHARI DEVI ---
  {
    id: "spot-en-1",
    name: "Maa Dhari Devi Temple (Kalyasaur)",
    hindiName: "माँ धारी देवी मंदिर (कल्यासौड़)",
    location: "ENROUTE",
    category: "TEMPLE",
    elderDifficulty: "EASY",
    elderComfortTip: "New elevated steel suspension walkway leads directly from the highway; no river descent stairs!",
    recommendedTimeSlot: "AFTERNOON",
    durationMinutes: 60,
    description: "Guardian deity of Uttarakhand and Char Dham. The upper half of the goddess is worshipped here above the Alaknanda.",
    highlights: ["Newly built barrier-free bridge", "Highway level approach", "Sacred Char Dham protector"],
    hasRopewayOrLift: false
  },
  {
    id: "spot-en-2",
    name: "Rudraprayag Sangam Viewpoint",
    hindiName: "रुद्रप्रयाग संगम दर्शन",
    location: "ENROUTE",
    category: "NATURE_VIEW",
    elderDifficulty: "EASY",
    elderComfortTip: "Roadside highway viewing pavilion; scenic photo stop with zero stairs.",
    recommendedTimeSlot: "MORNING",
    durationMinutes: 25,
    description: "Spectacular confluence where muddy waters of Mandakini meet crystalline turquoise Alaknanda.",
    highlights: ["Distinct water color boundary", "Roadside convenience", "Historic temple view"],
    hasRopewayOrLift: false
  },
  {
    id: "spot-en-3",
    name: "Devprayag Sangam Pavilion",
    hindiName: "देवप्रयाग संगम (गंगा उद्गम)",
    location: "ENROUTE",
    category: "NATURE_VIEW",
    elderDifficulty: "EASY",
    elderComfortTip: "Highway lookout deck gives the complete view of Bhagirathi meeting Alaknanda to become the Ganga.",
    recommendedTimeSlot: "MORNING",
    durationMinutes: 30,
    description: "The most sacred of Panch Prayags: Bhagirathi meets Alaknanda to form the Ganga. Viewable comfortably from NH-7 deck.",
    highlights: ["Birthplace of river Ganga", "Vibrant contrasting waters", "Highway deck photography"],
    hasRopewayOrLift: false
  },
  {
    id: "spot-en-4",
    name: "Karnaprayag & Nandaprayag Viewpoints",
    hindiName: "कर्णप्रयाग एवं नन्दप्रयाग संगम",
    location: "ENROUTE",
    category: "NATURE_VIEW",
    elderDifficulty: "EASY",
    elderComfortTip: "Quick bridge-side halt; fathers can view rivers without exiting vehicle if tired.",
    recommendedTimeSlot: "MORNING",
    durationMinutes: 20,
    description: "Where Pindar river and Nandakini river merge with Alaknanda. Rich in Mahabharata lore and sage penance.",
    highlights: ["Mahabharata Karna association", "Rapid mountain cascades", "Quick roadside halt"],
    hasRopewayOrLift: false
  },

  // --- MANA VILLAGE (Day 4 Excursion) ---
  {
    id: "spot-mn-1",
    name: "Vyas Gufa & Ganesh Gufa (Mana)",
    hindiName: "व्यास गुफा एवं गणेश गुफा (माणा)",
    location: "BADRINATH_MANA",
    category: "HERITAGE",
    elderDifficulty: "MODERATE",
    elderComfortTip: "Stone paved uphill path; walking stick advised. Benches available along the lane.",
    recommendedTimeSlot: "AFTERNOON",
    durationMinutes: 60,
    description: "The sacred cave where Maharishi Ved Vyas dictated the Mahabharata and Lord Ganesha wrote it down.",
    highlights: ["Rock-roof resembling manuscript pages", "India's last village", "Sacred epic birthplace"],
    hasRopewayOrLift: false
  },
  {
    id: "spot-mn-2",
    name: "Bheem Pul & Saraswati River Origin",
    hindiName: "भीम पुल एवं सरस्वती उद्गम",
    location: "BADRINATH_MANA",
    category: "NATURE_VIEW",
    elderDifficulty: "MODERATE",
    elderComfortTip: "Sturdy guard rails throughout; paved pathway to the roaring glacial gorge.",
    recommendedTimeSlot: "AFTERNOON",
    durationMinutes: 45,
    description: "Massive natural rock bridge placed by Bheema for Draupadi across the surging Saraswati river.",
    highlights: ["Surging underground river emerging", "Monolithic rock bridge", "Himalayan border panorama"],
    hasRopewayOrLift: false
  },
  {
    id: "spot-mn-3",
    name: "India's First Tea Stall (Mana Border)",
    hindiName: "भारत की पहली चाय की दुकान",
    location: "BADRINATH_MANA",
    category: "SHOPPING",
    elderDifficulty: "EASY",
    elderComfortTip: "Sit down on wooden benches and enjoy warm ginger-cardamom tea in crisp mountain air.",
    recommendedTimeSlot: "AFTERNOON",
    durationMinutes: 30,
    description: "Iconic tea stall situated right near the Indo-Tibetan border trail; famous for warm herbal teas and souvenirs.",
    highlights: ["Memorable tea stop", "Border photo milestone", "Warm sit-down break"],
    hasRopewayOrLift: false
  },

  // --- DEHRADUN & MUSSOORIE (Day 8 Options) ---
  {
    id: "spot-dm-1",
    name: "Mussoorie Mall Road & Gun Hill Ropeway",
    hindiName: "मसूरी माल रोड एवं गन हिल रोपवे",
    location: "DEHRADUN_MUSSOORIE",
    category: "ROPEWAY",
    elderDifficulty: "EASY",
    elderComfortTip: "Cable car directly connects Mall Road to Gun Hill summit; panoramic Himalayan view with zero climbing.",
    recommendedTimeSlot: "AFTERNOON",
    durationMinutes: 90,
    description: "Queen of the Hills' famous promenade. Enjoy British-era architecture, cool pine breeze, and cable car to Gun Hill.",
    highlights: ["Gun Hill ropeway", "Crisp mountain air & pine trees", "Wheelchair accessible Mall Road stretch"],
    hasRopewayOrLift: true
  },
  {
    id: "spot-dm-2",
    name: "Kempty Falls (Mussoorie)",
    hindiName: "केम्पटी फॉल्स (रोपवे सुविधा)",
    location: "DEHRADUN_MUSSOORIE",
    category: "NATURE_VIEW",
    elderDifficulty: "EASY",
    elderComfortTip: "Use the cable car right from the parking entrance; skips 200 wet and steep stone stairs.",
    recommendedTimeSlot: "MORNING",
    durationMinutes: 75,
    description: "Iconic perennial waterfall cascading down mountain cliffs into a splash pool.",
    highlights: ["Ropeway directly down to falls", "Lush green valley view", "Cool refreshing mist"],
    hasRopewayOrLift: true
  },
  {
    id: "spot-dm-3",
    name: "Sahastradhara Sulphur Springs & Ropeway (Dehradun)",
    hindiName: "सहस्त्रधारा एवं रोपवे (देहरादून)",
    location: "DEHRADUN_MUSSOORIE",
    category: "ROPEWAY",
    elderDifficulty: "EASY",
    elderComfortTip: "Ropeway whisks visitors across the river to a peaceful hilltop park.",
    recommendedTimeSlot: "MORNING",
    durationMinutes: 60,
    description: "Thousand-fold springs famous for therapeutic sulphur waters and panoramic hilltop views via ropeway.",
    highlights: ["Scenic ropeway ride", "Healing mineral springs", "Cool mountain water"],
    hasRopewayOrLift: true
  },
  {
    id: "spot-dm-4",
    name: "Tapkeshwar Mahadev Cave Temple (Dehradun)",
    hindiName: "टपकेश्वर महादेव गुफा मंदिर",
    location: "DEHRADUN_MUSSOORIE",
    category: "TEMPLE",
    elderDifficulty: "EASY",
    elderComfortTip: "Gentle paved descent beside river; shaded and cool.",
    recommendedTimeSlot: "AFTERNOON",
    durationMinutes: 50,
    description: "Ancient cave temple dedicated to Lord Shiva where natural water droplets continuously drip onto the Shiva Lingam.",
    highlights: ["Continuous natural Jalabhishek", "Shaded river gorge", "Minimal steps"],
    hasRopewayOrLift: false
  }
];

// Curated Directory of Reputable Haridwar Taxi Agencies & Hill Operators (Day 2 Cab Booking)
export const HARIDWAR_CAB_AGENCIES_DIRECTORY: CabAgency[] = [
  {
    id: "agency-hw-taxi",
    name: "Haridwar Taxi Services (Devpura)",
    location: "Devpura, Haridwar",
    address: "Near Narayani Shila Temple, Opp. Fire Brigade, Devpura, Haridwar",
    phone: "+919758966888",
    alternatePhone: "01334229479",
    whatsapp: "919758966888",
    rating: 4.8,
    trustedBadge: "Top Pick • Devpura Proximity",
    distanceFromStation: "300m from Haridwar Railway Station",
    estimatedPricing: {
      ertiga: "₹16,500 – ₹18,000",
      innovaCrysta: "₹22,500 – ₹25,000",
      scorpio: "₹18,000 – ₹20,000"
    },
    notes: "24/7 desk near Devpura; verified hill drivers with Uttarakhand Green Card; all tolls and hill permits included."
  },
  {
    id: "agency-kaka-travels",
    name: "Kaka Travels (Station 24/7 Desk)",
    location: "Haridwar Railway Station Gate 1",
    address: "Station Road, Near Gate No. 1, Haridwar Junction",
    phone: "+919837066277",
    alternatePhone: "+919758000021",
    whatsapp: "919837066277",
    rating: 4.7,
    trustedBadge: "24/7 Station Desk • Fixed Rates",
    distanceFromStation: "100m from Station Exit Gate 1",
    estimatedPricing: {
      ertiga: "₹16,000 – ₹18,500",
      innovaCrysta: "₹22,000 – ₹24,500",
      scorpio: "₹17,500 – ₹19,500"
    },
    notes: "Prompt service, clean sanitized Innova Crysta / Ertiga cabs, experienced Garhwal hill drivers."
  },
  {
    id: "agency-station-union",
    name: "Haridwar Railway Station Taxi Union Stand",
    location: "Railway Station Complex",
    address: "Main Taxi Stand, Platform 1 Exit, Station Road, Haridwar",
    phone: "+911334227037",
    alternatePhone: "+919412071234",
    whatsapp: "919412071234",
    rating: 4.6,
    trustedBadge: "Official Taxi Union Counter",
    distanceFromStation: "Right at Station Portico",
    estimatedPricing: {
      ertiga: "₹17,000 – ₹19,000",
      innovaCrysta: "₹23,000 – ₹26,000",
      scorpio: "₹18,500 – ₹20,500"
    },
    notes: "Official Union booth with standard fixed rates; reliable commercial yellow-plate hill cabs."
  },
  {
    id: "agency-trayambhkam",
    name: "Trayambhkam Tour & Travels",
    location: "Opposite Station Gate No. 2",
    address: "Haridwar Main Road, Opp. Station Gate 2, Devpura, Haridwar",
    phone: "+919897055589",
    whatsapp: "919897055589",
    rating: 4.7,
    trustedBadge: "High Call Pickup • Yatra Specialist",
    distanceFromStation: "150m from Station Gate 2",
    estimatedPricing: {
      ertiga: "₹16,500 – ₹18,500",
      innovaCrysta: "₹23,000 – ₹25,500"
    },
    notes: "Specializes in Badrinath & Kedarnath round trips; transparent driver allowance policy."
  },
  {
    id: "agency-triveni-cabs",
    name: "Triveni Cabs Uttarakhand",
    location: "Devpura / Station Link Road",
    address: "Near Shankaracharya Chowk, Devpura, Haridwar",
    phone: "+917668570551",
    whatsapp: "917668570551",
    rating: 4.8,
    trustedBadge: "Top Fleet Condition • Senior Friendly",
    distanceFromStation: "400m from Devpura Chowk",
    estimatedPricing: {
      ertiga: "₹17,000 – ₹19,000",
      innovaCrysta: "₹23,500 – ₹26,000"
    },
    notes: "Comfortable captain seats; non-smoking experienced hill drivers; highly rated for elder safety."
  },
  {
    id: "agency-kaushik-travels",
    name: "Kaushik Tour & Travels",
    location: "Devpura Station Road",
    address: "Station Road, Devpura, Haridwar 249401",
    phone: "+919837265431",
    whatsapp: "919837265431",
    rating: 4.6,
    trustedBadge: "15+ Years Local Experience",
    distanceFromStation: "260m from Railway Station",
    estimatedPricing: {
      ertiga: "₹16,000 – ₹18,000",
      innovaCrysta: "₹22,000 – ₹25,000"
    },
    notes: "Established local agency; transparent quotes with breakdown of tolls and night halts."
  },
  {
    id: "agency-shubh-yatra",
    name: "Shubh Yatra Tour & Travels",
    location: "Haridwar - Rishikesh Highway, Devpura",
    address: "Near City Hospital, Devpura, Haridwar",
    phone: "+919412998877",
    whatsapp: "919412998877",
    rating: 4.7,
    trustedBadge: "Verified Yatra Provider",
    distanceFromStation: "500m from Station",
    estimatedPricing: {
      ertiga: "₹16,500 – ₹18,500",
      innovaCrysta: "₹22,500 – ₹25,000"
    },
    notes: "Includes all state border taxes, green card registration, and toll permits."
  }
];

// Elder-Dignity Mountain Vehicle Inspection Checklist
export const HILL_CAB_INSPECTION_DEFAULTS: HillCabInspectionItem[] = [
  {
    id: "ins-green-card",
    title: "Uttarakhand Green Card & Hill Permit",
    description: "Valid Green Card issued by the Uttarakhand Transport Department for commercial operations on the Char Dham highway.",
    critical: true,
    checked: false
  },
  {
    id: "ins-hill-endorsement",
    title: "Experienced Mountain Driver (Hill License Endorsement)",
    description: "Driver must have 'Hill Endorsement' on commercial license with minimum 3-5 years driving on NH-7 curves.",
    critical: true,
    checked: false
  },
  {
    id: "ins-yellow-plate",
    title: "Commercial Yellow Plate (UK-08 / UK-07 / UK-14)",
    description: "Strictly verify commercial registration plate. Private white-plate vehicles are illegal for hire and stopped at RTO hill checkpoints.",
    critical: true,
    checked: false
  },
  {
    id: "ins-captain-seats",
    title: "Elder Comfort Middle-Row Captain Seats",
    description: "Innova Crysta / Ertiga middle-row seats must recline smoothly with ample legroom for Sanjay Ji & Rajnish Ji.",
    critical: true,
    checked: false
  },
  {
    id: "ins-tire-treads",
    title: "Tire Tread Depth & Inflatable Spare Wheel",
    description: "Inspect all 4 tires for deep rubber treads (no bald tires); verify functional spare wheel (stepney) and working hydraulic jack.",
    critical: true,
    checked: false
  },
  {
    id: "ins-roof-tarpaulin",
    title: "Roof Luggage Carrier with Waterproof Tarpaulin",
    description: "Luggage carrier securely fitted on roof; heavy waterproof tarpaulin & nylon ropes provided to protect bags from mountain rain.",
    critical: true,
    checked: false
  },
  {
    id: "ins-seat-belts",
    title: "Functional Seat Belts in Middle Row",
    description: "Both middle captain seats must have functioning seat belts to keep fathers secure and prevent sliding during sharp hairpins.",
    critical: true,
    checked: false
  },
  {
    id: "ins-no-night-driving",
    title: "Strict 'No Night Driving' Agreement",
    description: "Driver agrees in advance to reach destination hotel before 18:30 dusk; zero driving on NH-7 mountain curves after dark.",
    critical: true,
    checked: false
  }
];

// Verified Roadside Stops with Elder Cleanliness Ratings
export const HIMALAYAN_ROADSIDE_STOPS: RoadsideStop[] = [
  // Delhi to Haridwar Route (Day 2)
  {
    id: "stop-cheetal",
    highway: "DELHI_HARIDWAR_EXPRESSWAY",
    name: "Cheetal Grand (Khatauli)",
    landmark: "NH-58 / Delhi-Dehradun Highway, Khatauli",
    distanceFromStartKm: 98,
    cleanToiletRating: 5,
    hasWesternWC: true,
    isWheelchairFriendly: true,
    foodType: "Pure Veg & Multi-Cuisine Restaurant",
    recommendedTreat: "Fresh Grilled Paneer Pakoras, Filter Coffee & Masala Chai",
    elderComfortNotes: "Spacious green garden with paved ramps. Very clean luxury Western WCs with attendants.",
    approxDriveTimeFromOrigin: "1h 45m from Delhi (NDLS)"
  },
  {
    id: "stop-namaste-midway",
    highway: "DELHI_HARIDWAR_EXPRESSWAY",
    name: "Namaste Midway (Mansurpur)",
    landmark: "NH-58 Bypass, Mansurpur, Muzaffarnagar",
    distanceFromStartKm: 118,
    cleanToiletRating: 5,
    hasWesternWC: true,
    isWheelchairFriendly: true,
    foodType: "Food Court (Haldiram, Bikanervala, Chai Point, Subway)",
    recommendedTreat: "Hot Jain Thali, Moong Dal Halwa & Steaming Ginger Tea",
    elderComfortNotes: "Air-conditioned indoor dining, zero stairs, world-class clean washrooms with dedicated senior stalls.",
    approxDriveTimeFromOrigin: "2h 15m from Delhi (NDLS)"
  },

  // Haridwar to Badrinath Route (Day 3 & Day 5)
  {
    id: "stop-teen-dhara",
    highway: "NH7_HIMALAYAN_HIGHWAY",
    name: "Teen Dhara Spring Oasis",
    landmark: "NH-7 Ghat, Between Rishikesh & Devprayag (Mile 68)",
    distanceFromStartKm: 68,
    cleanToiletRating: 3.5,
    hasWesternWC: true,
    isWheelchairFriendly: false,
    foodType: "Authentic Garhwali Roadside Dhabas",
    recommendedTreat: "Fresh Himalayan Sweet Lime (Nimbu-Pani) & Hot Kadhi-Chawal",
    elderComfortNotes: "Famous natural mountain spring water. Fresh lime water instantly relieves motion sickness from ghat curves.",
    approxDriveTimeFromOrigin: "2h 00m from Haridwar"
  },
  {
    id: "stop-devprayag-view",
    highway: "NH7_HIMALAYAN_HIGHWAY",
    name: "Devprayag Sangam Viewpoint",
    landmark: "NH-7 Confluence Overlook, Devprayag",
    distanceFromStartKm: 75,
    cleanToiletRating: 3,
    hasWesternWC: false,
    isWheelchairFriendly: false,
    foodType: "Tea Stalls & Mineral Water Kiosks",
    recommendedTreat: "Hot Cardamom Tea & Roasted Peanuts",
    elderComfortNotes: "10-minute leg stretching stop. Breathtaking view of Bhagirathi (teal) meeting Alaknanda (muddy green) to form the holy Ganga.",
    approxDriveTimeFromOrigin: "2h 30m from Haridwar"
  },
  {
    id: "stop-srinagar-city",
    highway: "NH7_HIMALAYAN_HIGHWAY",
    name: "Srinagar Garhwal Transit Hub (Hotel Chahat / GMVN)",
    landmark: "Alaknanda Valley Broad Basin, Srinagar Town",
    distanceFromStartKm: 105,
    cleanToiletRating: 4.5,
    hasWesternWC: true,
    isWheelchairFriendly: true,
    foodType: "Pure Veg AC Hotel Dining (North Indian, South Indian)",
    recommendedTreat: "Light Yellow Dal, Phulkas, Curd & Warm Khichdi",
    elderComfortNotes: "Largest flat valley town on the route. Government Base Hospital & multiple chemist shops. Highly recommended for a full 45-minute lunch break.",
    approxDriveTimeFromOrigin: "3h 30m from Haridwar"
  },
  {
    id: "stop-rudraprayag-sangam",
    highway: "NH7_HIMALAYAN_HIGHWAY",
    name: "Rudraprayag Sangam Halt",
    landmark: "NH-7 Kedarnath & Badrinath Highway Bifurcation Point",
    distanceFromStartKm: 138,
    cleanToiletRating: 4,
    hasWesternWC: true,
    isWheelchairFriendly: false,
    foodType: "Pilgrim Dhabas & Sweet Shops",
    recommendedTreat: "Warm Jalebi, Chai & Mineral Water",
    elderComfortNotes: "Midpoint between Haridwar and Badrinath. Confluence of Mandakini & Alaknanda rivers. Clean GMVN complex nearby.",
    approxDriveTimeFromOrigin: "4h 45m from Haridwar"
  },
  {
    id: "stop-pipalkoti-valley",
    highway: "NH7_HIMALAYAN_HIGHWAY",
    name: "Pipalkoti Valley Halt (Hotel Badrinatha / GMVN)",
    landmark: "Scenic Alaknanda Valley Basin before Joshimath",
    distanceFromStartKm: 185,
    cleanToiletRating: 4.5,
    hasWesternWC: true,
    isWheelchairFriendly: true,
    foodType: "North Indian Vegetarian & Local Pahadi Dishes",
    recommendedTreat: "Hot Ginger-Tulsi Tea & Gahat Dal Soup",
    elderComfortNotes: "Calm green basin with spacious parking. Warm soup or ginger tea helps elders adapt to the altitude rise before reaching Joshimath.",
    approxDriveTimeFromOrigin: "6h 30m from Haridwar"
  },
  {
    id: "stop-joshimath-base",
    highway: "NH7_HIMALAYAN_HIGHWAY",
    name: "Joshimath Town Centre (1,890m)",
    landmark: "Upper Bazar / Helang Ghat Road",
    distanceFromStartKm: 215,
    cleanToiletRating: 4,
    hasWesternWC: true,
    isWheelchairFriendly: false,
    foodType: "Full Himalayan Pilgrim Restaurants",
    recommendedTreat: "Hot Tomato Soup, Vegetable Pulao & Fresh Apples",
    elderComfortNotes: "Gate to Badrinath Dham. Last stop with multiple active bank ATMs, medical oxygen cans, and warm woollen stalls.",
    approxDriveTimeFromOrigin: "7h 45m from Haridwar"
  }
];

// Curated Sacred Darshan, Puja & Aarti Timekeeper Schedule
export const SACRED_RITUAL_SLOTS: SacredRitualSlot[] = [
  {
    id: "slot-hw-aarti-1",
    dayId: "day-2",
    templeName: "Har Ki Pauri, Haridwar",
    ritualName: "Maha Ganga Sandhya Aarti",
    timeWindow: "17:45 – 18:30",
    targetTime: "18:00",
    arriveByTime: "16:45",
    importance: "HIGH_MANDATORY",
    elderSeatingAdvice: "Cross clock tower bridge to Malviya Dweep by 16:45 for ground steps near priests. Bring fold-up floor cushion or hire wooden stool (₹30) so fathers do not sit on cold stones.",
    dressCodeAdvice: "Traditional Indian attire (Kurta/Dhoti or clean light clothing). Shawl recommended as breeze over river turns cool after sunset.",
    location: "HARIDWAR"
  },
  {
    id: "slot-badri-abhishek",
    dayId: "day-4",
    templeName: "Shri Badrinath Temple",
    ritualName: "Brahma Muhurta Maha Abhishek & Nirmalya Darshan",
    timeWindow: "04:30 – 06:30",
    targetTime: "05:00",
    arriveByTime: "04:15",
    importance: "RECOMMENDED",
    elderSeatingAdvice: "Temperature drops below 5°C. Queues form along covered ramp. Heated waiting bays inside sanctum. Sons escort fathers on both sides.",
    dressCodeAdvice: "Heavy thermals, woollen monkey caps, thick gloves, warm socks. Remove footwear at Temple Trust shoe counter.",
    location: "BADRINATH"
  },
  {
    id: "slot-brahma-kapal",
    dayId: "day-4",
    templeName: "Brahma Kapal Ghat (Alaknanda Banks)",
    ritualName: "Ancestral Pind Daan & Tarpan Mahapuja",
    timeWindow: "08:30 – 11:00",
    targetTime: "09:00",
    arriveByTime: "08:15",
    importance: "HIGH_MANDATORY",
    elderSeatingAdvice: "Ghat steps leading down to river are 40-50 stone steps. Walk slowly holding handrails. Panda priests provide wooden Asan mats for ritual.",
    dressCodeAdvice: "White cotton Dhoti/Kurta for Karta (Rajnish Ji & Sanjay Ji). Keep woollen jacket easily accessible for after ritual completion.",
    location: "BADRINATH"
  },
  {
    id: "slot-badri-aarti",
    dayId: "day-4",
    templeName: "Shri Badrinath Temple",
    ritualName: "Shayan Aarti & Geeta Govinda Recital",
    timeWindow: "18:00 – 19:30",
    targetTime: "18:30",
    arriveByTime: "17:15",
    importance: "HIGH_MANDATORY",
    elderSeatingAdvice: "Deeply melodious and divine evening ceremony. Temple interior fills with camphor and incense. Seek seating near silver pillar for elders.",
    dressCodeAdvice: "Full woollen coat and thermal muffler. Evening chill at 3,133m altitude is acute.",
    location: "BADRINATH"
  },
  {
    id: "slot-dhari-devi",
    dayId: "day-5",
    templeName: "Maa Dhari Devi Temple",
    ritualName: "Shaktipeeth Enroute Darshan & Afternoon Bhog",
    timeWindow: "11:30 – 13:00",
    targetTime: "12:00",
    arriveByTime: "11:15",
    importance: "RECOMMENDED",
    elderSeatingAdvice: "Walkway across Alaknanda lake has gentle ramp. Steel suspended footbridge has seating benches midway. Wheelchair service available at roadside gate.",
    dressCodeAdvice: "Comfortable travel clothes. Easy slip-on footwear for temple deck.",
    location: "ENROUTE"
  },
  {
    id: "slot-hw-aarti-2",
    dayId: "day-6",
    templeName: "Har Ki Pauri, Haridwar",
    ritualName: "Complete Sandhya Aarti & Deep Daan",
    timeWindow: "17:45 – 18:30",
    targetTime: "18:00",
    arriveByTime: "16:45",
    importance: "HIGH_MANDATORY",
    elderSeatingAdvice: "Sons buy flower leaf Diyas (₹20-50). Help fathers release floating lights into Ganga stream from safe step with handrail.",
    dressCodeAdvice: "Comfortable cotton kurta with light sweater for evening breeze.",
    location: "HARIDWAR"
  },
  {
    id: "slot-rishikesh-aarti",
    dayId: "day-7",
    templeName: "Parmarth Niketan Ashram, Rishikesh",
    ritualName: "World-Renowned Ganga Aarti & Bhajan Choir",
    timeWindow: "17:30 – 18:30",
    targetTime: "17:45",
    arriveByTime: "16:45",
    importance: "HIGH_MANDATORY",
    elderSeatingAdvice: "Spacious marble stepped ghat facing Lord Shiva statue. Dedicated chairs and raised marble platforms available for senior citizens.",
    dressCodeAdvice: "Modest comfortable Indian attire.",
    location: "RISHIKESH"
  }
];

// Day-by-Day Outfit, Weather & Dress-Code Advisor
export const DAILY_OUTFIT_GUIDANCE: DayOutfitGuidance[] = [
  {
    dayId: "day-1",
    tempRange: "28°C – 32°C (AC Cabin 22°C)",
    elderWear: "Comfortable soft cotton Kurta-Pyjama or loose trousers; warm socks for train AC cabin.",
    sonsWear: "Light cotton T-shirt, travel track pants or jeans, comfortable slip-on sneakers.",
    dayBagEssentials: ["Warm shawl / light sweater for AC", "Medicines & water bottle", "Hand sanitizer & wipes"],
    footwear: "Slip-on sandals or walking shoes with socks.",
    specialNote: "Coach A2 is centrally air-conditioned; keep an easy-access cardigan or shawl in the berth bag."
  },
  {
    dayId: "day-2",
    tempRange: "26°C – 31°C (Plains & Haridwar)",
    elderWear: "Breathable cotton attire for the 4-hour highway drive; fresh evening Kurta for Har Ki Pauri.",
    sonsWear: "Casual polo / cotton shirt with travel trousers.",
    dayBagEssentials: ["Sunglasses", "Light cotton stole/shawl for evening river breeze", "Small umbrella/cap"],
    footwear: "Easy slip-off sandals/crocs (must remove frequently at Haridwar ghats).",
    specialNote: "Ganga water at Har Ki Pauri is chilly; bring small hand towel for drying feet after achaman."
  },
  {
    dayId: "day-3",
    tempRange: "12°C – 22°C (Ascending from 314m to 1,890m)",
    elderWear: "Layered clothing: Thermal innerwear top + full-sleeve shirt + windproof fleece jacket.",
    sonsWear: "Thermal inner + hoodie / windcheater jacket + comfortable cargo or track pants.",
    dayBagEssentials: ["Motion-sickness tablets (Avomine)", "Woollen cap / muffler", "Lip balm & moisturizer"],
    footwear: "Closed sneakers or lightweight trekking shoes with good grip.",
    specialNote: "Temperature drops rapidly after passing Chamoli. Keep warm jackets on top of luggage."
  },
  {
    dayId: "day-4",
    tempRange: "3°C – 12°C (Badrinath Dham 3,133m)",
    elderWear: "Full Heavy Thermal Inners + Woollen Sweater + Padded Winter Coat; Traditional Dhoti/Kurta for Brahma Kapal Tarpan.",
    sonsWear: "Heavy thermals + fleece hoodie + down jacket + gloves + warm beanie.",
    dayBagEssentials: ["Woollen monkey cap / beanie", "Insulated gloves", "Thermal woollen socks", "Camphor tablets"],
    footwear: "Warm woollen socks with easy slip-off shoes for temple entrance.",
    specialNote: "Acute cold during morning 04:30 Abhishek and evening 18:00 Aarti. Wear two layers of socks."
  },
  {
    dayId: "day-5",
    tempRange: "14°C – 28°C (Descent to Haridwar)",
    elderWear: "Layered clothes that can be easily unzipped/shed as the car descends to warmer plains.",
    sonsWear: "T-shirt under light jacket + track pants.",
    dayBagEssentials: ["Water bottle & electoral/ORS", "Light scarf for temple deck", "Wet wipes"],
    footwear: "Comfortable sandals with ankle strap for walking suspension bridge at Dhari Devi.",
    specialNote: "Remove heavy winter coat in the car as afternoon temperatures rise near Rishikesh."
  },
  {
    dayId: "day-6",
    tempRange: "24°C – 30°C (Haridwar Ghats & Temples)",
    elderWear: "Light, modest pure cotton Kurta-Pyjama; sun protection hat or umbrella for ropeways.",
    sonsWear: "Light breathable cotton T-shirt / linen shirt and comfortable trousers.",
    dayBagEssentials: ["Cotton cloth bag for temple shoes", "Ganga Jal can/bottles", "Sun protection cap"],
    footwear: "Cushioned walking sandals with anti-skid grip for damp marble ghats.",
    specialNote: "Extensive walking across Mansa Devi and Bara Bazaar; ensure shoes have soft cushioned soles."
  },
  {
    dayId: "day-7",
    tempRange: "22°C – 28°C (Rishikesh Ashrams)",
    elderWear: "White or saffron light cotton Kurta; comfortable stole for Parmarth Niketan Aarti.",
    sonsWear: "Modest cotton shirt and trousers.",
    dayBagEssentials: ["Light shawl for evening aarti by the river", "Water bottle", "Small shoulder bag"],
    footwear: "Walking shoes or supportive sandals for bridge crossings.",
    specialNote: "Ram Jhula and Janki Setu involve gentle walking; keep walking sticks handy if needed."
  },
  {
    dayId: "day-8",
    tempRange: "18°C – 25°C (Mussoorie / Dehradun Foothills)",
    elderWear: "Comfortable travel trousers + polo / shirt + light cardigan or windcheater.",
    sonsWear: "Casual denim/chinos + casual shirt or sweater.",
    dayBagEssentials: ["Light umbrella (mountain mist)", "Camera/phone charger", "Lip balm"],
    footwear: "Comfortable walking sneakers with good rubber traction.",
    specialNote: "Gentle leisurely day; dress comfortably for mountain café lunches and scenic valley views."
  },
  {
    dayId: "day-9",
    tempRange: "26°C – 31°C (Airport & Flight)",
    elderWear: "Comfortable loose trousers with elastic waist, soft cotton shirt, and light travel jacket for flight AC.",
    sonsWear: "Airport casuals: joggers/jeans, sneakers, comfortable T-shirt and light jacket.",
    dayBagEssentials: ["Boarding passes & Photo IDs in quick-access pouch", "Regular flight medicines", "Empty water bottle (fill after security)"],
    footwear: "Slip-on sneakers or loafers for fast airport security screening.",
    specialNote: "2-leg flight connection (DED → DEL → RPR); dress for sitting comfortably across 4+ hours of air travel."
  }
];

// Daily Hard Cash vs UPI Advisor & Signal Coverage Map
export const DAILY_CASH_UPI_GUIDANCE: DayCashUpiGuidance[] = [
  {
    dayId: "day-1",
    recommendedCashINR: "₹1,500 – ₹2,000",
    upiReliability: "FULL_UPI",
    primaryCashExpenses: ["Platform coolie/porter at Durg (₹200-300)", "Train pantry tips & bottled water (₹100-200)"],
    lastAtmLocation: "Durg Junction Station Concourse (SBI & PNB ATMs)",
    denominationTip: "Keep ten ₹20, ten ₹50, and ten ₹100 notes handy for coolies and station vendors."
  },
  {
    dayId: "day-2",
    recommendedCashINR: "₹4,000 – ₹5,000",
    upiReliability: "FULL_UPI",
    primaryCashExpenses: ["NDLS coolie to cab bay (₹300)", "Highway dhaba tips (₹100)", "Advance token cash for Haridwar cab agency booking (₹3,000-5,000)"],
    lastAtmLocation: "New Delhi Railway Station Ajmeri Gate / Haridwar Railway Station Chowk",
    denominationTip: "Keep ₹500 notes for cab booking token; small change ₹20/₹50 for shoe stands at Har Ki Pauri."
  },
  {
    dayId: "day-3",
    recommendedCashINR: "₹3,500 – ₹5,000",
    upiReliability: "INTERMITTENT",
    primaryCashExpenses: ["Teen Dhara fresh lime juice & snacks (₹200)", "Roadside fruit stalls & water (₹200)", "Driver meal DA if paid daily (₹400)", "Emergency mountain halt fund"],
    lastAtmLocation: "Srinagar Garhwal (SBI Main Branch) or Joshimath Upper Bazar — LAST RELIABLE ATMS!",
    denominationTip: "Crucial: withdraw cash at Srinagar or Joshimath. Mobile networks drop frequently along NH-7 gorges."
  },
  {
    dayId: "day-4",
    recommendedCashINR: "₹6,000 – ₹8,000",
    upiReliability: "CASH_MANDATORY",
    primaryCashExpenses: [
      "Brahma Kapal Panda Priest Dakshina & Tarpan Samagri (₹2,100 – ₹3,100)",
      "Temple Special Darshan / Prasad tokens (₹500 – ₹1,000)",
      "Mana Village Last Indian Tea Stall & local woollen crafts (₹500 – ₹1,500)",
      "Shoe counter / cloakroom tips (₹50 – ₹100)"
    ],
    lastAtmLocation: "Joshimath SBI / PNB (Badrinath ATMs frequently run out of cash during Yatra season)",
    denominationTip: "Keep crisp ₹100, ₹200, and ₹500 notes in a waterproof pouch for sacred Dakshina ceremonies."
  },
  {
    dayId: "day-5",
    recommendedCashINR: "₹2,500 – ₹4,000",
    upiReliability: "INTERMITTENT",
    primaryCashExpenses: ["Maa Dhari Devi prasad & temple offerings (₹300 – ₹500)", "Roadside lunch & tea breaks (₹600 – ₹1,000)", "Driver mountain tip / bonus on safe arrival (₹1,000 – ₹1,500)"],
    lastAtmLocation: "Rudraprayag / Srinagar Garhwal Market",
    denominationTip: "Keep ₹100 and ₹500 notes handy for settling highway meals and driver gratuity."
  },
  {
    dayId: "day-6",
    recommendedCashINR: "₹2,000 – ₹3,000",
    upiReliability: "FULL_UPI",
    primaryCashExpenses: ["Mansa Devi / Chandi Devi Ropeway VIP passes (if paid in cash)", "Ganga Aarti floating flower Diyas (₹50 – ₹100)", "Auto-rickshaw / E-rickshaw local rides (₹100 – ₹200)", "Bara Bazaar sweets / peda purchase"],
    lastAtmLocation: "Multiple ATMs around Haridwar Post Office & Railway Station",
    denominationTip: "UPI works across 95% of shops; carry ₹20/₹50 for flower diya sellers and e-rickshaws."
  },
  {
    dayId: "day-7",
    recommendedCashINR: "₹1,500 – ₹2,500",
    upiReliability: "FULL_UPI",
    primaryCashExpenses: ["Parmarth Niketan Aarti donations (₹200 – ₹500)", "Ashram book store / souvenirs", "Local juice & tea stalls"],
    lastAtmLocation: "Rishikesh Tapovan & Ram Jhula Market ATMs",
    denominationTip: "GPay and PhonePe QR codes widely accepted everywhere in Rishikesh."
  },
  {
    dayId: "day-8",
    recommendedCashINR: "₹1,500 – ₹2,000",
    upiReliability: "FULL_UPI",
    primaryCashExpenses: ["Local sightseeing entry tickets & parking", "Handicrafts & roadside fresh fruits"],
    lastAtmLocation: "Dehradun Rajpur Road / Airport Junction ATMs",
    denominationTip: "UPI accepted almost everywhere; carry small notes for parking attendants."
  },
  {
    dayId: "day-9",
    recommendedCashINR: "₹1,500 – ₹2,000",
    upiReliability: "FULL_UPI",
    primaryCashExpenses: ["Jolly Grant airport porter (₹200)", "Raipur airport prepaid taxi balance (₹1,000 – ₹1,500)"],
    lastAtmLocation: "Dehradun Airport Terminal (SBI ATM) & Raipur Airport Arrival Hall",
    denominationTip: "All airport food kiosks take UPI/Cards. Cash only needed for local home drop cab."
  }
];

// Bilingual Driver & Local Voice Phrasebook (Hindi & Garhwali)
export const TRAVEL_PHRASEBOOK: TravelPhrase[] = [
  // 1. DRIVER SAFETY & CAB COMFORT
  {
    id: "ph-ds-1",
    category: "DRIVER_SAFETY",
    hindiDevanagari: "भैया, थोड़ा आराम से चलाइए, पिताजी को पहाड़ी मोड़ पर चक्कर और मोशन सिकनेस होती है।",
    englishTransliteration: "Bhaiya, thoda aaram se chalaiye, pitaji ko pahadi mod par chakkar aur motion sickness hoti hai.",
    englishMeaning: "Brother, please drive gently. Father gets motion sickness and nausea on hairpin mountain bends.",
    contextUsage: "Use when ascending between Rishikesh and Joshimath if cab speed feels aggressive on ghat curves.",
    audioText: "भैया, थोड़ा आराम से चलाइए, पिताजी को पहाड़ी मोड़ पर चक्कर और मोशन सिकनेस होती है।"
  },
  {
    id: "ph-ds-2",
    category: "DRIVER_SAFETY",
    hindiDevanagari: "भैया, आगे किसी साफ़ जगह 5 मिनट रोक लीजिए, पिताजी को फ्रेश होना है और पैर सीधे करने हैं।",
    englishTransliteration: "Bhaiya, aage kisi saaf jagah 5 minute rok lijiye, pitaji ko fresh hona hai aur pair seedhe karne hain.",
    englishMeaning: "Brother, please pull over at a clean roadside spot ahead for 5 minutes so elders can stretch and take a bio-break.",
    contextUsage: "Use when the 2.5h elder interval timer reaches warning level.",
    audioText: "भैया, आगे किसी साफ जगह 5 मिनट रोक लीजिए, पिताजी को फ्रेश होना है और पैर सीधे करने हैं।"
  },
  {
    id: "ph-ds-3",
    category: "DRIVER_SAFETY",
    hindiDevanagari: "भैया, AC बंद करके खिड़की थोड़ी खोल दीजिए, ताज़ा पहाड़ी हवा आने से जी हल्का रहेगा।",
    englishTransliteration: "Bhaiya, AC band karke khidki thodi khol dijiye, taaza pahadi hawa aane se jee halka rahega.",
    englishMeaning: "Brother, please turn off the AC and crack the windows so fresh mountain air eases any nausea.",
    contextUsage: "Essential during mountain ascent to prevent stuffy-car motion sickness.",
    audioText: "भैया, एसी बंद करके खिड़की थोड़ी खोल दीजिए, ताजा पहाड़ी हवा आने से जी हल्का रहेगा।"
  },
  {
    id: "ph-ds-4",
    category: "DRIVER_SAFETY",
    hindiDevanagari: "भैया, कृपया मोड़ पर ओवरटेक मत करिए, हमें कोई जल्दी नहीं है, आराम से चलेंगे।",
    englishTransliteration: "Bhaiya, kripya mod par overtake mat kariye, humein koi jaldi nahi hai, aaram se chalenge.",
    englishMeaning: "Brother, please do not overtake on blind curves. We are in no rush; safety is our priority.",
    contextUsage: "Polite reminder to driver when encountering heavy bus or truck traffic on NH-7.",
    audioText: "भैया, कृपया मोड़ पर ओवरटेक मत करिए, हमें कोई जल्दी नहीं है, आराम से चलेंगे।"
  },
  {
    id: "ph-ds-5",
    category: "DRIVER_SAFETY",
    hindiDevanagari: "भैया, क्या हम रात होने से पहले बद्रीनाथ / जोशीमठ सुरक्षित पहुँच जाएँगे?",
    englishTransliteration: "Bhaiya, kya hum raat hone se pehle Badrinath / Joshimath surakshit pahunch jaayenge?",
    englishMeaning: "Brother, will we safely arrive at our hotel before sunset and mountain nightfall?",
    contextUsage: "Check around 3:00 PM to verify schedule against Himalayan mountain dusk.",
    audioText: "भैया, क्या हम रात होने से पहले बद्रीनाथ या जोशीमठ सुरक्षित पहुंच जाएंगे?"
  },

  // 2. GARHWALI LOCAL GREETINGS & RESPECT
  {
    id: "ph-gw-1",
    category: "GARHWALI_LOCAL",
    hindiDevanagari: "भाईजी, सादर दण्डवत प्रणाम! (नमस्ते)",
    englishTransliteration: "Bhaaiji, saadar dandavat pranaam!",
    englishMeaning: "Respected brother, humble greetings! (Traditional warm Pahadi salutation)",
    contextUsage: "Greet local shopkeepers, hotel staff, and drivers in Uttarakhand to build instant warmth.",
    audioText: "भाईजी, सादर दंडवत प्रणाम!",
    isPahadi: true
  },
  {
    id: "ph-gw-2",
    category: "GARHWALI_LOCAL",
    hindiDevanagari: "कंदुक छो आप? (आप कैसे हैं?)",
    englishTransliteration: "Kanduk chho aap?",
    englishMeaning: "How are you? (Polite Garhwali inquiry)",
    contextUsage: "Ask locals or cab driver during tea halts in Chamoli and Rudraprayag.",
    audioText: "कंदुक छो आप?",
    isPahadi: true
  },
  {
    id: "ph-gw-3",
    category: "GARHWALI_LOCAL",
    hindiDevanagari: "आगै बाटु ठीक च? (क्या आगे का रास्ता साफ़ और खुला है?)",
    englishTransliteration: "Aagai baatu theek cha?",
    englishMeaning: "Is the road ahead clear and safe? (Checking for landslide / traffic delays)",
    contextUsage: "Ask passing taxi drivers or roadside stall owners at checkposts.",
    audioText: "आगै बाटु ठीक च?",
    isPahadi: true
  },
  {
    id: "ph-gw-4",
    category: "GARHWALI_LOCAL",
    hindiDevanagari: "यख बटि बद्रीनाथ कति दुर च? (यहाँ से बद्रीनाथ कितनी दूर है?)",
    englishTransliteration: "Yakh bati Badrinath kati door cha?",
    englishMeaning: "How far is Badrinath from here?",
    contextUsage: "Ask enroute when checking remaining distance in Chamoli or Joshimath.",
    audioText: "यख बटि बद्रीनाथ कति दूर च?",
    isPahadi: true
  },
  {
    id: "ph-gw-5",
    category: "GARHWALI_LOCAL",
    hindiDevanagari: "धन्यवाद भाईजी, भगवान बद्रीविशाल तुम तैं खुश राखिन! (बहुत धन्यवाद)",
    englishTransliteration: "Dhanyavaad bhaaiji, Bhagwan Badrivishal tum tain khush raakhin!",
    englishMeaning: "Thank you brother, may Lord Badrivishal always bless you with happiness!",
    contextUsage: "Expressing heartfelt gratitude to driver, homestay host, or temple helper.",
    audioText: "धन्यवाद भाईजी, भगवान बद्रीविशाल तुम तैं खुश राखिन!",
    isPahadi: true
  },

  // 3. TEMPLE, DARSHAN & RITUAL ETIQUETTE
  {
    id: "ph-tr-1",
    category: "TEMPLE_RITUAL",
    hindiDevanagari: "पंडित जी, हमें ब्रह्मकपाल में पितृ तर्पण एवं पिंडदान की सम्पूर्ण पूजा करानी है।",
    englishTransliteration: "Pandit ji, humein Brahma Kapal mein pitru tarpan evam pind daan ki sampoorn puja karani hai.",
    englishMeaning: "Respected Priest, we wish to perform the sacred ancestral Pind Daan and Tarpan rituals at Brahma Kapal Ghat.",
    contextUsage: "First inquiry to the Pandas upon reaching Brahma Kapal Ghat at Badrinath.",
    audioText: "पंडित जी, हमें ब्रह्मकपाल में पितृ तर्पण एवं पिंडदान की संपूर्ण पूजा करानी है।"
  },
  {
    id: "ph-tr-2",
    category: "TEMPLE_RITUAL",
    hindiDevanagari: "यहाँ वरिष्ठ नागरिकों (बुजुर्गों) के दर्शन के लिए आसान या बिना सीढ़ी वाला रास्ता कहाँ से है?",
    englishTransliteration: "Yahan varishth naagrikon ke darshan ke liye aasan ya bina seedhi wala raasta kahan se hai?",
    englishMeaning: "Where is the accessible ramp, lift, or elder-friendly queue for senior citizens?",
    contextUsage: "Ask temple gate guards at Badrinath or Mansa Devi to avoid steep stair climbs for fathers.",
    audioText: "यहाँ वरिष्ठ नागरिकों के दर्शन के लिए आसान या बिना सीढ़ी वाला रास्ता कहाँ से है?"
  },
  {
    id: "ph-tr-3",
    category: "TEMPLE_RITUAL",
    hindiDevanagari: "शाम की महा आरती का सही समय क्या है और दर्शन की कतार में कब खड़ा होना उचित रहेगा?",
    englishTransliteration: "Shaam ki maha aarti ka sahi samay kya hai aur darshan ki kataar mein kab khada hona uchit rahega?",
    englishMeaning: "What is the exact timing of the evening Aarti, and when should we reach to secure comfortable elder seating?",
    contextUsage: "Confirming darshan cutoff times with priests at Har Ki Pauri or Badrinath.",
    audioText: "शाम की महा आरती का सही समय क्या है और दर्शन की कतार में कब खड़ा होना उचित रहेगा?"
  },
  {
    id: "ph-tr-4",
    category: "TEMPLE_RITUAL",
    hindiDevanagari: "तप्त कुंड में बुजुर्गों के लिए हल्का पवित्र जल छिड़कने की सुरक्षित व्यवस्था कहाँ पर है?",
    englishTransliteration: "Tapt Kund mein bujurgon ke liye halka pavitra jal chhidakne ki surakshit vyavastha kahan par hai?",
    englishMeaning: "Where is the safe, non-slippery spot for seniors to take a holy sprinkle of Tapt Kund's hot spring water?",
    contextUsage: "Prevents elders from slipping on wet thermal steps before temple entry.",
    audioText: "तप्त कुंड में बुजुर्गों के लिए हल्का पवित्र जल छिड़कने की सुरक्षित व्यवस्था कहाँ पर है?"
  },

  // 4. FOOD & SENIOR DIGESTIVE CARE
  {
    id: "ph-fd-1",
    category: "FOOD_SENIOR",
    hindiDevanagari: "भैया, पिताजी के लिए बिना मिर्ची, कम तेल और बिना लहसुन-प्याज की सादी मूँग दाल खिचड़ी मिल जाएगी?",
    englishTransliteration: "Bhaiya, pitaji ke liye bina mirchi, kam tel aur bina lahsun-pyaz ki saadi moong dal khichdi mil jaayegi?",
    englishMeaning: "Brother, can you prepare simple yellow moong dal khichdi with zero chillies, minimal oil, and no onion/garlic for father?",
    contextUsage: "Ordering dinner at mountain dhabas or Badrinath hotels for elder digestive comfort.",
    audioText: "भैया, पिताजी के लिए बिना मिर्ची, कम तेल और बिना लहसुन प्याज की सादी मूंग दाल खिचड़ी मिल जाएगी?"
  },
  {
    id: "ph-fd-2",
    category: "FOOD_SENIOR",
    hindiDevanagari: "भैया, पीने के लिए साफ़ उबला हुआ या हल्का गुनगुना गर्म पानी दे दीजिए।",
    englishTransliteration: "Bhaiya, peene ke liye saaf ubla hua ya halka gunguna garam paani de dijiye.",
    englishMeaning: "Brother, please provide clean boiled or lukewarm drinking water for seniors.",
    contextUsage: "Vital at high altitude to prevent sore throats and digestive infections.",
    audioText: "भैया, पीने के लिए साफ उबला हुआ या हल्का गुनगुना गर्म पानी दे दीजिए।"
  },
  {
    id: "ph-fd-3",
    category: "FOOD_SENIOR",
    hindiDevanagari: "भैया, कड़क अदरक और तुलसी वाली गर्म चाय बना दीजिए, ठण्ड बहुत लग रही है।",
    englishTransliteration: "Bhaiya, kadak adrak aur tulsi wali garam chai bana dijiye, thand bahut lag rahi hai.",
    englishMeaning: "Brother, please brew hot ginger and tulsi tea to warm up against the mountain chill.",
    contextUsage: "At Mana Village tea stall or Pipalkoti pit stop.",
    audioText: "भैया, कड़क अदरक और तुलसी वाली गर्म चाय बना दीजिए, ठंड बहुत लग रही है।"
  },

  // 5. EMERGENCY & MEDICAL ASSISTANCE
  {
    id: "ph-em-1",
    category: "EMERGENCY",
    hindiDevanagari: "यहाँ सबसे नज़दीकी मेडिकल स्टोर या प्राथमिक स्वास्थ्य केंद्र (PHC / Hospital) कहाँ पर है?",
    englishTransliteration: "Yahan sabse nazdeeki medical store ya praathmik swasthya kendra kahan par hai?",
    englishMeaning: "Where is the nearest chemist, medical pharmacy, or primary healthcare center?",
    contextUsage: "Urgent medicine or first-aid requirement.",
    audioText: "यहाँ सबसे नजदीकी मेडिकल स्टोर या प्राथमिक स्वास्थ्य केंद्र कहाँ पर है?"
  },
  {
    id: "ph-em-2",
    category: "EMERGENCY",
    hindiDevanagari: "पिताजी को साँस लेने में भारीपन लग रहा है, क्या यहाँ पोर्टेबल ऑक्सीजन केन या बीपी चेक की सुविधा है?",
    englishTransliteration: "Pitaji ko saans lene mein bhaaripan lag raha hai, kya yahan portable oxygen can ya BP check ki suvidha hai?",
    englishMeaning: "Father feels heaviness in breathing. Is there a portable oxygen canister or Blood Pressure monitor nearby?",
    contextUsage: "High altitude sickness at Badrinath (3,133m).",
    audioText: "पिताजी को सांस लेने में भारीपन लग रहा है, क्या यहाँ पोर्टेबल ऑक्सीजन केन या बीपी चेक की सुविधा है?"
  },
  {
    id: "ph-em-3",
    category: "EMERGENCY",
    hindiDevanagari: "यहाँ पुलिस सहायता बूथ या SDRF आपदा राहत केंद्र कहाँ पर है?",
    englishTransliteration: "Yahan police sahayata booth ya SDRF aapda raahat kendra kahan par hai?",
    englishMeaning: "Where is the local police outpost or SDRF disaster rescue assistance counter?",
    contextUsage: "In case of road blockades, lost items, or route confusion.",
    audioText: "यहाँ पुलिस सहायता बूथ या एसडीआरएफ आपदा राहत केंद्र कहाँ पर है?"
  }
];

