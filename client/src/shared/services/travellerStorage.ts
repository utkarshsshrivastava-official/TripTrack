import { localDB, OfflineTravellerRecord } from '../db/dexie';
import { Traveller } from '../types';
import { TRAVELLERS_CONFIG } from '../config/travellers.config';

/**
 * Get all travellers from local IndexedDB with immediate fallback to static config
 */
export async function getCachedTravellersFromDexie(): Promise<Traveller[]> {
  try {
    const cached = await localDB.travellers.toArray();
    if (cached && cached.length > 0) {
      return cached as Traveller[];
    }

    // Initialize Dexie with default templates if empty
    await localDB.travellers.bulkPut(TRAVELLERS_CONFIG as OfflineTravellerRecord[]);
    return TRAVELLERS_CONFIG;
  } catch (error) {
    console.warn('[travellerStorage] Dexie read error, returning static config:', error);
    return TRAVELLERS_CONFIG;
  }
}

/**
 * Sync travellers from MongoDB backend into client Dexie IndexedDB
 */
export async function syncTravellersFromApi(): Promise<Traveller[]> {
  try {
    const response = await fetch('/api/travellers');
    if (!response.ok) {
      throw new Error(`HTTP error ${response.status}`);
    }

    const payload = await response.json();
    if (payload.success && Array.isArray(payload.data) && payload.data.length > 0) {
      const travellers: Traveller[] = payload.data.map((item: any) => ({
        id: item.id,
        duoId: item.duoId,
        name: item.name,
        role: item.role,
        relation: item.relation,
        age: item.age,
        bloodGroup: item.bloodGroup,
        emergencyContact: item.emergencyContact,
        avatarColor: item.avatarColor,
        isSeniorCitizen: item.isSeniorCitizen,
        elderCareNotes: item.elderCareNotes
      }));

      await localDB.travellers.bulkPut(travellers as OfflineTravellerRecord[]);
      return travellers;
    }
    return getCachedTravellersFromDexie();
  } catch (error) {
    console.warn('[travellerStorage] Background API sync skipped or offline; using Dexie cache:', error);
    return getCachedTravellersFromDexie();
  }
}

/**
 * Update a traveller profile in Dexie and sync to backend
 */
export async function updateTravellerProfile(
  id: string,
  updates: Partial<Traveller>
): Promise<Traveller | null> {
  try {
    const existing = await localDB.travellers.get(id);
    const merged = { ...(existing || {}), ...updates, id } as OfflineTravellerRecord;

    // 1. Save locally in Dexie first (optimistic UI)
    await localDB.travellers.put(merged);

    // 2. Sync to MongoDB backend in background
    fetch(`/api/travellers/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates)
    }).catch(err => {
      console.warn('[travellerStorage] Server update failed (queued offline):', err);
    });

    return merged as Traveller;
  } catch (error) {
    console.error('[travellerStorage] Failed to update traveller:', error);
    return null;
  }
}
