import { getVoiceLogsFromDexie } from './voiceLogStorage';
import { onFamilyEvent, emitFamilyEvent } from '../../../shared/services/socketClient';

export type FamilyFeedItemType = 
  | 'MILESTONE'
  | 'VOICE_NOTE'
  | 'TRANSIT_UPDATE'
  | 'TRAVELER_NOTE'
  | 'HEALTH_CHECK'
  | 'EXPENSE_LOG';

export interface FamilyFeedItem {
  id: string;
  type: FamilyFeedItemType;
  title: string;
  description: string;
  timestamp: string; // ISO 8601
  speakerId: string; // travellerId e.g. traveller-utkarsh
  locationName: string;
  duoId: 'DUO_A' | 'DUO_B' | 'ALL';
  category?: 'FLIGHT' | 'TRAIN' | 'CAB' | 'HOTEL' | 'DARSHAN' | 'MEAL' | 'HEALTH' | 'VOICE' | 'GENERAL';
  statusBadge?: string;
  metadata?: {
    checkpointId?: string;
    segmentId?: string;
    audioUrl?: string;
    transcription?: string;
    summary?: string;
    cabPlate?: string;
    driverPhone?: string;
    spo2?: number;
    amountINR?: number;
  };
}

const STORAGE_KEY = 'triptrack_family_feed_timeline';

export const INITIAL_FEED_SEEDS: FamilyFeedItem[] = [];

let feedSocketListenersInitialized = false;

function setupFeedSocketListeners() {
  if (feedSocketListenersInitialized || typeof window === 'undefined') return;
  feedSocketListenersInitialized = true;

  // Listen for live feed posts broadcast by other family members
  onFamilyEvent('receive_feed_post', (feedData: FamilyFeedItem) => {
    try {
      if (!feedData?.id) return;
      const existing = loadSavedTimelineItems();
      const idx = existing.findIndex(i => i.id === feedData.id);
      let updated: FamilyFeedItem[];
      if (idx >= 0) {
        updated = [...existing];
        updated[idx] = feedData;
      } else {
        updated = [feedData, ...existing];
      }
      saveTimelineItems(updated);
      window.dispatchEvent(new CustomEvent('triptrack_feed_update', { detail: feedData }));
    } catch (err) {
      console.warn('⚠️ [Family Feed Sync] Failed to process incoming live feed post:', err);
    }
  });

  // Listen for live feed post deletions
  onFamilyEvent('feed_post_removed', (data: { id: string }) => {
    try {
      if (!data?.id) return;
      const existing = loadSavedTimelineItems();
      const filtered = existing.filter(i => i.id !== data.id);
      saveTimelineItems(filtered);
      window.dispatchEvent(new CustomEvent('triptrack_feed_update', { detail: { id: data.id, deleted: true } }));
    } catch (err) {
      console.warn('⚠️ [Family Feed Sync] Failed to delete feed post locally:', err);
    }
  });

  // Listen for clear all feed
  onFamilyEvent('feed_cleared', () => {
    try {
      saveTimelineItems([]);
      window.dispatchEvent(new CustomEvent('triptrack_feed_update', { detail: { cleared: true } }));
    } catch (err) {
      console.warn('⚠️ [Family Feed Sync] Failed to clear feed items locally:', err);
    }
  });

  // Auto-sync when socket/network reconnects
  window.addEventListener('triptrack_network_sync', () => {
    syncFamilyFeedWithCloud().catch(err => console.warn('Background feed sync error:', err));
  });
}

// Wire socket listeners immediately
setupFeedSocketListeners();

/**
 * Reconcile local timeline with MongoDB Atlas cloud feed
 */
export async function syncFamilyFeedWithCloud(): Promise<FamilyFeedItem[]> {
  try {
    const pin = localStorage.getItem('triptrack_family_pin') || '2026';
    const res = await fetch('/api/feed', {
      headers: { 'x-family-pin': pin }
    });

    if (!res.ok) {
      return loadSavedTimelineItems();
    }

    const json = await res.json();
    if (!json.success || !Array.isArray(json.data)) {
      return loadSavedTimelineItems();
    }

    const cloudFeed: FamilyFeedItem[] = json.data;
    const localItems = loadSavedTimelineItems();

    // Map by ID and merge (cloud takes precedence for shared items)
    const map = new Map<string, FamilyFeedItem>();
    cloudFeed.forEach(item => map.set(item.id, item));
    localItems.forEach(item => {
      if (!map.has(item.id)) {
        map.set(item.id, item);
      }
    });

    const merged = Array.from(map.values()).sort(
      (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    );

    saveTimelineItems(merged);

    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('triptrack_feed_update'));
    }

    return merged;
  } catch (err) {
    console.warn('⚠️ [Family Feed Sync] Offline or server unreachable, using local storage:', err);
    return loadSavedTimelineItems();
  }
}

