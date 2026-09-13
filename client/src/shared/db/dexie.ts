import Dexie, { Table } from 'dexie';
import { LocationPing, TripSegment, ExpenseCategory } from '../types';

export interface CachedDocRecord {
  id: string;
  title: string;
  category: string;
  passengerId: string;
  blobData?: Blob;
  dataUrl?: string;
  mimeType: string;
  parsedData?: any;
  updatedAt: number;
}

export interface QueuedPingRecord extends Omit<LocationPing, 'id'> {
  id?: number;
  retryCount?: number;
}

export interface OfflineSegmentRecord {
  id: string;
  segmentData: TripSegment;
  modifiedLocallyAt: number;
}

export interface OfflineExpenseRecord {
  id: string;
  title: string;
  amountINR: number;
  paidBy: string;
  category: ExpenseCategory;
  receiptUrl?: string;
  createdAt: string;
  isSynced?: boolean;
}

export interface OfflineVoiceRecord {
  id: string;
  speakerId: string;
  audioBlob?: Blob;
  audioUrl?: string;
  transcription: string;
  summary: string;
  recordedAt: string;
  locationName?: string;
  isSynced?: boolean;
}

export interface OfflineChatMessageRecord {
  id: string;
  senderId: string;
  senderName: string;
  senderAvatarColor: string;
  senderType: 'PILGRIM' | 'GUEST';
  senderDuo?: string;
  text: string;
  timestamp: string;
  status: 'queued' | 'sent' | 'delivered';
}

export interface OfflineOximeterRecord {
  id: string;
  travellerId: string;
  spo2: number;
  pulseBpm: number;
  altitudeMeters?: number;
  locationName?: string;
  notes?: string;
  recordedAt: string;
  isSynced?: boolean;
}

export interface OfflineMedicationRecord {
  id: string;
  travellerId: string;
  date: string; // YYYY-MM-DD
  timeSlot: 'MORNING' | 'EVENING';
  medicationName: string;
  takenAt: string;
  takenByUserName: string;
}

export interface OfflineTravellerRecord {
  id: string;
  duoId: 'DUO_A' | 'DUO_B';
  name: string;
  role: 'COORDINATOR' | 'ELDER';
  relation: string;
  age: number;
  bloodGroup: string;
  emergencyContact: string;
  avatarColor: string;
  isSeniorCitizen: boolean;
  elderCareNotes?: {
    dailyMeds: string[];
    altitudeAlertThresholdMeters: number;
    specialCare: string;
  };
  updatedAt?: number;
}

export class TripTrackDexieDB extends Dexie {
  cachedDocs!: Table<CachedDocRecord, string>;
  queuedPings!: Table<QueuedPingRecord, number>;
  offlineSegments!: Table<OfflineSegmentRecord, string>;
  offlineExpenses!: Table<OfflineExpenseRecord, string>;
  offlineVoiceLogs!: Table<OfflineVoiceRecord, string>;
  offlineChatMessages!: Table<OfflineChatMessageRecord, string>;
  oximeterLogs!: Table<OfflineOximeterRecord, string>;
  medicationLogs!: Table<OfflineMedicationRecord, string>;
  travellers!: Table<OfflineTravellerRecord, string>;

  constructor() {
    super('TripTrackDB');
    this.version(1).stores({
      cachedDocs: 'id, passengerId, category, updatedAt',
      queuedPings: '++id, passengerId, deviceTimestamp',
      offlineSegments: 'id, modifiedLocallyAt'
    });
    this.version(2).stores({
      cachedDocs: 'id, passengerId, category, updatedAt',
      queuedPings: '++id, passengerId, deviceTimestamp',
      offlineSegments: 'id, modifiedLocallyAt',
      offlineExpenses: 'id, category, paidBy, createdAt',
      offlineVoiceLogs: 'id, speakerId, recordedAt'
    });
    this.version(3).stores({
      cachedDocs: 'id, passengerId, category, updatedAt',
      queuedPings: '++id, passengerId, deviceTimestamp',
      offlineSegments: 'id, modifiedLocallyAt',
      offlineExpenses: 'id, category, paidBy, createdAt',
      offlineVoiceLogs: 'id, speakerId, recordedAt',
      offlineChatMessages: 'id, senderId, senderName, timestamp, status'
    });
    this.version(4).stores({
      cachedDocs: 'id, passengerId, category, updatedAt',
      queuedPings: '++id, passengerId, deviceTimestamp',
      offlineSegments: 'id, modifiedLocallyAt',
      offlineExpenses: 'id, category, paidBy, createdAt',
      offlineVoiceLogs: 'id, speakerId, recordedAt',
      offlineChatMessages: 'id, senderId, senderName, timestamp, status',
      oximeterLogs: 'id, travellerId, recordedAt, spo2',
      medicationLogs: 'id, travellerId, date, timeSlot'
    });
    this.version(5).stores({
      cachedDocs: 'id, passengerId, category, updatedAt',
      queuedPings: '++id, passengerId, deviceTimestamp',
      offlineSegments: 'id, modifiedLocallyAt',
      offlineExpenses: 'id, category, paidBy, createdAt',
      offlineVoiceLogs: 'id, speakerId, recordedAt',
      offlineChatMessages: 'id, senderId, senderName, timestamp, status',
      oximeterLogs: 'id, travellerId, recordedAt, spo2',
      medicationLogs: 'id, travellerId, date, timeSlot',
      travellers: 'id, duoId, role, name, isSeniorCitizen'
    });
  }
}

export const localDB = new TripTrackDexieDB();

// Helper to flush queued pings when connectivity returns
export async function flushQueuedPings(apiBaseUrl: string = ''): Promise<{ flushedCount: number; error?: string }> {
  try {
    const pendingPings = await localDB.queuedPings.toArray();
    if (!pendingPings || pendingPings.length === 0) {
      return { flushedCount: 0 };
    }

    const response = await fetch(`${apiBaseUrl}/api/tracking/bulk-ping`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ pings: pendingPings })
    });

    if (response.ok) {
      const pingIds = pendingPings.map(p => p.id!).filter(Boolean);
      await localDB.queuedPings.bulkDelete(pingIds);
      return { flushedCount: pingIds.length };
    } else {
      return { flushedCount: 0, error: `Server responded with ${response.status}` };
    }
  } catch (err: any) {
    return { flushedCount: 0, error: err.message || 'Network offline' };
  }
}
