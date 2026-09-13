import { TripSegment } from '../types';

export const TRIP_SEED_SEGMENTS: TripSegment[] = [
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
  {
    id: "seg-2",
    title: "Plains Expressway Transfer",
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
      { id: "cp-2-4", name: "Haridwar Hotel Check-in", estimatedTime: "17:00", done: false, elderComfortNote: "Fathers rest immediately; sons inspect hill cab readiness" }
    ]
  },
  {
    id: "seg-3",
    title: "The Mountain Ascent (NH-7 Highway)",
    origin: "Haridwar",
    destination: "Joshimath",
    departureTime: "2026-09-26T06:00:00+05:30",
    arrivalTime: "2026-09-26T16:00:00+05:30",
    mode: "CAB_HILLS",
    status: "UPCOMING",
    logistics: {
      serviceName: "Dedicated Hill Agency (Innova Crysta / Ertiga)",
      identifier: "UK Commercial Yellow Plate",
      pickupLocation: "Haridwar Hotel Porch",
      driverPhone: "Pre-arranged"
    },
    elevationMeters: 1890,
    isHighAltitude: false,
    checkpoints: [
      { id: "cp-3-1", name: "Early Departure from Haridwar", estimatedTime: "06:00", done: false, elderComfortNote: "Motion sickness tablet 30 min before curves if needed" },
      { id: "cp-3-2", name: "Devprayag Sangam Viewpoint", estimatedTime: "08:30", done: false, elderComfortNote: "Quick photo stop; stretch legs; avoid steep stone steps" },
      { id: "cp-3-3", name: "Srinagar Garhwal Breakfast Halt", estimatedTime: "10:30", done: false, elderComfortNote: "Warm ginger tea & light breakfast" },
      { id: "cp-3-4", name: "Rudraprayag Sangam", estimatedTime: "12:15", done: false },
      { id: "cp-3-5", name: "Karnaprayag / Pipalkoti Lunch", estimatedTime: "14:00", done: false, elderComfortNote: "Hydration check for both fathers" },
      { id: "cp-3-6", name: "Arrival at Joshimath Base Hotel", estimatedTime: "16:00", done: false, elderComfortNote: "Unpack woolens; warm water bath; early acclimatization sleep at 1,890m" }
    ]
  },
  {
    id: "seg-4",
    title: "Badrinath Dham Darshan & Brahma Kapal Rituals",
    origin: "Joshimath",
    destination: "Badrinath Dham & Mana Village",
    departureTime: "2026-09-27T05:30:00+05:30",
    arrivalTime: "2026-09-27T16:00:00+05:30",
    mode: "CAB_HILLS",
    status: "UPCOMING",
    logistics: {
      serviceName: "Dedicated Mountain Cab",
      identifier: "UK-08 / UK-14 Hill Pass",
      pickupLocation: "Joshimath Hotel",
      driverPhone: "Local Driver"
    },
    elevationMeters: 3130,
    isHighAltitude: true,
    checkpoints: [
      { id: "cp-4-1", name: "Morning Drive to Badrinath", estimatedTime: "05:30", done: false, elderComfortNote: "Fathers dressed in layered thermals, monkey caps & windcheaters" },
      { id: "cp-4-2", name: "Brahma Kapal Pind Daan & Tarpan", estimatedTime: "07:30", done: false, elderComfortNote: "Sit on insulated wool mats; perform Pitru Paksha rituals unhurriedly" },
      { id: "cp-4-3", name: "Badrinath Temple Special Darshan", estimatedTime: "10:30", done: false, elderComfortNote: "Use Senior Citizen priority queue or palanquin/dandi if fatigued" },
      { id: "cp-4-4", name: "Mana Village Excursion (Vyas Gufa)", estimatedTime: "13:00", done: false, elderComfortNote: "Optional: purely contingent on fathers' energy levels" },
      { id: "cp-4-5", name: "Descent to Joshimath / Pipalkoti", estimatedTime: "16:00", done: false, elderComfortNote: "Descend to lower elevation (1,890m) for safe, peaceful sleep" }
    ]
  },
  {
    id: "seg-5",
    title: "Unhurried Descent to Rishikesh Foothills",
    origin: "Joshimath / Pipalkoti",
    destination: "Rishikesh",
    departureTime: "2026-09-28T08:30:00+05:30",
    arrivalTime: "2026-09-28T16:30:00+05:30",
    mode: "CAB_HILLS",
    status: "UPCOMING",
    logistics: {
      serviceName: "Dedicated Mountain Cab",
      identifier: "UK Commercial Cab",
      pickupLocation: "Hotel Porch"
    },
    elevationMeters: 372,
    isHighAltitude: false,
    checkpoints: [
      { id: "cp-5-1", name: "Relaxed Morning Descent", estimatedTime: "08:30", done: false, elderComfortNote: "Gentle downhill speed; frequent rest stops" },
      { id: "cp-5-2", name: "Rishikesh Hotel Check-in", estimatedTime: "16:00", done: false, elderComfortNote: "Oxygen levels normalize; relaxing tea" },
      { id: "cp-5-3", name: "Triveni Ghat Evening Ganga Aarti", estimatedTime: "18:00", done: false, elderComfortNote: "Chair seating arranged on ghat for comfortable view" }
    ]
  },
  {
    id: "seg-6",
    title: "Flight Return Journey Home",
    origin: "Dehradun Jolly Grant Airport (DED)",
    destination: "Raipur Airport (RPR) -> Durg",
    departureTime: "2026-10-02T09:00:00+05:30",
    arrivalTime: "2026-10-02T16:00:00+05:30",
    mode: "FLIGHT",
    status: "UPCOMING",
    logistics: {
      serviceName: "Connecting Commercial Flight",
      identifier: "PNR: Cached in App",
      pickupLocation: "DED Airport Departure Bay"
    },
    elevationMeters: 298,
    isHighAltitude: false,
    checkpoints: [
      { id: "cp-6-1", name: "Check-in at DED Airport", estimatedTime: "07:30", done: false, elderComfortNote: "Senior citizen priority check-in & wheelchair escort" },
      { id: "cp-6-2", name: "Flight Transit & Landing at Raipur", estimatedTime: "14:00", done: false, elderComfortNote: "Smooth luggage pickup by sons" },
      { id: "cp-6-3", name: "Safe Arrival at Durg Home", estimatedTime: "18:00", done: false, elderComfortNote: "Badrinath Yatra successfully & comfortably completed!" }
    ]
  }
];
