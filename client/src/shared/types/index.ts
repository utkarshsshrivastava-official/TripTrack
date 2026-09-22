// Family and Traveller Roles
export type DuoId = 'DUO_A' | 'DUO_B';
export type FamilyId = DuoId;
export type TravellerRole = 'COORDINATOR' | 'ELDER';

export interface ElderCareNotes {
  dailyMeds: string[];
  altitudeAlertThresholdMeters: number;
  specialCare: string;
}

export interface Traveller {
  id: string;
  duoId: DuoId;
  name: string;
  role: TravellerRole;
  relation: string;
  age: number;
  bloodGroup: string;
  emergencyContact: string;
  avatarColor: string;
  isSeniorCitizen: boolean;
  elderCareNotes?: ElderCareNotes;
}

// Segments and Checkpoints
export type TransitMode = 'TRAIN' | 'CAB_PLAINS' | 'CAB_HILLS' | 'FLIGHT';
export type SegmentStatus = 'UPCOMING' | 'IN_TRANSIT' | 'COMPLETED';

export interface Checkpoint {
  id: string;
  name: string;
  estimatedTime: string;
  done: boolean;
  completedAt?: string;
  elderComfortNote?: string;
}

export interface LogisticsInfo {
  serviceName: string;
  identifier: string;
  driverPhone?: string;
  driverName?: string;
  pickupLocation: string;
  vehicleType?: string;
}

export interface TripSegment {
  id: string;
  title: string;
  origin: string;
  destination: string;
  departureTime: string;
  arrivalTime: string;
  mode: TransitMode;
  status: SegmentStatus;
  logistics: LogisticsInfo;
  elevationMeters: number;
  isHighAltitude: boolean;
  checkpoints: Checkpoint[];
}

// Day Archetypes & Advanced Day Selector Types
export type DayArchetype = 'TRANSIT' | 'SACRED_DARSHAN' | 'SIGHTSEEING_EXPLORE' | 'FLEXIBLE_BUFFER';

export type SightseeingCategory = 'TEMPLE' | 'GHAT_AARTI' | 'NATURE_VIEW' | 'ROPEWAY' | 'HERITAGE' | 'SHOPPING';
export type ElderDifficulty = 'EASY' | 'MODERATE' | 'STEEP';
export type TimeSlot = 'MORNING' | 'AFTERNOON' | 'EVENING' | 'FLEXIBLE';
export type SightseeingLocation = 'HARIDWAR' | 'RISHIKESH' | 'ENROUTE' | 'BADRINATH_MANA' | 'DEHRADUN_MUSSOORIE';

export interface SightseeingSpot {
  id: string;
  name: string;
  hindiName?: string;
  location: SightseeingLocation;
  category: SightseeingCategory;
  elderDifficulty: ElderDifficulty;
  elderComfortTip: string;
  recommendedTimeSlot: TimeSlot;
  durationMinutes: number;
  description: string;
  highlights: string[];
  hasRopewayOrLift?: boolean;
}

export interface CustomActivity {
  id: string;
  dayId: string;
  title: string;
  timeSlot: TimeSlot;
  category: SightseeingCategory;
  elderComfortNote?: string;
  createdAt: string;
}

export interface DayOption {
  id: string; // 'all' or 'day-1', 'day-2', etc.
  dayNumber: number | null;
  dateStr: string;
  dayOfWeek: string;
  destination: string;
  archetype: DayArchetype;
  elevationMeters: number;
  isPeak?: boolean;
  badgeIcon: string;
  weatherOverview: string;
  highlight: string;
  location: SightseeingLocation | 'DURG_NDLS' | 'CIRCUIT';
}

// Haridwar Hill Cab Agency Directory & Inspection Types
export interface CabAgency {
  id: string;
  name: string;
  location: string;
  phone: string;
  alternatePhone?: string;
  whatsapp: string;
  rating: number;
  trustedBadge: string;
  distanceFromStation: string;
  estimatedPricing: {
    ertiga: string;
    innovaCrysta: string;
    scorpio?: string;
  };
  notes: string;
  address: string;
}

export interface HillCabInspectionItem {
  id: string;
  title: string;
  description: string;
  critical: boolean;
  checked: boolean;
}

