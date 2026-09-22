import { Request, Response } from 'express';
import { SegmentModel } from '../../models/segment.model';
import { TravellerModel } from '../../models/traveller.model';
import { TRAVELLERS_CONFIG } from '../../shared/config/travellers.config';
import { isMongoConnected } from '../../shared/lib/mongodb';

// Default static pilgrimage segments for initial database hydration
export const SEED_SEGMENTS = [
  // Day 1: Sep 24
  {
    id: "seg-1",
    title: "Overnight Train Transit to Capital",
    origin: "Durg Junction (DURG)",
    destination: "New Delhi Railway Station (NDLS)",
    departureTime: new Date("2026-09-24T16:30:00+05:30"),
    arrivalTime: new Date("2026-09-25T10:40:00+05:30"),
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
    departureTime: new Date("2026-09-25T11:45:00+05:30"),
    arrivalTime: new Date("2026-09-25T17:00:00+05:30"),
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
    departureTime: new Date("2026-09-26T05:30:00+05:30"),
    arrivalTime: new Date("2026-09-26T17:30:00+05:30"),
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
    departureTime: new Date("2026-09-27T05:30:00+05:30"),
    arrivalTime: new Date("2026-09-27T18:00:00+05:30"),
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
    departureTime: new Date("2026-09-28T07:00:00+05:30"),
    arrivalTime: new Date("2026-09-28T17:30:00+05:30"),
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
    departureTime: new Date("2026-09-29T08:30:00+05:30"),
    arrivalTime: new Date("2026-09-29T20:30:00+05:30"),
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
    departureTime: new Date("2026-09-30T09:00:00+05:30"),
    arrivalTime: new Date("2026-09-30T20:30:00+05:30"),
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
    departureTime: new Date("2026-10-01T09:30:00+05:30"),
    arrivalTime: new Date("2026-10-01T19:30:00+05:30"),
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
    departureTime: new Date("2026-10-02T13:15:00+05:30"),
    arrivalTime: new Date("2026-10-02T18:10:00+05:30"),
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

export async function initSeedData(req: Request, res: Response): Promise<void> {
  try {
    const isConnected = isMongoConnected();
    const force = req.query.force === 'true';

    if (!isConnected) {
      // In offline/mock mode, return static segments immediately
      res.json({
        success: true,
        mode: 'mock_memory',
        message: 'MongoDB not connected; returning memory seed data.',
        seededCount: SEED_SEGMENTS.length,
        segments: SEED_SEGMENTS
      });
      return;
    }

    const existingCount = await SegmentModel.countDocuments();

    if (existingCount > 0 && !force) {
      const existing = await SegmentModel.find().sort({ departureTime: 1 });
      res.json({
        success: true,
        mode: 'mongodb',
        message: `Database already seeded with ${existingCount} segments.`,
        seededCount: existingCount,
        segments: existing
      });
      return;
    }

    if (force) {
      await SegmentModel.deleteMany({});
      await TravellerModel.deleteMany({});
    }

    const created = await SegmentModel.insertMany(SEED_SEGMENTS);

    const existingTravellers = await TravellerModel.countDocuments();
    if (existingTravellers === 0) {
      await TravellerModel.insertMany(TRAVELLERS_CONFIG);
    }

    res.json({
      success: true,
      mode: 'mongodb',
      message: `Successfully seeded segments and travellers into MongoDB Atlas.`,
      seededCount: created.length,
      segments: created
    });
  } catch (err: any) {
    res.status(500).json({
      success: false,
      error: err.message || 'Failed to seed database'
    });
  }
}
