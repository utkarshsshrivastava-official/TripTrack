export type SpO2Status = 'NORMAL' | 'BORDERLINE' | 'WARNING';

export interface OximeterReading {
  id: string;
  travellerId: string;
  travellerName: string;
  spo2: number;
  pulseBpm: number;
  altitudeMeters?: number;
  locationName?: string;
  status: SpO2Status;
  recordedAt: string;
  notes?: string;
}

export interface MedicationSchedule {
  travellerId: string;
  travellerName: string;
  dailyMeds: string[];
  morningTaken: boolean;
  morningTakenAt?: string;
  eveningTaken: boolean;
  eveningTakenAt?: string;
}

export interface ReliefPost {
  id: string;
  name: string;
  location: string;
  altitudeMeters: number;
  primaryPhone: string;
  altPhone?: string;
  hasOxygenCylinders: boolean;
  hasEmergencyBeds: boolean;
  notes: string;
  distanceFromRishikeshKm: number;
}

export interface OfflineSmsData {
  senderName: string;
  familyName: string;
  locationName: string;
  latitude: number;
  longitude: number;
  altitudeMeters: number;
  batteryLevel: number;
  spo2?: number;
  elderWellbeing: string;
  timestamp: string;
}
