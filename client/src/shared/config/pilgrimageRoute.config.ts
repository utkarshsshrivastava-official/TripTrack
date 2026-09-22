/**
 * Central Configuration for Badrinath Pilgrimage Route (NH-7 Corridor)
 * Waypoints, Confluences, Cellular Dead-Zones, and Elevation Milestones
 */

export interface PilgrimageWaypoint {
  id: string;
  name: string;
  hindiName: string;
  coords: [number, number];
  altitudeMeters: number;
  distanceFromHaridwarKm: number;
  highlight?: boolean;
  isPrayag?: boolean;
  desc: string;
  sacredSignificance: string;
  elderCareTip: string;
}

export interface CellularDeadZone {
  id: string;
  name: string;
  fromName: string;
  toName: string;
  lengthKm: number;
  coords: [number, number][];
  severity: 'COMPLETE_BLACKOUT' | 'WEAK_2G';
  reassuranceNote: string;
}

export const PILGRIMAGE_WAYPOINTS: PilgrimageWaypoint[] = [
  {
    id: 'wp-haridwar',
    name: 'Haridwar (Ganga Aarti)',
    hindiName: 'हरिद्वार (हर की पौड़ी)',
    coords: [29.9457, 78.1642],
    altitudeMeters: 314,
    distanceFromHaridwarKm: 0,
    desc: 'Plains gateway; sacred Ganga bathing ghats & evening Maha Aarti.',
    sacredSignificance: 'Where the Ganga leaves the mountains and enters the plains. Drops of Amrit fell here during Samudra Manthan.',
    elderCareTip: 'Flat ground; e-rickshaws available to Har Ki Pauri. Rest well before morning mountain drive.'
  },
  {
    id: 'wp-rishikesh',
    name: 'Rishikesh (Triveni Ghat)',
    hindiName: 'ऋषिकेश (त्रिवेणी घाट)',
    coords: [30.0869, 78.2676],
    altitudeMeters: 372,
    distanceFromHaridwarKm: 25,
    desc: 'Foothills transition before NH-7 mountain ascent.',
    sacredSignificance: 'Confluence of Ganga, Yamuna, and Saraswati in subtle form. Meditated upon by Lord Rama and sages.',
    elderCareTip: 'Last major town with large commercial pharmacies and multi-specialty hospitals (AIIMS Rishikesh).'
  },
  {
    id: 'wp-devprayag',
    name: 'Devprayag (First Prayag)',
    hindiName: 'देवप्रयाग (प्रथम प्रयाग)',
    coords: [30.1460, 78.5990],
    altitudeMeters: 830,
    distanceFromHaridwarKm: 95,
    highlight: true,
    isPrayag: true,
    desc: 'Birthplace of holy Ganga; sacred confluence of Alaknanda & Bhagirathi.',
    sacredSignificance: 'Alaknanda (calm & deep) merges with Bhagirathi (rushing & turquoise) to officially become the Ganga River.',
    elderCareTip: 'Viewing deck by the road is elder-friendly. Steep stairs lead to the sangam; viewing from suspension bridge recommended for fathers.'
  },
  {
    id: 'wp-srinagar',
    name: 'Srinagar (Garhwal Valley)',
    hindiName: 'श्रीनगर (गढ़वाल घाटी)',
    coords: [30.2223, 78.7845],
    altitudeMeters: 560,
    distanceFromHaridwarKm: 130,
    desc: 'Broad valley rest halt, fuel depot, and Government Medical College.',
    sacredSignificance: 'Ancient capital of Garhwal kingdom; revered Kamleshwar Mahadev temple where Lord Rama offered 1,000 lotus flowers.',
    elderCareTip: 'Ideal lunch halt with air-conditioned dhabas, clean restrooms, and reliable 4G mobile signal.'
  },
  {
    id: 'wp-rudraprayag',
    name: 'Rudraprayag (Second Prayag)',
    hindiName: 'रुद्रप्रयाग (द्वितीय प्रयाग)',
    coords: [30.2858, 78.9811],
    altitudeMeters: 895,
    distanceFromHaridwarKm: 165,
    highlight: true,
    isPrayag: true,
    desc: 'Confluence of Alaknanda and Mandakini (flowing from Kedarnath).',
    sacredSignificance: 'Lord Shiva manifested in his Rudra form to bless Sage Narada with music mastery. Highway junction to Kedarnath.',
    elderCareTip: 'Good spot for motion sickness relief; steep valley switchbacks begin after Rudraprayag.'
  },
  {
    id: 'wp-karnaprayag',
    name: 'Karnaprayag (Third Prayag)',
    hindiName: 'कर्णप्रयाग (तृतीय प्रयाग)',
    coords: [30.2589, 79.2192],
    altitudeMeters: 1450,
    distanceFromHaridwarKm: 196,
    isPrayag: true,
    desc: 'Confluence of Alaknanda and Pindar River (flowing from Pindari Glacier).',
    sacredSignificance: 'Mahabharata warrior Karna did severe penance to Sun God Surya here and received impregnable Kavach and Kundal.',
    elderCareTip: 'Altitude begins to climb above 1,400m. Ensure warm jackets are accessible; stay hydrated.'
  },
  {
    id: 'wp-nandaprayag',
    name: 'Nandaprayag (Fourth Prayag)',
    hindiName: 'नन्दप्रयाग (चतुर्थ प्रयाग)',
    coords: [30.3308, 79.3195],
    altitudeMeters: 1358,
    distanceFromHaridwarKm: 218,
    isPrayag: true,
    desc: 'Confluence of Alaknanda and Nandakini River.',
    sacredSignificance: 'Named after King Nanda (foster father of Lord Krishna) who performed grand Yagna here.',
    elderCareTip: 'Quiet ghats with gentle water flow; good 15-minute leg-stretch break before Pipalkoti.'
  },
  {
    id: 'wp-pipalkoti',
    name: 'Pipalkoti (Roadside Halt)',
    hindiName: 'पीपलकोटी',
    coords: [30.4297, 79.4312],
    altitudeMeters: 1259,
    distanceFromHaridwarKm: 235,
    desc: 'Midway tea stop & vehicle check before the major Joshimath climb.',
    sacredSignificance: 'Scenic mountain hamlet sheltered by terraced valleys and deodar forests.',
    elderCareTip: 'Have warm tea / soup; check cab tire pressures and cooling before high-ascent climb to Joshimath.'
  },
  {
    id: 'wp-joshimath',
    name: 'Joshimath (Acclimatization Base)',
    hindiName: 'जोशीमठ (ज्योतिर्मठ)',
    coords: [30.5564, 79.5663],
    altitudeMeters: 1890,
    distanceFromHaridwarKm: 270,
    highlight: true,
    desc: 'Winter seat of Badrinath; key high-altitude acclimatization base.',
    sacredSignificance: 'First northern Peetham established by Adi Shankaracharya in 8th century. Home to 2,500-year-old Kalpavriksha tree.',
    elderCareTip: 'MANDATORY ACCLIMATIZATION: Sleep here to adapt. Drink warm water; avoid heavy fried foods; take BP meds on schedule.'
  },
  {
    id: 'wp-vishnuprayag',
    name: 'Vishnuprayag (Fifth Prayag)',
    hindiName: 'विष्णुप्रयाग (पंचम प्रयाग)',
    coords: [30.5645, 79.5712],
    altitudeMeters: 1372,
    distanceFromHaridwarKm: 282,
    isPrayag: true,
    desc: 'Confluence of Alaknanda and swirling turquoise Dhauliganga.',
    sacredSignificance: 'Sage Narada worshipped Lord Vishnu here. Completion of the holy Panch Prayag circuit.',
    elderCareTip: 'Deep, dramatic river gorge with massive suspension bridge. Roaring sound of waters — spectacular from the roadside.'
  },
  {
    id: 'wp-govindghat',
    name: 'Govindghat',
    hindiName: 'गोविन्दघाट',
    coords: [30.6258, 79.5615],
    altitudeMeters: 1828,
    distanceFromHaridwarKm: 290,
    desc: 'Gateway to Valley of Flowers and Hemkund Sahib.',
    sacredSignificance: 'Confluence of Alaknanda and Bhyundar Ganga; major pilgrim transit center.',
    elderCareTip: 'Road narrows into single-lane mountain shelf. Follow vehicle convoy discipline.'
  },
  {
    id: 'wp-pandukeshwar',
    name: 'Pandukeshwar (Yog Dhyan Badri)',
    hindiName: 'पांडुकेश्वर (योग ध्यान बद्री)',
    coords: [30.6397, 79.5490],
    altitudeMeters: 1829,
    distanceFromHaridwarKm: 294,
    desc: 'Ancient temple dedicated to King Pandu and Yog Dhyan Badri.',
    sacredSignificance: 'King Pandu meditated here to atone for sins, and the Pandavas were born nearby. Winter sanctuary for Utsav Murti of Badrinath.',
    elderCareTip: 'Temple is very close to main road with very few steps. Very elder-friendly darshan.'
  },
  {
    id: 'wp-hanuman-chatti',
    name: 'Hanuman Chatti (Barrier)',
    hindiName: 'हनुमान चट्टी (चेकपोस्ट)',
    coords: [30.6974, 79.5078],
    altitudeMeters: 2400,
    distanceFromHaridwarKm: 305,
    highlight: true,
    desc: 'High-Altitude Acclimatization barrier (>2,000m threshold).',
    sacredSignificance: 'Where Lord Hanuman humbled Bhima\'s pride by testing his strength with his tail in the Mahabharata.',
    elderCareTip: 'ALTITUDE ALERT: Crossing 2,400m. Air gets noticeably thinner. Sip warm water, put on warm woolen caps, and avoid rapid walking.'
  },
  {
    id: 'wp-badrinath',
    name: 'Badrinath Dham (Sanctum)',
    hindiName: 'श्री बद्रीनाथ धाम (मुख्य मंदिर)',
    coords: [30.7447, 79.4930],
    altitudeMeters: 3130,
    distanceFromHaridwarKm: 318,
    highlight: true,
    desc: 'Main Temple Sanctum, Tapt Kund natural hot springs, & Brahma Kapal.',
    sacredSignificance: 'One of the supreme Char Dhams. Lord Vishnu meditated here while Goddess Lakshmi sheltered him as a Badri (jujube) tree.',
    elderCareTip: '3,130m elevation! Walk at half speed; rest every 20 paces; keep head and ears covered. Wheelchair/doli available at temple entrance.'
  },
  {
    id: 'wp-mana',
    name: 'Mana Village (First Indian Village)',
    hindiName: 'माणा गाँव (भारत का प्रथम गाँव)',
    coords: [30.7712, 79.4960],
    altitudeMeters: 3200,
    distanceFromHaridwarKm: 322,
    highlight: true,
    desc: 'Indo-Tibetan border village, Saraswati river origin, Vyas Gufa, & Bhim Pul.',
    sacredSignificance: 'Veda Vyasa composed the Mahabharata in Vyas Gufa. Saraswati River emerges with thunderous roar and disappears underground.',
    elderCareTip: 'Highest point of yatra (3,200m). Slope up to Vyas Gufa is cobblestone; take walking sticks and pace slowly with fathers.'
  }
];

