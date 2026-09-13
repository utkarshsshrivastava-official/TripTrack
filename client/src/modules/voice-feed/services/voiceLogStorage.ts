import { localDB, OfflineVoiceRecord } from '../../../shared/db/dexie';
import { VoiceUpdate } from '../../../shared/types';

const INITIAL_VOICE_SEEDS: OfflineVoiceRecord[] = [
  {
    id: 'voice-1',
    speakerId: 'traveller-utkarsh',
    transcription: 'Devprayag pahunch gaye hain. Dono papa log ekdum theek hain, chai pee rahe hain. Sangam ka darshan karwa diya car se hi bina stairs climb karwaye. Abhi Srinagar ki taraf badh rahe hain.',
    summary: 'Devprayag reached safely. Both fathers in good spirits and rested; proceeding along NH-7 towards Srinagar Garhwal.',
    recordedAt: '2026-09-26T08:45:00+05:30',
    locationName: 'Devprayag Sangam Viewpoint',
    isSynced: true
  },
  {
    id: 'voice-2',
    speakerId: 'traveller-shreyas',
    transcription: 'Joshimath base hotel pahunch gaye hain. Room heater on kar diya hai. Bade papa aur chacha ji ne garam paani se haath-munh dho liya hai aur dinner karke aaram kar rahe hain.',
    summary: 'Joshimath hotel reached. Elders settled with room heating and warm dinner; acclimating for tomorrow\'s Badrinath ascent.',
    recordedAt: '2026-09-26T16:30:00+05:30',
    locationName: 'Joshimath Heritage Hotel',
    isSynced: true
  },
  {
    id: 'voice-3',
    speakerId: 'traveller-utkarsh',
    transcription: 'Brahma Kapal pe Pind Daan aur Tarpan bahut shaanti se sampann hua. Pandit ji ne baitha ke pooja karwayi. Papa bilkul theek hain. Badrinath mandir darshan VIP senior citizen line se 15 minute me ho gaya!',
    summary: 'Brahma Kapal Pitru Paksha rituals completed unhurriedly. Special senior queue allowed smooth Badrinath Darshan.',
    recordedAt: '2026-09-27T11:15:00+05:30',
    locationName: 'Badrinath Dham Sanctum',
    isSynced: true
  }
];

/**
 * Initialize Dexie with initial voice feed seeds if empty
 */
export async function initializeVoiceLogStorage(): Promise<OfflineVoiceRecord[]> {
  try {
    const existingCount = await localDB.offlineVoiceLogs.count();
    if (existingCount === 0) {
      await localDB.offlineVoiceLogs.bulkAdd(INITIAL_VOICE_SEEDS);
      console.log(`🎙️ [Dexie Voice] Initialized ${INITIAL_VOICE_SEEDS.length} sample audio broadcast logs.`);
      return INITIAL_VOICE_SEEDS;
    }
    const logs = await localDB.offlineVoiceLogs.toArray();
    return logs.sort((a, b) => new Date(b.recordedAt).getTime() - new Date(a.recordedAt).getTime());
  } catch (err) {
    console.warn('⚠️ [Dexie Voice] Failed to load offline voice logs', err);
    return INITIAL_VOICE_SEEDS;
  }
}

/**
 * Fetch all voice logs from Dexie
 */
export async function getVoiceLogsFromDexie(): Promise<VoiceUpdate[]> {
  try {
    const records = await localDB.offlineVoiceLogs.toArray();
    if (!records || records.length === 0) {
      const initialized = await initializeVoiceLogStorage();
      return initialized.map(toVoiceUpdate);
    }
    records.sort((a, b) => new Date(b.recordedAt).getTime() - new Date(a.recordedAt).getTime());
    return records.map(toVoiceUpdate);
  } catch (err) {
    console.error('Failed to get voice logs from Dexie', err);
    return INITIAL_VOICE_SEEDS.map(toVoiceUpdate);
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
