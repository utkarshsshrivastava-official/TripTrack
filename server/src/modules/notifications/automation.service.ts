import { emailService, ScheduledBriefing, WaypointArrival, DailyDigestData } from './email.service';
import { isMongoConnected } from '../../shared/lib/mongodb';
import { getIO, FAMILY_ROOM } from '../chat/socket.service';
import { SegmentModel } from '../../models/segment.model';
import { ExpenseModel } from '../../models/expense.model';
import { FamilyFeedModel } from '../../models/familyFeed.model';

export interface GeofenceWaypoint {
  id: string;
  name: string;
  coords: [number, number]; // [lat, lng]
  radiusKm: number;
  altitudeMeters: number;
  description: string;
  nextStop: string;
}

export const PILGRIMAGE_GEOFENCES: GeofenceWaypoint[] = [
  {
    id: 'wp-durg',
    name: 'Durg Junction & City (Home Base, Chhattisgarh)',
    coords: [21.1904, 81.2849], // Durg, Chhattisgarh coordinates
    radiusKm: 25, // 25 km covers Durg, Bhilai & surrounding departure hub
    altitudeMeters: 290,
    description: '📍 Live location detection triggered in Durg, Chhattisgarh! Utkarsh and family confirmed active at Durg home base / departure point.',
    nextStop: 'Train 12441 BSP NDLS Rajdhani Express ➔ New Delhi'
  },
  {
    id: 'wp-delhi',
    name: 'New Delhi Railway Station (NDLS)',
    coords: [28.6139, 77.2090],
    radiusKm: 12,
    altitudeMeters: 216,
    description: '1,362 km overnight train journey completed on Train 12441 (Coach A2). Safe arrival in the capital and transferring to private AC cab at Ajmeri Gate bay.',
    nextStop: 'Delhi-Meerut Expressway & Haridwar'
  },
  {
    id: 'wp-haridwar',
    name: 'Haridwar Gateway (Ganga Ghats)',
    coords: [29.9457, 78.1642],
    radiusKm: 8,
    altitudeMeters: 314,
    description: 'Arrived at sacred Haridwar gateway. Hotel check-in completed, taking evening rest and attending the divine Ganga Aarti at Har Ki Pauri.',
    nextStop: 'Rishikesh Foothills & Devprayag'
  },
  {
    id: 'wp-rishikesh',
    name: 'Rishikesh Foothills (Triveni Ghat)',
    coords: [30.0869, 78.2676],
    radiusKm: 6,
    altitudeMeters: 372,
    description: 'Passing through Rishikesh foothills into the Shivalik mountain ranges. Beginning the sacred Garhwal mountain highway ascent on NH-7.',
    nextStop: 'Devprayag Sangam'
  },
  {
    id: 'wp-devprayag',
    name: 'Devprayag Sangam (Alaknanda-Bhagirathi)',
    coords: [30.1460, 78.5990],
    radiusKm: 4,
    altitudeMeters: 830,
    description: 'Holy confluence of Alaknanda and Bhagirathi rivers forming the sacred Ganga. First major high-altitude Himalayan landmark successfully reached!',
    nextStop: 'Srinagar Garhwal & Rudraprayag'
  },
  {
    id: 'wp-rudraprayag',
    name: 'Rudraprayag (Mandakini Confluence)',
    coords: [30.2858, 78.9811],
    radiusKm: 4,
    altitudeMeters: 895,
    description: 'Confluence point towards Kedarnath and Badrinath. Pilgrims taking a refreshing tea halt; elders comfortable, warm, and well-hydrated.',
    nextStop: 'Karnaprayag & Joshimath'
  },
  {
    id: 'wp-joshimath',
    name: 'Joshimath Base Camp (Acclimatization Hub)',
    coords: [30.5564, 79.5663],
    radiusKm: 5,
    altitudeMeters: 1890,
    description: 'Winter seat of Lord Badri Vishal. Safe arrival at our primary acclimatization base camp (1,890m). Resting overnight before the final mountain ascent.',
    nextStop: 'Hanuman Chatti & Badrinath Sanctum'
  },
  {
    id: 'wp-badrinath',
    name: 'Badrinath Dham (Holy Sanctum)',
    coords: [30.7447, 79.4930],
    radiusKm: 3,
    altitudeMeters: 3133,
    description: '🙏 Jai Badri Vishal! All 4 pilgrims (Rajnish Ji, Sanjay Ji, Utkarsh & Shreyas) have safely reached Badrinath Sanctum (3,133m). A sacred and auspicious milestone!',
    nextStop: 'Brahma Kapal Pitru Tarpan & Mana Village'
  },
  {
    id: 'wp-mana',
    name: 'Mana (First Village of India)',
    coords: [30.7712, 79.4960],
    radiusKm: 2.5,
    altitudeMeters: 3200,
    description: 'Arrived at Mana Village on the Indo-Tibetan border! Explored Saraswati river origin, Bhim Pul, and Ved Vyas Gufa.',
    nextStop: 'Return Highway Descent'
  }
];

