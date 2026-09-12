import { localDB, OfflineSegmentRecord } from '../../../shared/db/dexie';
import { TRIP_SEED_SEGMENTS } from '../../../shared/config/trip.config';
import { TripSegment, SegmentStatus, LogisticsInfo } from '../../../shared/types';

/**
 * Initialize Dexie with Seed Segments if empty
 */
export async function initializeItineraryStorage(): Promise<TripSegment[]> {
  try {
    const existingCount = await localDB.offlineSegments.count();
    if (existingCount === 0) {
      const records: OfflineSegmentRecord[] = TRIP_SEED_SEGMENTS.map(seg => ({
        id: seg.id,
        segmentData: seg,
        modifiedLocallyAt: Date.now()
      }));
      await localDB.offlineSegments.bulkAdd(records);
      console.log(`🧭 [Dexie Itinerary] Initialized ${records.length} trip segments in offline store.`);
      return TRIP_SEED_SEGMENTS;
    }

    const savedRecords = await localDB.offlineSegments.toArray();
    return savedRecords.map(r => r.segmentData);
  } catch (err) {
    console.warn('⚠️ [Dexie Itinerary] Failed to access IndexedDB, falling back to static seeds', err);
    return TRIP_SEED_SEGMENTS;
  }
}

/**
 * Fetch all segments from Dexie
 */
export async function getSegmentsFromDexie(): Promise<TripSegment[]> {
  try {
    const records = await localDB.offlineSegments.toArray();
    if (!records || records.length === 0) {
      return await initializeItineraryStorage();
    }
    return records.map(r => r.segmentData);
  } catch (err) {
    console.error('Failed to get segments from Dexie', err);
    return TRIP_SEED_SEGMENTS;
  }
}

/**
 * Persist entire segment data in Dexie
 */
export async function saveSegmentToDexie(segment: TripSegment): Promise<void> {
  await localDB.offlineSegments.put({
    id: segment.id,
    segmentData: segment,
    modifiedLocallyAt: Date.now()
  });
}

/**
 * Optimistically toggle a checkpoint and persist
 */
export async function toggleCheckpointInDexie(
  segmentId: string,
  checkpointId: string
): Promise<TripSegment | null> {
  const record = await localDB.offlineSegments.get(segmentId);
  if (!record) return null;

  const segment = record.segmentData;
  const updatedCheckpoints = segment.checkpoints.map(cp => {
    if (cp.id !== checkpointId) return cp;
    const isNowDone = !cp.done;
    return {
      ...cp,
      done: isNowDone,
      completedAt: isNowDone ? new Date().toISOString() : undefined
    };
  });

  const updatedSegment: TripSegment = {
    ...segment,
    checkpoints: updatedCheckpoints
  };

  await saveSegmentToDexie(updatedSegment);

  // Background sync if online
  if (navigator.onLine) {
    fetch(`/api/segments/${segmentId}/checkpoint`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ checkpointId })
    }).catch(e => console.warn('Checkpoint sync deferred', e));
  }

  return updatedSegment;
}

/**
 * Update segment lifecycle status (UPCOMING -> IN_TRANSIT -> COMPLETED)
 */
export async function updateSegmentStatusInDexie(
  segmentId: string,
  status: SegmentStatus
): Promise<TripSegment | null> {
  const record = await localDB.offlineSegments.get(segmentId);
  if (!record) return null;

  const updatedSegment: TripSegment = {
    ...record.segmentData,
    status
  };

  await saveSegmentToDexie(updatedSegment);

  if (navigator.onLine) {
    fetch(`/api/segments/${segmentId}/status`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status })
    }).catch(e => console.warn('Segment status sync deferred', e));
  }

  return updatedSegment;
}

/**
 * Update cab/logistics details (Driver name, phone, plate, bay)
 */
export async function updateLogisticsInDexie(
  segmentId: string,
  logisticsUpdate: Partial<LogisticsInfo>
): Promise<TripSegment | null> {
  const record = await localDB.offlineSegments.get(segmentId);
  if (!record) return null;

  const updatedSegment: TripSegment = {
    ...record.segmentData,
    logistics: {
      ...record.segmentData.logistics,
      ...logisticsUpdate
    }
  };

  await saveSegmentToDexie(updatedSegment);

  if (navigator.onLine) {
    fetch(`/api/segments/${segmentId}/logistics`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(logisticsUpdate)
    }).catch(e => console.warn('Logistics sync deferred', e));
  }

  return updatedSegment;
}
