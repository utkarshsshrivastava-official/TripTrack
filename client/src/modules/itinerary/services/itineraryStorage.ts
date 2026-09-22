import { localDB, OfflineSegmentRecord, OfflineCustomActivityRecord } from '../../../shared/db/dexie';
import { TRIP_SEED_SEGMENTS } from '../../../shared/config/trip.config';
import { TripSegment, SegmentStatus, LogisticsInfo, Checkpoint, CustomActivity } from '../../../shared/types';
import { logItineraryMilestoneToFeed, addFamilyFeedItem } from '../../voice-feed/services/familyFeedStorage';
import { onFamilyEvent, emitFamilyEvent } from '../../../shared/services/socketClient';
import { getActiveUserId } from '../../../shared/hooks/useUserProfile';

let itinerarySocketListenersInitialized = false;

function setupItinerarySocketListeners() {
  if (itinerarySocketListenersInitialized || typeof window === 'undefined') return;
  itinerarySocketListenersInitialized = true;

  // Listen for real-time checkpoint updates from other family members
  onFamilyEvent('checkpoint_updated', async (data: {
    segmentId: string;
    checkpointId: string;
    done?: boolean;
    completedAt?: string;
    checkpointName?: string;
  }) => {
    try {
      if (!data?.segmentId || !data?.checkpointId) return;
      const record = await localDB.offlineSegments.get(data.segmentId);
      if (!record) return;

      const segment = record.segmentData;
      const updatedCheckpoints = segment.checkpoints.map(cp => {
        if (cp.id !== data.checkpointId) return cp;
        const newDone = data.done !== undefined ? data.done : !cp.done;
        return {
          ...cp,
          done: newDone,
          completedAt: newDone ? (data.completedAt || new Date().toISOString()) : undefined
        };
      });

      const updatedSegment: TripSegment = {
        ...segment,
        checkpoints: updatedCheckpoints
      };

      await localDB.offlineSegments.put({
        id: segment.id,
        segmentData: updatedSegment,
        modifiedLocallyAt: Date.now()
      });

      window.dispatchEvent(new CustomEvent('triptrack_itinerary_update', { detail: { segmentId: data.segmentId, checkpointId: data.checkpointId } }));
    } catch (err) {
      console.warn('⚠️ [Itinerary Sync] Failed to process live checkpoint update:', err);
    }
  });

  // Re-sync with cloud on network reconnection
  window.addEventListener('triptrack_network_sync', () => {
    syncItineraryWithCloud().catch(err => console.warn('Background itinerary sync error:', err));
  });
}

// Wire socket listeners immediately
setupItinerarySocketListeners();

/**
 * Reconcile local segments with MongoDB Atlas cloud segments
 */
export async function syncItineraryWithCloud(): Promise<TripSegment[]> {
  try {
    const pin = localStorage.getItem('triptrack_family_pin') || '2026';
    const res = await fetch('/api/segments', {
      headers: { 'x-family-pin': pin }
    });

    if (!res.ok) {
      return await getSegmentsFromDexie();
    }

    const json = await res.json();
    if (!json.success || !Array.isArray(json.data) || json.data.length === 0) {
      return await getSegmentsFromDexie();
    }

    const cloudSegments: TripSegment[] = json.data;

    // Update Dexie stores with cloud states
    for (const seg of cloudSegments) {
      await localDB.offlineSegments.put({
        id: seg.id,
        segmentData: seg,
        modifiedLocallyAt: Date.now()
      });
    }

    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('triptrack_itinerary_update'));
    }

    return cloudSegments;
  } catch (err) {
    console.warn('⚠️ [Itinerary Cloud Sync] Offline or API unreachable, using local Dexie:', err);
    return await getSegmentsFromDexie();
  }
}