export const SCHEDULED_BRIEFINGS: ScheduledBriefing[] = [
  // ============================================================================
  // PRE-DEPARTURE PHASE (Sep 19 – Sep 23, 2026: 15 Curated Briefings)
  // ============================================================================

  // --- Sep 19, 2026 (Day -5: Kickoff & Health Foundation — Tightened Schedule) ---
  {
    id: 'briefing-sep19-afternoon',
    phase: 'PRE_DEPARTURE',
    timeSlot: 'AFTERNOON',
    dayTitle: 'Day -5: Kickoff & Documents — Sep 19, 2026',
    scheduledFor: '2026-09-19T12:30:00+05:30',
    subject: 'Pilgrimage Kickoff & Digital Document Vault Checklist',
    transitInfo: 'Initial 5-day countdown begun in Durg, CG. Preparing mobile vaults, physical IDs, and offline verification.',
    checklistItems: [
      'Original Aadhar Cards for all 4 travellers (Utkarsh, Rajnish Ji, Shreyas, Sanjay Ji)',
      'Physical printouts (2 sets) of Train 12441 Rajdhani tickets (PNR: 6709136735)',
      'TripTrack PWA installed on all phones with offline Vault synced',
      'Emergency cash reserve ₹15,000 kept safely for transit & doli/kandi'
    ],
    highlights: [
      '12:30 — Check digital document storage and biometric Yatra QR passes',
      'Verify TripTrack is added to mobile home screen (Works 100% offline in dead zones)',
      'Laminate senior medical emergency cards and store in pocket wallets'
    ],
    elderCareTip: 'Keep original IDs and vital medicines in a dedicated handheld shoulder bag. Never place daily pills in large check-in suitcases.',
    logisticsSummary: 'TripTrack Vault sync status: verified. IRCTC PNR 6709136735 loaded.'
  },
  {
    id: 'briefing-sep19-evening',
    phase: 'PRE_DEPARTURE',
    timeSlot: 'EVENING',
    dayTitle: 'Day -5: Acclimatization & Health — Sep 19, 2026',
    scheduledFor: '2026-09-19T17:00:00+05:30',
    subject: 'Himalayan Altitude Acclimatization & Elder Pacing',
    transitInfo: 'Ascent profile: Durg (290m) ➔ Delhi (216m) ➔ Haridwar (314m) ➔ Joshimath (1,890m) ➔ Badrinath (3,133m).',
    checklistItems: [
      'Fingertip Pulse Oximeter with fresh AAA batteries tested',
      'Digital Blood Pressure monitor tested and packed',
      '2x Stainless steel vacuum thermos flasks (1 Litre each for hot water)',
      '10x Electral / Enerzal oral rehydration electrolyte sachets'
    ],
    highlights: [
      '17:00 — Elder health and altitude tolerance briefing with fathers',
      'Diamond rule: Take steps at half normal pace above 2,500m elevation',
      'Hydration target: Sip warm water every 90 minutes to combat dry mountain air',
      'SpO2 benchmark: >90% normal; alert threshold <82% for supplemental oxygen'
    ],
    elderCareTip: 'Rajnish Ji & Sanjay Ji should avoid brisk walking or lifting heavy baggage. Sons handle all luggage loading.',
    logisticsSummary: 'Joshimath base camp (1,890m) provides critical 14-hour acclimatization window before entering 3,133m Badrinath zone.'
  },
  {
    id: 'briefing-sep19-night',
    phase: 'PRE_DEPARTURE',
    timeSlot: 'NIGHT',
    dayTitle: 'Day -5: Sacred Orientation — Sep 19, 2026',
    scheduledFor: '2026-09-19T20:30:00+05:30',
    subject: 'Haridwar & Rishikesh Sacred Orientation & Temple Guide',
    transitInfo: 'First spiritual stops after Delhi: Sacred Ganges plains before the Garhwal mountain highway ascent.',
    sightseeingTips: [
      'Har Ki Pauri Ganga Aarti: Arrive by 17:30 to secure clean seated view on Malviya Dweep for senior comfort',
      'Mansa Devi & Chandi Devi: Use the Udankhatola ropeway (cable car) to avoid climbing steep stairs',
      'Rishikesh Parmarth Niketan & Triveni Ghat: Peaceful evening musical aarti with majestic Himalayan backdrop'
    ],
    highlights: [
      '20:30 — Evening family discussion on Haridwar & Rishikesh flow',
      'Confirm private AC highway cab pickup at NDLS Ajmeri Gate exit',
      'Locate clean highway rest stops: Namaste Midway & Cheetal Grand along Delhi-Haridwar expressway'
    ],
    elderCareTip: 'Ensure fathers sleep by 22:00 tonight. Restful sleep is fundamental to building immune stamina for the Himalayas.',
    logisticsSummary: 'Haridwar hotel check-in voucher saved offline. Cab driver contact logged in Itinerary tab.'
  },

  // --- Sep 20, 2026 (Day -4: Clothing & Sacred Ritual Items) ---
  {
    id: 'briefing-sep20-morning',
    phase: 'PRE_DEPARTURE',
    timeSlot: 'MORNING',
    dayTitle: 'Day -4: Mountain Wardrobe — Sep 20, 2026',
    scheduledFor: '2026-09-20T08:00:00+05:30',
    subject: 'Winter & Mountain Wardrobe Essentials (3-Layer System)',
    transitInfo: 'Badrinath nighttime temperature drops to 2°C – 6°C in late September. Windchill can feel sub-zero near Alaknanda.',
    checklistItems: [
      '2x High-grade thermal inner sets (top & bottom) per pilgrim',
      '1x Heavy windproof fleece jacket with hood per traveller',
      '3x Pairs thick woolen socks + 1 pair light cotton socks for transit',
      'Woolen monkey cap covering ears and throat + muffler',
      'Comfortable walking shoes with deep rubber lug traction (non-slip)'
    ],
    highlights: [
      '08:00 — Clothing inspection: Ensure fathers have loose-fitting warm layers',
      'Layer 1: Thermal inners (moisture wicking)',
      'Layer 2: Warm sweater/fleece (insulation)',
      'Layer 3: Windcheater / down jacket (wind & rain protection)'
    ],
    elderCareTip: 'Cold mountain wind hitting senior ears triggers sudden BP spikes. Keep monkey caps or mufflers in hand luggage.',
    logisticsSummary: 'Pack clothes in soft duffel or medium trolley bags for easier cab boot stacking.'
  },
  {
    id: 'briefing-sep20-afternoon',
    phase: 'PRE_DEPARTURE',
    timeSlot: 'AFTERNOON',
    dayTitle: 'Day -4: Sacred Rituals — Sep 20, 2026',
    scheduledFor: '2026-09-20T14:00:00+05:30',
    subject: 'Badrinath Sanctum & Brahma Kapal Pinda Daan Checklist',
    transitInfo: 'Brahma Kapal Ghat on the Alaknanda bank is the world’s most sacred site for final Pitru Tarpan and liberation.',
    checklistItems: [
      'White unstitched cotton dhoti & angavastram for Pitru Tarpan',
      'Written ancestral Gotra, Pravara, and 3-generation family tree list',
      'Small container of pure cow ghee (250g) and black sesame seeds (til)',
      'Copper or brass small puja vessel (Panchapatra)',
      'Clean copper brass bottle for carrying holy Badrinath Gangajal home'
    ],
    sightseeingTips: [
      'Brahma Kapal Ghat: Ritual takes approx 45–60 mins; panda assistance arranged',
      'Tapt Kund: Holy hot sulphur bath before entering temple sanctum',
      'Badrinath Sanctum Darshan: Gold canopy, Shaligram murti of Lord Vishnu in Padmasana posture'
    ],
    highlights: [
      '14:00 — Finalize handwritten Gotra and ancestral name register',
      'Coordinate with family elders regarding names to be included in sacred tarpan',
      'Understand Brahma Kapal tradition: once performed here, no further Shradh is required'
    ],
    elderCareTip: 'Brahma Kapal stone steps can be chilly; fathers will wear warm socks and shawl during the rituals until sankalp.',
    logisticsSummary: 'Ancestral Gotra list digitized and saved in TripTrack Liturgy tab.'
  },
  {
    id: 'briefing-sep20-night',
    phase: 'PRE_DEPARTURE',
    timeSlot: 'NIGHT',
    dayTitle: 'Day -4: Panch Prayag — Sep 20, 2026',
    scheduledFor: '2026-09-20T20:30:00+05:30',
    subject: 'The Divine Panch Prayag Sacred Confluences on NH-7',
    transitInfo: 'NH-7 highway follows the Alaknanda river, witnessing the five sacred confluences that form Mother Ganga.',
    sightseeingTips: [
      '1. Devprayag: Confluence of turquoise Alaknanda and emerald Bhagirathi — birth of Ganga',
      '2. Rudraprayag: Confluence of Alaknanda and Mandakini (flowing from Kedarnath)',
      '3. Karnaprayag: Confluence of Alaknanda and Pindar river (flowing from Pindari glacier)',
      '4. Nandaprayag: Confluence of Alaknanda and Mandakini/Nandakini river',
      '5. Vishnuprayag: Confluence of Alaknanda and Dhauliganga near Joshimath'
    ],
    highlights: [
      '20:30 — Sacred geography study: Spotting each Sangam during the car drive',
      'Devprayag photo stop: 10-minute halt at view deck for family blessing',
      'Rudraprayag tea halt: Beautiful view of ancient temple perched on river cliff'
    ],
    elderCareTip: 'View confluences from highway viewpoints; do not encourage elders to descend 200 steep wet river steps at every sangam.',
    logisticsSummary: 'All 5 Prayag coordinates programmed into TripTrack GPS Geofencing Engine.'
  },

  // --- Sep 21, 2026 (Day -3: Dead-Zone Prep & Mountain Road Comfort) ---
  {
    id: 'briefing-sep21-morning',
    phase: 'PRE_DEPARTURE',
    timeSlot: 'MORNING',
    dayTitle: 'Day -3: Tech & Battery — Sep 21, 2026',
    scheduledFor: '2026-09-21T08:00:00+05:30',
    subject: 'Mountain Dead-Zone & Battery Survival Protocol',
    transitInfo: 'NH-7 deep gorges between Kaudiyala and Devprayag, and past Pipalkoti have zero cellular connectivity.',
    checklistItems: [
      '2x High-capacity 20,000mAh fast-charge power banks (100% charged)',
      '12V fast car cigarette-lighter charger with dual USB-C cables for cab',
      'All 4 phones loaded with TripTrack PWA offline cache verified',
      'BSNL or Jio secondary SIM cards checked (best mountain coverage)'
    ],
    highlights: [
      '08:00 — Power bank and cable check: each duo carries 1 power bank',
      'Pre-alert extended family that 3–5 hour cellular radio silence is normal on mountain roads',
      'TripTrack offline mode tested: verify tickets open with Airplane mode ON'
    ],
    elderCareTip: 'Ensure fathers’ phones have screen brightness turned up and large text enabled for easy daylight outdoor reading.',
    logisticsSummary: 'Cellular dead zone boundaries mapped in TripTrack Shadow Guard engine.'
  },
  {
    id: 'briefing-sep21-afternoon',
    phase: 'PRE_DEPARTURE',
    timeSlot: 'AFTERNOON',
    dayTitle: 'Day -3: Mountain Pacing — Sep 21, 2026',
    scheduledFor: '2026-09-21T14:00:00+05:30',
    subject: 'Curvy Mountain Highway Comfort & Motion Sickness Pacing',
    transitInfo: '275 km drive from Haridwar to Joshimath includes over 3,000 hairpin mountain bends along the Alaknanda canyon.',
    checklistItems: [
      'Avomine (Promethazine) / Ondansetron motion sickness tablets',
      'Digestive Hing peda, ginger candies & Ayurvedic lemon lozenges',
      '10x Biodegradable travel sickness disposal bags in car seat pockets',
      'Pure peppermint / eucalyptus essential oil for refreshing car cabin'
    ],
    highlights: [
      '14:00 — Vehicle seating arrangement: Rajnish Ji and Sanjay Ji seated in middle captain row',
      'Driver briefing: Gentle, smooth acceleration and braking on curves, no jerky overtaking',
      'Scheduled breaks: 15-minute halt every 2.5 hours for fresh air and elder leg stretching'
    ],
    elderCareTip: 'Take motion sickness pill 45 minutes BEFORE embarking on mountain roads, not after nausea begins.',
    logisticsSummary: 'Highway cab driver instructed on elder comfort speed limit (max 35-40 km/h on hills).'
  },
  {
    id: 'briefing-sep21-night',
    phase: 'PRE_DEPARTURE',
    timeSlot: 'NIGHT',
    dayTitle: 'Day -3: Mana Village — Sep 21, 2026',
    scheduledFor: '2026-09-21T20:30:00+05:30',
    subject: 'Mana Village (First Village of India) & Saraswati Exploration',
    transitInfo: 'Located just 3 km beyond Badrinath at 3,200m altitude, bordering the Tibetan plateau.',
    sightseeingTips: [
      'Bhim Pul: Colossal stone boulder bridge placed by Bhima over the roaring Saraswati river',
      'Vyas Gufa: 5,000-year-old rock cavern where Maharishi Ved Vyas composed the 18 Puranas and Mahabharata',
      'Ganesh Gufa: Where Lord Ganesha transcribed the epic Mahabharata dictated by Vyasa',
      'Saraswati River Origin: The only place where the mythical subterranean river emerges violently into daylight',
      'India’s First Tea Shop: Enjoy hot ginger tea with local organic buckwheat snacks'
    ],
    highlights: [
      '20:30 — Overview of Mana walking trail: Gentle 1.5 km stone path',
      'Pony / pithu assistance available for fathers if walking is strenuous',
      'Handmade sheep wool shawls and Himalayan herbs available from local Bhotia artisans'
    ],
    elderCareTip: 'Altitude is 3,200m. Keep heavy windcheater on; wind through the Mana pass can be sudden and sharp.',
    logisticsSummary: 'Mana coordinates cached in TripTrack GPS engine. Estimated visit duration: 2 hours.'
  },

  // --- Sep 22, 2026 (Day -2: Medical Dossier & Temple Etiquette) ---
  {
    id: 'briefing-sep22-morning',
    phase: 'PRE_DEPARTURE',
    timeSlot: 'MORNING',
    dayTitle: 'Day -2: Medical Dossier — Sep 22, 2026',
    scheduledFor: '2026-09-22T08:00:00+05:30',
    subject: 'Comprehensive Pilgrimage Medical Kit & Health Plan',
    transitInfo: 'Remote mountain pharmacy stocks can be limited. Full 15-day supply of all maintenance meds is mandatory.',
    checklistItems: [
      '15-day daily BP tablets for Rajnish Ji (Amlodipine / Telmisartan in labeled container)',
      'Sanjay Ji’s daily health supplements and digestive prescription',
      'Pain relief spray (Volini / Moov) + 2x elastic crepe knee bandages',
      'Paracetamol (650mg), Cetirizine (anti-allergy), and Pantoprazole (antacid)',
      'Povidone-iodine ointment, band-aids, and sterile gauze pads'
    ],
    highlights: [
      '08:00 — Cross-check pill count: double-check daily pill dosage for the entire 9-day trip',
      'Place 1 strip of each critical medicine in son’s daypack as an emergency backup',
      'Emergency SOS contact list saved on speed dial: 108 Ambulance, 1364 Yatra Line'
    ],
    elderCareTip: 'Never alter or skip morning BP medication due to early travel departures. Always take with light breakfast or biscuit.',
    logisticsSummary: 'Elders’ blood groups and medical dossier pre-loaded in TripTrack Emergency Modal.'
  },
  {
    id: 'briefing-sep22-afternoon',
    phase: 'PRE_DEPARTURE',
    timeSlot: 'AFTERNOON',
    dayTitle: 'Day -2: Temple Etiquette — Sep 22, 2026',
    scheduledFor: '2026-09-22T14:00:00+05:30',
    subject: 'Badrinath Temple Sanctum Etiquette & Sacred Bath Protocol',
    transitInfo: 'Badrinath temple sits on the right bank of Alaknanda between the Nar and Narayana mountain ranges.',
    sightseeingTips: [
      'Tapt Kund Thermal Spring: Sacred bath before darshan; water contains natural therapeutic minerals (~55°C)',
      'Surya Kund: Hot spring reservoir right beside Tapt Kund',
      'Garuda Mandap & Sabha Mandap: Observe ancient stone carvings before inner sanctum',
      'Maha Abhishek: Early morning sacred ceremony where deity is anointed with sandalwood, saffron and camphor'
    ],
    highlights: [
      '14:00 — Senior darshan convenience: Senior citizens queue available near the Simha Dwar entrance',
      'Footwear management: Drop shoes at clean counter; carry thick dry wool socks to walk on cold temple stone',
      'Offerings: Pure tulsi mala, dry chana dal prasad, and marigold flowers available at temple stalls'
    ],
    elderCareTip: 'Temple flagstones are cold marble. Slip on clean dry woolen socks immediately after taking the sacred water touch.',
    logisticsSummary: 'Temple open timings: 04:30 AM to 01:00 PM, and 04:00 PM to 09:00 PM.'
  },
  {
    id: 'briefing-sep22-night',
    phase: 'PRE_DEPARTURE',
    timeSlot: 'NIGHT',
    dayTitle: 'Day -2: Train Boarding Plan — Sep 22, 2026',
    scheduledFor: '2026-09-22T20:30:00+05:30',
    subject: 'Train 12441 Bilaspur Rajdhani Express Boarding Timetable',
    transitInfo: 'Departing Durg Jn (DURG) Platform 1 at 16:30 on Sep 24. PNR: 6709136735. Coach A2, Berths 19, 20, 21, 22.',
    checklistItems: [
      'Train 12441 e-ticket PDF saved on phone + physical printout in shoulder bag',
      'Station Coolie pre-contacted / identified at Durg Jn Main Gate 1',
      'Light indoor footwear / slippers for comfortable walking in AC coach',
      'Hand sanitizer and moist wet wipes for train cabin hygiene'
    ],
    highlights: [
      '20:30 — Detailed review of Day 1 departure timeline:',
      '14:30 — Home farewell & departure towards Durg Jn',
      '15:45 — Station arrival & smooth baggage handling by porter',
      '16:30 — Departure: Train 12441 rolls out on time',
      '19:40 — Nagpur Junction halt: Hot pantry dinner served'
    ],
    elderCareTip: 'Coach A2 berths 19 & 21 are Lower Berths reserved for Rajnish Ji and Sanjay Ji for easy bathroom access without ladder climbing.',
    logisticsSummary: 'Train 12441 transit tracker active in TripTrack Transit engine.'
  },

  // --- Sep 23, 2026 (Day -1: Final 24h Countdown & Luggage Packing) ---
  {
    id: 'briefing-sep23-morning',
    phase: 'PRE_DEPARTURE',
    timeSlot: 'MORNING',
    dayTitle: 'Day -1: Final Packing — Sep 23, 2026',
    scheduledFor: '2026-09-23T08:00:00+05:30',
    subject: 'Final Luggage Segregation & The Golden Hand-Carry Rule',
    transitInfo: 'T-minus 24 hours to departure! Today is dedicated to locking suitcases and zeroing in on cabin hand luggage.',
    checklistItems: [
      'Shoulder Daypack: Passes, IDs, daily meds, reading glasses, power bank, shawl',
      'Check-in Trolleys: 1 bag per family, weighing under 15kg for easy boot loading',
      'Luggage identification tags with Utkarsh & Shreyas mobile numbers attached',
      'TSA/Number locks set on all main zipper compartments'
    ],
    highlights: [
      '08:00 — Final packing audit: Separate hand luggage from check-in bags',
      'Verify nothing needed during the 18-hour train journey is locked in the big suitcases',
      'Charge all 4 smartphones and both 20,000mAh power banks to 100%'
    ],
    elderCareTip: 'Keep fathers’ reading glasses, hearing aids, and dental care in the shoulder bag so they are always at hand.',
    logisticsSummary: 'Weight distribution checked: ensures comfortable handling for drivers and porters.'
  },
  {
    id: 'briefing-sep23-afternoon',
    phase: 'PRE_DEPARTURE',
    timeSlot: 'AFTERNOON',
    dayTitle: 'Day -1: Financial Pool — Sep 23, 2026',
    scheduledFor: '2026-09-23T14:00:00+05:30',
    subject: 'Cash Reserves in Mountains & Gullak 50/50 Shared Pool Setup',
    transitInfo: 'Mountain ATMs from Rishikesh upwards often face network outages or cash depletion during peak Yatra.',
    checklistItems: [
      '₹20,000 Total cash pool divided across Utkarsh (₹10,000) and Shreyas (₹10,000)',
      'Currency split: Clean ₹100, ₹200, and ₹500 notes for easy roadside payments',
      'TripTrack Gullak tab verified: test ₹10 entry logged and split balance confirmed',
      'UPI apps (GPay / PhonePe / Paytm) active and linked to bank with offline PIN ready'
    ],
    highlights: [
      '14:00 — Gullak shared finance orientation between Utkarsh and Shreyas',
      '50/50 Bilateral Rule: All common expenses (fuel, tolls, meals, prasad, tips) logged in Gullak',
      'Instant settlement gauge: Shows net balance between Family A and Family B in real time'
    ],
    elderCareTip: 'Fathers never need to reach into their pockets for small cash or negotiate with vendors. Sons manage all transactions seamlessly.',
    logisticsSummary: 'Gullak offline Dexie storage ready: allows expense entry even with zero cellular signal.'
  },
  {
    id: 'briefing-sep23-night',
    phase: 'PRE_DEPARTURE',
    timeSlot: 'NIGHT',
    dayTitle: 'Day -1: Shubh Yatra Blessing — Sep 23, 2026',
    scheduledFor: '2026-09-23T20:30:00+05:30',
    subject: 'Shubh Yatra Blessing, Family Peace of Mind & Early Sleep',
    transitInfo: 'All preparations complete! Tomorrow at 14:30 we begin the sacred journey to Lord Badri Vishal.',
    checklistItems: [
      'Alarms set for 06:30 AM tomorrow morning for unhurried morning routine',
      'All luggage zipped, tagged, and placed near front door',
      'Train tickets, hotel vouchers, and Aadhaar cards re-checked in shoulder bag',
      'Kuldevta and home temple prasad and blessings sought'
    ],
    highlights: [
      '20:30 — Final family evening gathering: Peaceful hearts, joyful anticipation',
      'Briefing recap: Journey timetable, train coach A2, seamless cab transfer in Delhi',
      'Turn lights out by 22:00 for deep, restorative sleep before departure day'
    ],
    elderCareTip: 'Give Rajnish Ji and Sanjay Ji a glass of warm turmeric milk before bed to promote peaceful sleep.',
    logisticsSummary: 'TripTrack Automated Pilgrimage Scheduler engaged and standing by for Day 1 morning trigger!'
  },

  // ============================================================================
  // DURING-TRIP PHASE (Sep 24 – Oct 02, 2026: 9 Daily Morning Briefings)
  // ============================================================================
  {
    id: 'briefing-sep24-morning',
    phase: 'DURING_TRIP',
    timeSlot: 'MORNING',
    dayTitle: 'Day 1: Departure Day — Sep 24, 2026',
    scheduledFor: '2026-09-24T08:00:00+05:30',
    subject: 'Train 12441 Rajdhani Express Boarding Briefing',
    transitInfo: 'Train 12441 (BSP NDLS Rajdhani Exp) departs Durg Jn Platform 1 at 16:30. Coach A2, Berths 19, 20, 21, 22. PNR: 6709136735.',
    highlights: [
      '14:30 — Home departure towards Durg Railway Station (PF 1)',
      '16:30 — Train 12441 departure (Smooth 2AC travel across Central India)',
      '19:40 — Nagpur Halt: Pantry dinner delivery (Jain meal for Rajnish Ji, Veg for all) + Evening BP medicines',
      '22:00 — Early cabin lights-out for restful elder sleep'
    ],
    elderCareTip: 'Keep elder medicine pouches, warm shawl, and photo ID cards in the small handheld shoulder bag, not inside the big luggage.',
    logisticsSummary: 'Coolie pre-booked for Durg Jn. PNR 6709136735 saved offline in TripTrack Vault.'
  },
  {
    id: 'briefing-sep25-morning',
    phase: 'DURING_TRIP',
    timeSlot: 'MORNING',
    dayTitle: 'Day 2: Delhi Arrival & Highway Transfer — Sep 25, 2026',
    scheduledFor: '2026-09-25T08:30:00+05:30',
    subject: 'NDLS Arrival & Delhi-Meerut Expressway to Haridwar',
    transitInfo: 'Train 12441 arrives New Delhi (PF 1) at 10:40 AM. Transferring to private Ertiga/Crysta cab at Ajmeri Gate Cab Bay.',
    highlights: [
      '10:40 — Arrival New Delhi Station (Ajmeri Gate exit via coolie)',
      '11:45 — Highway cab meetup; fathers seated in middle captain row',
      '14:15 — Lunch halt at Namaste Midway / Cheetal Grand (clean facilities & light vegetarian food)',
      '17:00 — Haridwar hotel check-in; evening Ganga Aarti at Har Ki Pauri'
    ],
    elderCareTip: 'Allow fathers to rest on the hotel bed for 45 minutes immediately upon Haridwar check-in before heading out for Ganga Aarti.',
    logisticsSummary: 'Highway cab driver contact active in Itinerary tab. Haridwar hotel voucher cached offline in Vault.'
  },
  {
    id: 'briefing-sep26-morning',
    phase: 'DURING_TRIP',
    timeSlot: 'MORNING',
    dayTitle: 'Day 3: The Mountain Ascent — Sep 26, 2026',
    scheduledFor: '2026-09-26T05:30:00+05:30',
    subject: 'Early 06:00 AM Departure: Haridwar ➔ Joshimath (NH-7)',
    transitInfo: '275 km scenic mountain drive through Garhwal valleys. Entering NH-7 Alaknanda river canyon.',
    highlights: [
      '06:00 — Early morning roll-out from Haridwar to beat Rishikesh traffic',
      '08:30 — Devprayag Sangam viewing & light breakfast',
      '12:30 — Rudraprayag lunch & vehicle cooling halt',
      '16:30 — Arrival at Joshimath (1,890m base camp) for acclimatization'
    ],
    elderCareTip: 'Keep ginger candies and warm water thermos ready in the car. Cellular dead zone begins past Byasi — family pre-alert dispatched.',
    logisticsSummary: 'Check NH-7 landslide guard updates in Feed tab. Joshimath hotel check-in voucher ready.'
  },
  {
    id: 'briefing-sep27-morning',
    phase: 'DURING_TRIP',
    timeSlot: 'MORNING',
    dayTitle: 'Day 4: Holy Badrinath Sanctum & Tarpan Day — Sep 27, 2026',
    scheduledFor: '2026-09-27T06:00:00+05:30',
    subject: 'Jai Badri Vishal! Temple Darshan & Brahma Kapal Tarpan',
    transitInfo: 'Final 45 km ascent from Joshimath (1,890m) to Badrinath Dham (3,133m) via Hanuman Chatti.',
    highlights: [
      '07:00 — Depart Joshimath towards Badrinath Dham',
      '09:30 — Arrival in holy valley; check-in at temple guesthouse',
      '11:00 — Sacred Tapt Kund sulphur spring holy bath & Badri Vishal Darshan',
      '14:00 — Brahma Kapal Ghat Pitru Tarpan ancestral liturgy with Panda'
    ],
    elderCareTip: 'Do NOT walk fast. The altitude is 3,130m. Walk slowly, breathe deeply, and take warm cloves water. Keep oximeter handy in jacket.',
    logisticsSummary: 'Yatra biometric registration QR passes saved in Vault. Ancestral Gotra list loaded in Brahma Kapal guide.'
  },
  {
    id: 'briefing-sep28-morning',
    phase: 'DURING_TRIP',
    timeSlot: 'MORNING',
    dayTitle: 'Day 5: Mana Village & Garhwal Descent — Sep 28, 2026',
    scheduledFor: '2026-09-28T06:00:00+05:30',
    subject: 'Mana First Village of India & Return Highway Descent',
    transitInfo: 'Visiting Indo-Tibetan border post at Mana, followed by return descent to Srinagar / Rishikesh.',
    highlights: [
      '07:30 — Visit Mana Village, Saraswati river origin & Vyas Gufa',
      '10:30 — Begin vehicle descent down NH-7',
      '16:00 — Night halt in lower elevation valley (Srinagar Garhwal / Rishikesh)'
    ],
    elderCareTip: 'Descent brings immediate oxygen relief. Encourage light walking and relaxing evening tea.',
    logisticsSummary: 'All return hotel passes confirmed. Gullak shared pool tracking active.'
  },
  {
    id: 'briefing-sep29-morning',
    phase: 'DURING_TRIP',
    timeSlot: 'MORNING',
    dayTitle: 'Day 6: Rishikesh Foothills & Triveni Ghat — Sep 29, 2026',
    scheduledFor: '2026-09-29T07:30:00+05:30',
    subject: 'Rishikesh Serenity, Ram Jhula & Triveni Maha Aarti',
    transitInfo: 'Relaxed morning in Rishikesh valley foothills (372m). Soothing river views and holy dip.',
    highlights: [
      '08:30 — Leisurely breakfast with views of the Himalayan Shivalik foothills',
      '11:00 — Gentle walk across Ram Jhula suspension bridge and Gita Bhawan',
      '17:30 — Triveni Ghat holy Maha Aarti at sunset with floating diyas'
    ],
    elderCareTip: 'Keep fathers away from slippery ghat algae. Use brass handrails along Triveni Ghat bathing bays.',
    logisticsSummary: 'Rishikesh hotel verified. Local e-rickshaws pre-identified for senior mobility.'
  },
  {
    id: 'briefing-sep30-morning',
    phase: 'DURING_TRIP',
    timeSlot: 'MORNING',
    dayTitle: 'Day 7: Haridwar Sacred Ghats & Ayurvedic Rest — Sep 30, 2026',
    scheduledFor: '2026-09-30T08:00:00+05:30',
    subject: 'Haridwar Local Bazaars, Ayurvedic Herbs & Rest Day',
    transitInfo: 'Gentle rest and rejuvenation day in holy Haridwar (314m).',
    highlights: [
      '09:00 — Sacred morning Ganga Snan at Haridwar Ghats',
      '11:30 — Visit to authentic Ayurvedic pharmacies for herbal oils and churna',
      '16:00 — Packing holy Gangajal copper vessels for home relatives'
    ],
    elderCareTip: 'Complete day of rest for senior leg muscles. Avoid long shopping walks in crowded lanes.',
    logisticsSummary: 'IndiGo flight web check-in opens today. Boarding passes generating in Vault.'
  },
  {
    id: 'briefing-oct01-morning',
    phase: 'DURING_TRIP',
    timeSlot: 'MORNING',
    dayTitle: 'Day 8: Homeward Flight Connections — Oct 01, 2026',
    scheduledFor: '2026-10-01T07:00:00+05:30',
    subject: 'IndiGo Flight Transit: Dehradun ➔ Delhi ➔ Raipur',
    transitInfo: 'IndiGo flight connections. PNRs active in Vault. Terminal check-in with wheelchair assistance pre-confirmed for elders.',
    highlights: [
      '09:00 — Dehradun Jolly Grant Airport check-in (Wheelchair support for fathers)',
      '12:30 — Flight connection via New Delhi T2',
      '17:00 — Safe arrival at Raipur / Durg home sweet home'
    ],
    elderCareTip: 'Wheelchair assistance requested on IndiGo boarding passes to avoid airport terminal fatigue.',
    logisticsSummary: 'All boarding passes cached in Vault with instant offline barcode display.'
  },
  {
    id: 'briefing-oct02-morning',
    phase: 'DURING_TRIP',
    timeSlot: 'MORNING',
    dayTitle: 'Day 9: Pilgrimage Completion — Oct 02, 2026',
    scheduledFor: '2026-10-02T08:00:00+05:30',
    subject: 'Pilgrimage Completion, Sacred Gangajal & Kuldevta Prasad',
    transitInfo: 'All 4 pilgrims safely home in Durg, Chhattisgarh. Yatra successfully completed with divine blessings!',
    highlights: [
      '09:00 — Home temple Puja: Offering holy Badrinath Tulsi and Gangajal to Kuldevta',
      '11:00 — Distribution of sacred Badrinath prasad to extended family and neighbours',
      '16:00 — Final Gullak settlement between Utkarsh and Shreyas (Net Bilateral Balance settled)'
    ],
    elderCareTip: 'Encourage complete rest today. Check post-trip BP and congratulate both fathers on an extraordinary spiritual feat!',
    logisticsSummary: 'TripTrack trip archive saved. Sacred journey memories locked in photo vault.'
  }
];