// Location Tracking & Telemetry
export interface LocationPing {
  id?: string | number;
  passengerId: string;
  latitude: number;
  longitude: number;
  altitudeMeters?: number;
  batteryLevel?: number;
  checkpointName?: string;
  note?: string;
  elderVitalsNote?: string;
  deviceTimestamp: string;
  serverReceivedAt?: string;
  isSynced?: boolean;
}

// Document Vault
export type DocumentCategory =
  | 'ID_CARD'
  | 'TRAIN_TICKET'
  | 'FLIGHT_PASS'
  | 'YATRA_PASS'
  | 'HOTEL_VOUCHER';

export interface TravelDocument {
  id: string;
  title: string;
  category: DocumentCategory;
  fileUrl: string;
  fileType: string;
  passengerId: string;
  parsedData?: {
    pnr?: string;
    seatNumber?: string;
    yatraRegistrationNo?: string;
    validDate?: string;
    destinationOrHotel?: string;
    docType?: string;
  };
  createdAt: string;
  isCachedOffline?: boolean;
}

// Gullak / Shared Expense
export type ExpenseCategory =
  | 'FOOD'
  | 'TOLL_TAXI'
  | 'RITUAL'
  | 'PORTER_DANDI'
  | 'HOTEL'
  | 'MISC';

export type ExpenseSplitMode = 'EQUAL_50_50' | 'CUSTOM_AMOUNTS' | 'FULL_FAMILY_A' | 'FULL_FAMILY_B';

export interface Expense {
  id: string;
  title: string;
  amountINR: number;
  paidBy: string; // Utkarsh, Shreyas, or Multiple
  category: ExpenseCategory;
  receiptUrl?: string;
  createdAt: string;

  // Splitwise-Grade Multi-Payer & Custom Split Fields
  paymentSplits?: {
    utkarshPaidINR: number;
    shreyasPaidINR: number;
  };
  splitMode?: ExpenseSplitMode;
  owedSplits?: {
    utkarshOwesINR: number;
    shreyasOwesINR: number;
  };
}

// Voice Note Feed
export interface VoiceUpdate {
  id: string;
  speakerId: string;
  audioUrl?: string;
  transcription: string;
  summary: string;
  recordedAt: string;
  locationName?: string;
}

// Roadside Rest-Stop & Bio-Break Advisor
export interface RoadsideStop {
  id: string;
  highway: 'DELHI_HARIDWAR_EXPRESSWAY' | 'NH7_HIMALAYAN_HIGHWAY';
  name: string;
  landmark: string;
  distanceFromStartKm: number;
  cleanToiletRating: number; // 1 to 5
  hasWesternWC: boolean;
  isWheelchairFriendly: boolean;
  foodType: string;
  recommendedTreat: string;
  elderComfortNotes: string;
  approxDriveTimeFromOrigin: string;
}

// Temple Darshan & Aarti Timekeeper
export interface SacredRitualSlot {
  id: string;
  dayId: string;
  templeName: string;
  ritualName: string;
  timeWindow: string;
  targetTime: string;
  arriveByTime: string;
  importance: 'HIGH_MANDATORY' | 'RECOMMENDED' | 'OPTIONAL';
  elderSeatingAdvice: string;
  dressCodeAdvice: string;
  location: string;
}

// Day-by-Day Outfit & Weather Dress-Code Advisor
export interface DayOutfitGuidance {
  dayId: string;
  tempRange: string;
  elderWear: string;
  sonsWear: string;
  dayBagEssentials: string[];
  footwear: string;
  specialNote?: string;
}

// Daily Hard Cash vs UPI Advisor
export interface DayCashUpiGuidance {
  dayId: string;
  recommendedCashINR: string;
  upiReliability: 'FULL_UPI' | 'INTERMITTENT' | 'CASH_MANDATORY';
  primaryCashExpenses: string[];
  lastAtmLocation: string;
  denominationTip: string;
}

// Bilingual Driver & Local Voice Phrasebook
export interface TravelPhrase {
  id: string;
  category: 'DRIVER_SAFETY' | 'GARHWALI_LOCAL' | 'TEMPLE_RITUAL' | 'FOOD_SENIOR' | 'EMERGENCY';
  hindiDevanagari: string;
  englishTransliteration: string;
  englishMeaning: string;
  contextUsage: string;
  audioText: string;
  isPahadi?: boolean;
}

export * from './user';