/**
 * Initialize Dexie with Seed Segments if empty or missing new segments
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

    // Check if new segments (e.g. seg-6 to seg-9) are missing from existing store
    const existingRecords = await localDB.offlineSegments.toArray();
    const existingIds = new Set(existingRecords.map(r => r.id));
    const missingSeeds = TRIP_SEED_SEGMENTS.filter(s => !existingIds.has(s.id));
    
    if (missingSeeds.length > 0) {
      console.log(`🧭 [Dexie Itinerary] Adding ${missingSeeds.length} newly configured segments into offline store.`);
      for (const seg of missingSeeds) {
        await localDB.offlineSegments.put({
          id: seg.id,
          segmentData: seg,
          modifiedLocallyAt: Date.now()
        });
      }
    }

    // Initial background sync with cloud
    syncItineraryWithCloud().catch(() => {});

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
    if (!records || records.length === 0 || records.length < TRIP_SEED_SEGMENTS.length) {
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
  let toggledCheckpoint: any = null;
  let isNowDone = false;

  const updatedCheckpoints = segment.checkpoints.map(cp => {
    if (cp.id !== checkpointId) return cp;
    isNowDone = !cp.done;
    toggledCheckpoint = cp;
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

  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('triptrack_itinerary_update', { detail: { segmentId, checkpointId } }));
  }

  // Auto-post milestone event to Family Feed when completed
  if (isNowDone && toggledCheckpoint) {
    try {
      logItineraryMilestoneToFeed(
        toggledCheckpoint.name,
        segment.title,
        segment.destination || segment.origin,
        getActiveUserId(),
        toggledCheckpoint.elderComfortNote
      );
    } catch (feedErr) {
      console.warn('Failed to auto-log milestone to Family Feed', feedErr);
    }
  }

  // Live broadcast via Socket.io
  emitFamilyEvent('toggle_checkpoint', { segmentId, checkpointId });

  // Background sync if online
  if (navigator.onLine) {
    fetch(`/api/segments/${segmentId}/checkpoint`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'x-family-pin': localStorage.getItem('triptrack_family_pin') || '2026'
      },
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

  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('triptrack_itinerary_update', { detail: { segmentId, status } }));
  }

  // Auto-log status transition in Family Feed
  try {
    addFamilyFeedItem({
      type: 'MILESTONE',
      title: status === 'COMPLETED' 
        ? `Arrived: ${record.segmentData.title}` 
        : `Departed: ${record.segmentData.title}`,
      description: status === 'COMPLETED'
        ? `Successfully arrived at ${record.segmentData.destination}. Elders resting comfortably.`
        : `En route from ${record.segmentData.origin} towards ${record.segmentData.destination}.`,
      speakerId: getActiveUserId(),
      locationName: record.segmentData.origin,
      duoId: 'ALL',
      category: record.segmentData.mode === 'TRAIN' ? 'TRAIN' : 'CAB',
      statusBadge: status === 'COMPLETED' ? 'Arrived' : 'In Transit'
    });
  } catch (feedErr) {
    console.warn('Failed to log segment status to Family Feed', feedErr);
  }

  if (navigator.onLine) {
    fetch(`/api/segments/${segmentId}/status`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'x-family-pin': localStorage.getItem('triptrack_family_pin') || '2026'
      },
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

  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('triptrack_itinerary_update', { detail: { segmentId } }));
  }

  // Auto-log cab booking/logistics update in Family Feed
  try {
    addFamilyFeedItem({
      type: 'TRANSIT_UPDATE',
      title: `Cab / Transit Confirmed: ${record.segmentData.title}`,
      description: `Cab service: ${logisticsUpdate.serviceName || record.segmentData.logistics.serviceName} • Vehicle / PNR: ${logisticsUpdate.identifier || record.segmentData.logistics.identifier} • Pickup: ${logisticsUpdate.pickupLocation || record.segmentData.logistics.pickupLocation}`,
      speakerId: 'traveller-shreyas',
      locationName: record.segmentData.origin,
      duoId: 'ALL',
      category: 'CAB',
      statusBadge: 'Cab Assigned',
      metadata: {
        segmentId,
        cabPlate: logisticsUpdate.identifier,
        driverPhone: logisticsUpdate.driverPhone
      }
    });
  } catch (feedErr) {
    console.warn('Failed to log cab update to Family Feed', feedErr);
  }

  if (navigator.onLine) {
    fetch(`/api/segments/${segmentId}/logistics`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'x-family-pin': localStorage.getItem('triptrack_family_pin') || '2026'
      },
      body: JSON.stringify(logisticsUpdate)
    }).catch(e => console.warn('Logistics sync deferred', e));
  }

  return updatedSegment;
}

/**
 * Add a new checkpoint (e.g. from Sightseeing recommendation or Custom activity) directly to a segment
 */
export async function addCheckpointToSegment(
  segmentId: string,
  checkpoint: Omit<Checkpoint, 'id' | 'done'> & { id?: string }
): Promise<TripSegment | null> {
  const record = await localDB.offlineSegments.get(segmentId);
  if (!record) return null;

  const newCheckpoint: Checkpoint = {
    id: checkpoint.id || `cp-${segmentId}-${Date.now()}`,
    name: checkpoint.name,
    estimatedTime: checkpoint.estimatedTime || 'Flexible',
    done: false,
    elderComfortNote: checkpoint.elderComfortNote
  };

  const updatedSegment: TripSegment = {
    ...record.segmentData,
    checkpoints: [...record.segmentData.checkpoints, newCheckpoint]
  };

  await saveSegmentToDexie(updatedSegment);

  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('triptrack_itinerary_update', { detail: { segmentId } }));
  }

  // Live broadcast via Socket.io
  emitFamilyEvent('segment_updated', { segmentId, segment: updatedSegment });

  return updatedSegment;
}

/**
 * Fetch custom activities from Dexie
 */
export async function getCustomActivitiesFromDexie(dayId?: string): Promise<CustomActivity[]> {
  try {
    let activities: OfflineCustomActivityRecord[];
    if (dayId && dayId !== 'all') {
      activities = await localDB.customActivities.where('dayId').equals(dayId).toArray();
    } else {
      activities = await localDB.customActivities.toArray();
    }
    return activities.map(a => ({
      id: a.id,
      dayId: a.dayId,
      title: a.title,
      timeSlot: a.timeSlot,
      category: a.category as any,
      elderComfortNote: a.elderComfortNote,
      createdAt: a.createdAt
    }));
  } catch (err) {
    console.warn('Failed to get custom activities from Dexie:', err);
    return [];
  }
}

/**
 * Persist a custom activity in Dexie
 */
export async function addCustomActivityInDexie(activity: CustomActivity): Promise<void> {
  try {
    await localDB.customActivities.put({
      id: activity.id,
      dayId: activity.dayId,
      title: activity.title,
      timeSlot: activity.timeSlot,
      category: activity.category,
      elderComfortNote: activity.elderComfortNote,
      createdAt: activity.createdAt
    });

    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('triptrack_custom_activities_update', { detail: { activity } }));
    }

    emitFamilyEvent('custom_activity_added', { activity });
  } catch (err) {
    console.warn('Failed to save custom activity to Dexie:', err);
  }
}

/**
 * Remove a custom activity from Dexie
 */
export async function deleteCustomActivityInDexie(activityId: string): Promise<void> {
  try {
    await localDB.customActivities.delete(activityId);

    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('triptrack_custom_activities_update', { detail: { activityId } }));
    }

    emitFamilyEvent('custom_activity_deleted', { activityId });
  } catch (err) {
    console.warn('Failed to delete custom activity from Dexie:', err);
  }
}