export const CELLULAR_DEAD_ZONES: CellularDeadZone[] = [
  {
    id: 'dz-byasi-devprayag',
    name: 'Byasi to Devprayag Gorge',
    fromName: 'Byasi',
    toName: 'Devprayag',
    lengthKm: 35,
    coords: [
      [30.0869, 78.4000],
      [30.1100, 78.4800],
      [30.1460, 78.5990]
    ],
    severity: 'COMPLETE_BLACKOUT',
    reassuranceNote: 'Deep Alaknanda canyon walls block cellular towers for ~1.5 hours. Normal topographical silence.'
  },
  {
    id: 'dz-sirobagarh',
    name: 'Sirobagarh Zone (Srinagar - Rudraprayag)',
    fromName: 'Srinagar Bypass',
    toName: 'Rudraprayag',
    lengthKm: 14,
    coords: [
      [30.2223, 78.7845],
      [30.2500, 78.8800],
      [30.2858, 78.9811]
    ],
    severity: 'WEAK_2G',
    reassuranceNote: 'Landslide-prone river bend where cell towers frequently switch to weak 2G or fail.'
  },
  {
    id: 'dz-govindghat-badrinath',
    name: 'Govindghat to Badrinath Canyon',
    fromName: 'Govindghat',
    toName: 'Hanuman Chatti',
    lengthKm: 22,
    coords: [
      [30.6258, 79.5615],
      [30.6600, 79.5300],
      [30.6974, 79.5078],
      [30.7447, 79.4930]
    ],
    severity: 'COMPLETE_BLACKOUT',
    reassuranceNote: 'Extreme high-altitude canyon; zero internet for ~2 hours until reaching Badrinath town WiFi / 4G.'
  }
];
