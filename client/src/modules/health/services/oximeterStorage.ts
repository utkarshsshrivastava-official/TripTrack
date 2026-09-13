import { localDB, OfflineOximeterRecord } from '../../../shared/db/dexie';
import { SpO2Status, OximeterReading } from '../types/health.types';
import { getTravellerById } from '../../../shared/config/travellers.config';

/**
 * Evaluate SpO2 risk based on altitude and elder health factors
 */
export function evaluateSpO2Status(spo2: number, altitudeMeters: number = 0): SpO2Status {
  // At high altitude (>2,500m like Joshimath & Badrinath), normal SpO2 drops naturally by 3-5%
  if (altitudeMeters >= 2500) {
    if (spo2 >= 90) return 'NORMAL';
    if (spo2 >= 85) return 'BORDERLINE';
    return 'WARNING';
  }

  // Plains / Foot-hills (<2,500m like Haridwar / Rishikesh / Devprayag)
  if (spo2 >= 94) return 'NORMAL';
  if (spo2 >= 89) return 'BORDERLINE';
  return 'WARNING';
}

const SAMPLE_OXIMETER_SEEDS: OfflineOximeterRecord[] = [
  {
    id: 'oxi-seed-1',
    travellerId: 'traveller-rajnish',
    spo2: 97,
    pulseBpm: 72,
    altitudeMeters: 314,
    locationName: 'Haridwar Ghats',
    notes: 'Resting pulse post-Ganga Aarti. Normal breathing.',
    recordedAt: new Date(Date.now() - 3600000 * 18).toISOString()
  },
  {
    id: 'oxi-seed-2',
    travellerId: 'traveller-rajnish',
    spo2: 94,
    pulseBpm: 78,
    altitudeMeters: 610,
    locationName: 'Rishikesh Hotel',
    notes: 'Morning reading before boarding taxi. BP meds taken.',
    recordedAt: new Date(Date.now() - 3600000 * 6).toISOString()
  },
  {
    id: 'oxi-seed-3',
    travellerId: 'traveller-sanjay',
    spo2: 96,
    pulseBpm: 74,
    altitudeMeters: 314,
    locationName: 'Haridwar Hotel',
    notes: 'Pre-journey check. Feeling energetic.',
    recordedAt: new Date(Date.now() - 3600000 * 18).toISOString()
  },
  {
    id: 'oxi-seed-4',
    travellerId: 'traveller-sanjay',
    spo2: 93,
    pulseBpm: 80,
    altitudeMeters: 610,
    locationName: 'Rishikesh Departure',
    notes: 'Light tea break reading. Hydrated.',
    recordedAt: new Date(Date.now() - 3600000 * 5).toISOString()
  }
];

export async function initOximeterSeeds(): Promise<void> {
  try {
    const count = await localDB.oximeterLogs.count();
    if (count === 0) {
      await localDB.oximeterLogs.bulkPut(SAMPLE_OXIMETER_SEEDS);
    }
  } catch (err) {
    console.warn('Could not initialize oximeter seeds in Dexie:', err);
  }
}

export async function saveOximeterReading(data: {
  travellerId: string;
  spo2: number;
  pulseBpm: number;
  altitudeMeters?: number;
  locationName?: string;
  notes?: string;
}): Promise<OximeterReading> {
  const record: OfflineOximeterRecord = {
    id: `oxi-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
    travellerId: data.travellerId,
    spo2: Math.min(100, Math.max(50, data.spo2)),
    pulseBpm: Math.min(200, Math.max(35, data.pulseBpm)),
    altitudeMeters: data.altitudeMeters || 1890,
    locationName: data.locationName || 'En route NH-7',
    notes: data.notes || '',
    recordedAt: new Date().toISOString(),
    isSynced: false
  };

  await localDB.oximeterLogs.put(record);

  const traveller = getTravellerById(data.travellerId);
  return {
    ...record,
    travellerName: traveller?.name || 'Pilgrim',
    status: evaluateSpO2Status(record.spo2, record.altitudeMeters)
  };
}

export async function getOximeterReadings(travellerId?: string): Promise<OximeterReading[]> {
  await initOximeterSeeds();
  let records: OfflineOximeterRecord[];

  if (travellerId && travellerId !== 'ALL') {
    records = await localDB.oximeterLogs.where('travellerId').equals(travellerId).toArray();
  } else {
    records = await localDB.oximeterLogs.toArray();
  }

  // Sort descending by recordedAt
  records.sort((a, b) => new Date(b.recordedAt).getTime() - new Date(a.recordedAt).getTime());

  return records.map(r => {
    const traveller = getTravellerById(r.travellerId);
    return {
      ...r,
      travellerName: traveller?.name || 'Pilgrim',
      status: evaluateSpO2Status(r.spo2, r.altitudeMeters)
    };
  });
}
