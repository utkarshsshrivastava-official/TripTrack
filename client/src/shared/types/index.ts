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

export interface Expense {
  id: string;
  title: string;
  amountINR: number;
  paidBy: string; // Utkarsh or Cousin
  category: ExpenseCategory;
  receiptUrl?: string;
  createdAt: string;
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

export * from './user';
