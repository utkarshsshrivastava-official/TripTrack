import { localDB, OfflineVoiceRecord } from '../../../shared/db/dexie';
import { VoiceUpdate } from '../../../shared/types';

const INITIAL_VOICE_SEEDS: OfflineVoiceRecord[] = [];

// Legacy mock voice IDs to scrub clean
const LEGACY_MOCK_VOICE_IDS = ['voice-1', 'voice-2', 'voice-3'];
const DEMO_BLOBS_PURGE_FLAG = 'triptrack_demo_voice_blobs_purged_v2';

/**
 * Initialize Dexie with initial voice feed seeds if empty, and purge mock seeds
 */
export async function initializeVoiceLogStorage(): Promise<OfflineVoiceRecord[]> {
  try {
    // One-time purge of all unwanted demo offline voice blobs created in earlier testing
    if (typeof window !== 'undefined' && !localStorage.getItem(DEMO_BLOBS_PURGE_FLAG)) {
      await localDB.offlineVoiceLogs.clear();
      localStorage.setItem(DEMO_BLOBS_PURGE_FLAG, 'true');
      console.log('🧹 [Dexie Voice] Purged unwanted demo offline voice blobs.');
      return [];
    }

    // Purge any legacy mock seeds from previous builds
    await localDB.offlineVoiceLogs.bulkDelete(LEGACY_MOCK_VOICE_IDS);

    const existingCount = await localDB.offlineVoiceLogs.count();
    if (existingCount === 0 && INITIAL_VOICE_SEEDS.length > 0) {
      await localDB.offlineVoiceLogs.bulkAdd(INITIAL_VOICE_SEEDS);
      return INITIAL_VOICE_SEEDS;
    }
    const logs = await localDB.offlineVoiceLogs.toArray();
    return logs.sort((a, b) => new Date(b.recordedAt).getTime() - new Date(a.recordedAt).getTime());
  } catch (err) {
    console.warn('⚠️ [Dexie Voice] Failed to load offline voice logs', err);
    return [];
  }
}

/**
 * Fetch all voice logs from Dexie (ensures clean state without mock seeds)
 */
export async function getVoiceLogsFromDexie(): Promise<VoiceUpdate[]> {
  try {
    // One-time purge of demo blobs if not yet executed
    if (typeof window !== 'undefined' && !localStorage.getItem(DEMO_BLOBS_PURGE_FLAG)) {
      await localDB.offlineVoiceLogs.clear();
      localStorage.setItem(DEMO_BLOBS_PURGE_FLAG, 'true');
      console.log('🧹 [Dexie Voice] Purged unwanted demo offline voice blobs.');
      return [];
    }

    // Scrub legacy mock seeds
    await localDB.offlineVoiceLogs.bulkDelete(LEGACY_MOCK_VOICE_IDS);

    const records = await localDB.offlineVoiceLogs.toArray();
    records.sort((a, b) => new Date(b.recordedAt).getTime() - new Date(a.recordedAt).getTime());
    return records.map(toVoiceUpdate);
  } catch (err) {
    console.error('Failed to get voice logs from Dexie', err);
    return [];
  }
}

/**
 * Delete a specific voice log by ID from Dexie
 */
export async function deleteVoiceLogFromDexie(id: string): Promise<void> {
  try {
    await localDB.offlineVoiceLogs.delete(id);
    console.log(`🗑️ [Dexie Voice] Deleted voice log ${id}`);
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('triptrack_feed_update'));
    }
  } catch (err) {
    console.error('Failed to delete voice log from Dexie', err);
  }
}

/**
 * Clear all voice logs from Dexie
 */
export async function clearAllVoiceLogsFromDexie(): Promise<void> {
  try {
    await localDB.offlineVoiceLogs.clear();
    console.log('🧹 [Dexie Voice] Cleared all voice logs');
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('triptrack_feed_update'));
    }
  } catch (err) {
    console.error('Failed to clear voice logs from Dexie', err);
  }
}

/**
 * Save new voice note to Dexie and background sync to Gemini API if online
 */
export async function saveVoiceLogToDexie(
  voiceLog: Omit<OfflineVoiceRecord, 'id'>,
  audioBlob?: Blob
): Promise<VoiceUpdate> {
  const id = `voice-${Date.now()}`;
  const record: OfflineVoiceRecord = {
    ...voiceLog,
    id,
    audioBlob,
    audioUrl: audioBlob ? URL.createObjectURL(audioBlob) : voiceLog.audioUrl,
    isSynced: navigator.onLine
  };

  await localDB.offlineVoiceLogs.add(record);

  // Background upload if online and audioBlob exists
  if (navigator.onLine && audioBlob) {
    const formData = new FormData();
    formData.append('audio', audioBlob, `voice-${Date.now()}.webm`);
    formData.append('speakerId', record.speakerId);
    formData.append('locationName', record.locationName || 'En route Badrinath');

    fetch('/api/voice/transcribe', {
      method: 'POST',
      headers: {
        'x-family-pin': localStorage.getItem('triptrack_family_pin') || '2026'
      },
      body: formData
    })
      .then(res => res.json())
      .then(async (data) => {
        if (data && data.success && data.voiceUpdate) {
          // Update record with server Gemini transcript and summary
          await localDB.offlineVoiceLogs.update(id, {
            transcription: data.voiceUpdate.transcription,
            summary: data.voiceUpdate.summary,
            isSynced: true
          });
        }
      })
      .catch(e => console.warn('Voice transcribe deferred to offline store', e));
  }

  return toVoiceUpdate(record);
}

function toVoiceUpdate(rec: OfflineVoiceRecord): VoiceUpdate {
  return {
    id: rec.id,
    speakerId: rec.speakerId,
    audioUrl: rec.audioUrl || (rec.audioBlob ? URL.createObjectURL(rec.audioBlob) : undefined),
    transcription: rec.transcription,
    summary: rec.summary,
    recordedAt: rec.recordedAt,
    locationName: rec.locationName
  };
}
