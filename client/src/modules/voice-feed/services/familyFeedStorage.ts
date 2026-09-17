import { getVoiceLogsFromDexie } from './voiceLogStorage';

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

// Add a new traveler update or note
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

// Delete an item from timeline
export function deleteFamilyFeedItem(id: string): void {
  const existing = loadSavedTimelineItems();
  const filtered = existing.filter(i => i.id !== id);
  saveTimelineItems(filtered);
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('triptrack_feed_update'));
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
