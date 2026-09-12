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

export class TripTrackDexieDB extends Dexie {
  cachedDocs!: Table<CachedDocRecord, string>;
  queuedPings!: Table<QueuedPingRecord, number>;
  offlineSegments!: Table<OfflineSegmentRecord, string>;
  offlineExpenses!: Table<OfflineExpenseRecord, string>;
  offlineVoiceLogs!: Table<OfflineVoiceRecord, string>;

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