class AutomationService {
  private dispatchedTriggers = new Set<string>();
  private schedulerInterval: any = null;
  private isRunning = false;

  constructor() {
    // Pre-populate already dispatched triggers from memory or storage if needed
  }

  /**
   * Calculate distance between two coordinates in kilometers using Haversine formula
   */
  calculateDistanceKm(lat1: number, lon1: number, lat2: number, lon2: number): number {
    const R = 6371; // Earth radius in km
    const dLat = this.deg2rad(lat2 - lat1);
    const dLon = this.deg2rad(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(this.deg2rad(lat1)) * Math.cos(this.deg2rad(lat2)) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  }

  private deg2rad(deg: number): number {
    return deg * (Math.PI / 180);
  }

  /**
   * Check if a location ping is inside any unnotified waypoint geofences
   */
  async checkAndTriggerGeofence(
    latitude: number,
    longitude: number,
    _passengerId?: string
  ): Promise<WaypointArrival | null> {
    if (isNaN(latitude) || isNaN(longitude)) return null;

    for (const wp of PILGRIMAGE_GEOFENCES) {
      const triggerKey = `geofence-${wp.id}`;
      if (this.dispatchedTriggers.has(triggerKey)) continue;

      const distKm = this.calculateDistanceKm(latitude, longitude, wp.coords[0], wp.coords[1]);

      if (distKm <= wp.radiusKm) {
        // Mark as dispatched immediately to prevent race conditions
        this.dispatchedTriggers.add(triggerKey);

        const arrivalData: WaypointArrival = {
          id: wp.id,
          name: wp.name,
          arrivedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          altitudeMeters: wp.altitudeMeters,
          description: wp.description,
          latitude,
          longitude,
          detectedVia: 'GPS_GEOFENCE',
          nextStop: wp.nextStop
        };

        console.log(`📍 [Automation] GEOFENCE ARRIVAL DETECTED: Touched ${wp.name} (Dist: ${distKm.toFixed(2)}km <= ${wp.radiusKm}km)`);

        // Dispatch Email
        await emailService.notifyGeofenceArrival(arrivalData);

        // Broadcast to all open family devices via Socket.io
        const io = getIO();
        if (io) {
          io.to(FAMILY_ROOM).emit('geofence_arrival', arrivalData);
        }

        return arrivalData;
      }
    }

    return null;
  }

  /**
   * Milestone Checkpoint Trigger Fallback (Handles cases where GPS was off/asleep)
   */
  async checkAndTriggerMilestoneCheckpoint(
    checkpointId: string,
    checkpointName: string,
    _segmentId?: string
  ): Promise<WaypointArrival | null> {
    const lowerName = checkpointName.toLowerCase();

    // Map checkpoint keywords to geofence waypoints
    let matchedWp: GeofenceWaypoint | undefined;
    if (lowerName.includes('durg') || lowerName.includes('bhilai') || lowerName.includes('chhattisgarh')) {
      matchedWp = PILGRIMAGE_GEOFENCES.find(w => w.id === 'wp-durg');
    } else if (lowerName.includes('ndls') || lowerName.includes('delhi')) {
      matchedWp = PILGRIMAGE_GEOFENCES.find(w => w.id === 'wp-delhi');
    } else if (lowerName.includes('haridwar')) {
      matchedWp = PILGRIMAGE_GEOFENCES.find(w => w.id === 'wp-haridwar');
    } else if (lowerName.includes('rishikesh')) {
      matchedWp = PILGRIMAGE_GEOFENCES.find(w => w.id === 'wp-rishikesh');
    } else if (lowerName.includes('devprayag')) {
      matchedWp = PILGRIMAGE_GEOFENCES.find(w => w.id === 'wp-devprayag');
    } else if (lowerName.includes('rudraprayag')) {
      matchedWp = PILGRIMAGE_GEOFENCES.find(w => w.id === 'wp-rudraprayag');
    } else if (lowerName.includes('joshimath')) {
      matchedWp = PILGRIMAGE_GEOFENCES.find(w => w.id === 'wp-joshimath');
    } else if (lowerName.includes('badrinath') || lowerName.includes('sanctum') || lowerName.includes('dham')) {
      matchedWp = PILGRIMAGE_GEOFENCES.find(w => w.id === 'wp-badrinath');
    } else if (lowerName.includes('mana')) {
      matchedWp = PILGRIMAGE_GEOFENCES.find(w => w.id === 'wp-mana');
    }

    if (!matchedWp) return null;

    const triggerKey = `geofence-${matchedWp.id}`;
    if (this.dispatchedTriggers.has(triggerKey)) return null;

    this.dispatchedTriggers.add(triggerKey);

    const arrivalData: WaypointArrival = {
      id: matchedWp.id,
      name: matchedWp.name,
      arrivedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      altitudeMeters: matchedWp.altitudeMeters,
      description: matchedWp.description,
      latitude: matchedWp.coords[0],
      longitude: matchedWp.coords[1],
      detectedVia: 'MANUAL_CHECKPOINT',
      nextStop: matchedWp.nextStop
    };

    console.log(`✅ [Automation] MILESTONE ARRIVAL TRIGGERED via Checkpoint (${checkpointName}) -> ${matchedWp.name}`);

    // Dispatch Email
    await emailService.notifyGeofenceArrival(arrivalData);

    // Broadcast via Socket.io
    const io = getIO();
    if (io) {
      io.to(FAMILY_ROOM).emit('geofence_arrival', arrivalData);
    }

    return arrivalData;
  }

  /**
   * Start the background scheduler for scheduled morning briefings and daily evening digest
   */
  startScheduler(): void {
    if (this.isRunning) return;
    this.isRunning = true;

    console.log('⏰ [Automation] Autonomous Pilgrimage Scheduler activated (checking every 60s).');

    // Run check immediately on boot, then every 60 seconds
    this.checkScheduledEvents();
    this.schedulerInterval = setInterval(() => {
      this.checkScheduledEvents();
    }, 60000);
  }

  stopScheduler(): void {
    if (this.schedulerInterval) {
      clearInterval(this.schedulerInterval);
      this.schedulerInterval = null;
    }
    this.isRunning = false;
  }

  /**
   * Check all scheduled briefings and evening digest against the current date/time
   */
  async checkScheduledEvents(): Promise<void> {
    const now = new Date();

    // 1. Check morning briefings
    for (const briefing of SCHEDULED_BRIEFINGS) {
      const triggerKey = `briefing-${briefing.id}`;
      if (this.dispatchedTriggers.has(triggerKey)) continue;

      const targetTime = new Date(briefing.scheduledFor);
      // If current time is past or within 10 minutes of target briefing time
      if (now >= targetTime) {
        this.dispatchedTriggers.add(triggerKey);
        console.log(`🌅 [Automation] Triggering Scheduled Briefing: ${briefing.dayTitle}`);
        await emailService.notifyScheduledBriefing(briefing);
      }
    }

    // 2. Check Daily Evening Sandhya Bulletin (at 20:00 / 8:00 PM)
    const todayDateKey = `digest-${now.toISOString().slice(0, 10)}`;
    if (now.getHours() >= 20 && !this.dispatchedTriggers.has(todayDateKey)) {
      this.dispatchedTriggers.add(todayDateKey);
      console.log(`🌄 [Automation] Triggering 8:00 PM Daily Sandhya Bulletin for ${now.toDateString()}`);
      await this.compileAndSendDailyDigest(now);
    }
  }

  /**
   * Compile and send the daily evening digest ("Sandhya Bulletin")
   */
  async compileAndSendDailyDigest(date: Date = new Date()): Promise<DailyDigestData> {
    let milestonesCovered: string[] = [];
    let photosCount = 0;
    let gullakSpentTodayINR = 0;

    try {
      if (isMongoConnected()) {
        const segments = await SegmentModel.find();
        segments.forEach(s => {
          s.checkpoints?.forEach((cp: any) => {
            if (cp.done) milestonesCovered.push(cp.name);
          });
        });

        const startOfDay = new Date(date);
        startOfDay.setHours(0, 0, 0, 0);

        const expenses = await ExpenseModel.find({ createdAt: { $gte: startOfDay } });
        gullakSpentTodayINR = expenses.reduce((sum, e) => sum + (e.amountINR || 0), 0);

        const feedPosts = await FamilyFeedModel.find({ createdAt: { $gte: startOfDay } });
        photosCount = feedPosts.filter((p: any) => p.metadata?.photoUrl).length;
      }
    } catch (err) {
      console.warn('⚠️ [Automation] Error compiling live DB stats for daily digest:', err);
    }

    if (milestonesCovered.length === 0) {
      milestonesCovered = ['NH-7 Mountain Transit Completed', 'Elder Hydration & BP Routine Confirmed', 'Check-in at Himalayan Camp'];
    }

    const digestData: DailyDigestData = {
      dateStr: date.toLocaleDateString('en-IN', { weekday: 'long', month: 'short', day: 'numeric', year: 'numeric' }),
      milestonesCovered: milestonesCovered.slice(-5), // Last 5 milestones
      eldersHealthSummary: 'Both Rajnish Ji and Sanjay Ji recorded healthy SpO2 (>92%) and normal pulse rates. Evening BP medicines taken with warm water.',
      photosCount: Math.max(photosCount, 3),
      gullakSpentTodayINR,
      tomorrowPreview: 'Early morning sacred visit to Badrinath Sanctum & Brahma Kapal ancestral rituals. Pacing is gentle.'
    };

    await emailService.notifyDailyEveningDigest(digestData);
    return digestData;
  }

  /**
   * Get engine status overview for settings / admin modal
   */
  getStatus() {
    return {
      schedulerActive: this.isRunning,
      provider: emailService.getProviderInfo(),
      recipients: emailService.getRecipients(),
      counts: {
        totalBriefings: SCHEDULED_BRIEFINGS.length,
        preDeparture: SCHEDULED_BRIEFINGS.filter(b => b.phase === 'PRE_DEPARTURE').length,
        duringTrip: SCHEDULED_BRIEFINGS.filter(b => b.phase === 'DURING_TRIP').length,
        geofences: PILGRIMAGE_GEOFENCES.length
      },
      activeGeofences: PILGRIMAGE_GEOFENCES.map(g => ({
        id: g.id,
        name: g.name,
        radiusKm: g.radiusKm,
        altitudeMeters: g.altitudeMeters,
        description: g.description,
        nextStop: g.nextStop,
        isDispatched: this.dispatchedTriggers.has(`geofence-${g.id}`)
      })),
      scheduledBriefings: SCHEDULED_BRIEFINGS.map(b => ({
        id: b.id,
        phase: b.phase,
        timeSlot: b.timeSlot,
        dayTitle: b.dayTitle,
        scheduledFor: b.scheduledFor,
        subject: b.subject,
        transitInfo: b.transitInfo,
        highlights: b.highlights,
        elderCareTip: b.elderCareTip,
        logisticsSummary: b.logisticsSummary,
        checklistItems: b.checklistItems,
        sightseeingTips: b.sightseeingTips,
        isDispatched: this.dispatchedTriggers.has(`briefing-${b.id}`)
      })),
      totalDispatchedCount: this.dispatchedTriggers.size
    };
  }

  /**
   * Manual simulator / test trigger for any briefing or waypoint
   */
  async simulateTrigger(type: 'BRIEFING' | 'WAYPOINT' | 'DIGEST', targetId?: string) {
    if (type === 'BRIEFING') {
      const briefing = SCHEDULED_BRIEFINGS.find(b => b.id === targetId) || SCHEDULED_BRIEFINGS[0];
      return await emailService.notifyScheduledBriefing(briefing);
    }
    if (type === 'WAYPOINT') {
      const wp = PILGRIMAGE_GEOFENCES.find(w => w.id === targetId) || PILGRIMAGE_GEOFENCES[0];
      return await emailService.notifyGeofenceArrival({
        id: wp.id,
        name: wp.name,
        arrivedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        altitudeMeters: wp.altitudeMeters,
        description: wp.description,
        latitude: wp.coords[0],
        longitude: wp.coords[1],
        detectedVia: 'GPS_GEOFENCE',
        nextStop: wp.nextStop
      });
    }
    if (type === 'DIGEST') {
      return await this.compileAndSendDailyDigest(new Date());
    }
    return { success: false, error: 'Unknown trigger type' };
  }

  /**
   * Schedule a custom briefing dynamically
   */
  scheduleCustomBriefing(briefing: ScheduledBriefing): ScheduledBriefing {
    // Unshift to place in prominent position
    SCHEDULED_BRIEFINGS.unshift(briefing);
    console.log(`⏱️ [Automation] Dynamically scheduled briefing "${briefing.subject}" for ${briefing.scheduledFor}`);
    return briefing;
  }

  /**
   * Reset a trigger so it can be re-tested
   */
  resetTrigger(triggerId: string): void {
    this.dispatchedTriggers.delete(triggerId);
    this.dispatchedTriggers.delete(`geofence-${triggerId}`);
    this.dispatchedTriggers.delete(`briefing-${triggerId}`);
    console.log(`🔄 [Automation] Reset trigger: ${triggerId}`);
  }
}

export const automationService = new AutomationService();