// Helper to load manual and milestone feed items (purges legacy mockup items)
export function loadSavedTimelineItems(): FamilyFeedItem[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify([]));
      return [];
    }
    const items = JSON.parse(raw);
    if (!Array.isArray(items)) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify([]));
      return [];
    }

    // Clean out legacy mock seeds or cached test voice feed entries if present
    const cleaned = items.filter((item: FamilyFeedItem) => 
      !item.id?.startsWith('feed-init-') && 
      !item.id?.startsWith('voice-feed-')
    );
    if (cleaned.length !== items.length) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(cleaned));
    }
    return cleaned;
  } catch (err) {
    console.warn('Failed to parse saved family timeline items', err);
    return [];
  }
}

// Save timeline items
export function saveTimelineItems(items: FamilyFeedItem[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  } catch (err) {
    console.warn('Failed to save timeline items to localStorage', err);
  }
}

// Add a new traveler update or note and broadcast live
export function addFamilyFeedItem(item: Omit<FamilyFeedItem, 'id' | 'timestamp'>): FamilyFeedItem {
  const fullItem: FamilyFeedItem = {
    ...item,
    id: `feed-item-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
    timestamp: new Date().toISOString()
  };

  const existing = loadSavedTimelineItems();
  const updated = [fullItem, ...existing];
  saveTimelineItems(updated);

  // Dispatch custom window event so open tabs react immediately
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('triptrack_feed_update', { detail: fullItem }));
  }

  // Broadcast live via Socket.io and persist to MongoDB Atlas
  if (navigator.onLine) {
    emitFamilyEvent('send_feed_post', fullItem);

    fetch('/api/feed', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-family-pin': localStorage.getItem('triptrack_family_pin') || '2026'
      },
      body: JSON.stringify(fullItem)
    }).catch(err => console.warn('⚠️ [Family Feed] Cloud save deferred:', err));
  }

  return fullItem;
}

// Automatically log milestone updates when an itinerary checkpoint is checked
export function logItineraryMilestoneToFeed(
  checkpointName: string,
  segmentTitle: string,
  locationName: string,
  speakerId: string = 'traveller-utkarsh',
  elderComfortNote?: string
): FamilyFeedItem {
  return addFamilyFeedItem({
    type: 'MILESTONE',
    title: `Milestone: ${checkpointName}`,
    description: elderComfortNote 
      ? `${checkpointName} reached during "${segmentTitle}". ${elderComfortNote}`
      : `${checkpointName} reached during "${segmentTitle}". Pilgrims proceeding comfortably.`,
    speakerId,
    locationName,
    duoId: 'ALL',
    category: checkpointName.toLowerCase().includes('cab') ? 'CAB' 
            : checkpointName.toLowerCase().includes('train') ? 'TRAIN' 
            : checkpointName.toLowerCase().includes('hotel') ? 'HOTEL' 
            : checkpointName.toLowerCase().includes('darshan') ? 'DARSHAN' 
            : 'GENERAL',
    statusBadge: 'Checkpoint Reached'
  });
}

// Delete an item from timeline and broadcast live
export function deleteFamilyFeedItem(id: string): void {
  const existing = loadSavedTimelineItems();
  const filtered = existing.filter(i => i.id !== id);
  saveTimelineItems(filtered);

  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('triptrack_feed_update', { detail: { id, deleted: true } }));
  }

  if (navigator.onLine) {
    emitFamilyEvent('delete_feed_post', { id });

    fetch(`/api/feed/${id}`, {
      method: 'DELETE',
      headers: {
        'x-family-pin': localStorage.getItem('triptrack_family_pin') || '2026'
      }
    }).catch(err => console.warn('⚠️ [Family Feed] Cloud delete deferred:', err));
  }
}

// Fetch unified timeline including audio voice notes from Dexie
export async function getUnifiedFamilyFeed(): Promise<FamilyFeedItem[]> {
  const manualItems = loadSavedTimelineItems();
  const voiceLogs = await getVoiceLogsFromDexie();

  // Convert voice logs to timeline feed format
  const voiceFeedItems: FamilyFeedItem[] = voiceLogs.map(vl => ({
    id: `voice-feed-${vl.id}`,
    type: 'VOICE_NOTE',
    title: `Voice Broadcast: ${vl.locationName || 'En Route'}`,
    description: vl.summary || vl.transcription,
    timestamp: vl.recordedAt,
    speakerId: vl.speakerId,
    locationName: vl.locationName || 'En Route NH-7',
    duoId: 'ALL',
    category: 'VOICE',
    statusBadge: 'Audio Dispatch',
    metadata: {
      audioUrl: vl.audioUrl,
      transcription: vl.transcription,
      summary: vl.summary
    }
  }));

  // Combine and sort in reverse chronological order
  const combined = [...manualItems, ...voiceFeedItems];
  combined.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  return combined;
}
