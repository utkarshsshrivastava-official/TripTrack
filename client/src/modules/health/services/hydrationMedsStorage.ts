import { localDB, OfflineMedicationRecord } from '../../../shared/db/dexie';
import { MedicationSchedule } from '../types/health.types';
import { TRAVELLERS_CONFIG } from '../../../shared/config/travellers.config';

const HYDRATION_INTERVAL_MINUTES = 90;
const HYDRATION_KEY = 'triptrack_last_hydration_timestamp';

/**
 * Play a gentle, meditative multi-tone chime using the Web Audio API
 */
export function playHydrationChime(): void {
  try {
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContextClass) return;

    const ctx = new AudioContextClass();
    const notes = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6 (Himalayan chime)

    notes.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, ctx.currentTime + idx * 0.18);

      gain.gain.setValueAtTime(0.001, ctx.currentTime + idx * 0.18);
      gain.gain.exponentialRampToValueAtTime(0.2, ctx.currentTime + idx * 0.18 + 0.05);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + idx * 0.18 + 0.9);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(ctx.currentTime + idx * 0.18);
      osc.stop(ctx.currentTime + idx * 0.18 + 1.0);
    });
  } catch (e) {
    console.log('Web Audio chime not permitted yet:', e);
  }
}

/**
 * Get remaining minutes until next hydration reminder
 */
export function getHydrationCountdown(): {
  minutesRemaining: number;
  isDue: boolean;
  lastDrinkTimeStr: string;
} {
  const lastRecorded = localStorage.getItem(HYDRATION_KEY);
  const now = Date.now();
  const lastTimestamp = lastRecorded ? parseInt(lastRecorded, 10) : now - 45 * 60 * 1000;

  const elapsedMinutes = Math.floor((now - lastTimestamp) / (60 * 1000));
  const minutesRemaining = Math.max(0, HYDRATION_INTERVAL_MINUTES - elapsedMinutes);
  const isDue = minutesRemaining === 0;

  const dateObj = new Date(lastTimestamp);
  const lastDrinkTimeStr = dateObj.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  return {
    minutesRemaining,
    isDue,
    lastDrinkTimeStr
  };
}

/**
 * Record that water/ORS was consumed right now
 */
export function recordHydrationIntake(): void {
  localStorage.setItem(HYDRATION_KEY, Date.now().toString());
  playHydrationChime();
}

/**
 * Get today's medication checkoff schedules for senior pilgrims
 */
export async function getMedicationSchedules(dateStr?: string): Promise<MedicationSchedule[]> {
  const today = dateStr || new Date().toISOString().split('T')[0];
  const seniorPilgrims = TRAVELLERS_CONFIG.filter(t => t.isSeniorCitizen);

  const logs = await localDB.medicationLogs.where('date').equals(today).toArray();

  return seniorPilgrims.map(elder => {
    const morningLog = logs.find(l => l.travellerId === elder.id && l.timeSlot === 'MORNING');
    const eveningLog = logs.find(l => l.travellerId === elder.id && l.timeSlot === 'EVENING');

    return {
      travellerId: elder.id,
      travellerName: elder.name,
      dailyMeds: elder.elderCareNotes?.dailyMeds || ['Morning BP Tablet', 'Warm Water hydration'],
      morningTaken: !!morningLog,
      morningTakenAt: morningLog?.takenAt,
      eveningTaken: !!eveningLog,
      eveningTakenAt: eveningLog?.takenAt
    };
  });
}

/**
 * Toggle medication taken status for a pilgrim and slot
 */
export async function toggleMedicationTaken(
  travellerId: string,
  timeSlot: 'MORNING' | 'EVENING',
  takenByUserName: string
): Promise<boolean> {
  const today = new Date().toISOString().split('T')[0];
  const existing = await localDB.medicationLogs
    .where('travellerId')
    .equals(travellerId)
    .and(l => l.date === today && l.timeSlot === timeSlot)
    .first();

  if (existing) {
    // Untoggle
    await localDB.medicationLogs.delete(existing.id);
    return false;
  } else {
    // Record taken
    const elder = TRAVELLERS_CONFIG.find(t => t.id === travellerId);
    const newRecord: OfflineMedicationRecord = {
      id: `med-${Date.now()}`,
      travellerId,
      date: today,
      timeSlot,
      medicationName: elder?.elderCareNotes?.dailyMeds?.join(', ') || 'Prescribed Meds',
      takenAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      takenByUserName
    };
    await localDB.medicationLogs.put(newRecord);
    return true;
  }
}
