import { useState, useEffect, useCallback, useMemo } from 'react';
import { Traveller } from '../types';
import { 
  getCachedTravellersFromDexie, 
  syncTravellersFromApi, 
  updateTravellerProfile 
} from '../services/travellerStorage';
import { TRAVELLERS_CONFIG } from '../config/travellers.config';

export function useTravellers() {
  const [travellers, setTravellers] = useState<Traveller[]>(TRAVELLERS_CONFIG);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Load from Dexie cache immediately, then sync from API
  useEffect(() => {
    let isMounted = true;

    async function loadData() {
      // 1. Instant local IndexedDB load (0ms UI freeze)
      const cached = await getCachedTravellersFromDexie();
      if (isMounted && cached.length > 0) {
        setTravellers(cached);
        setIsLoading(false);
      }

      // 2. Background sync from MongoDB
      const synced = await syncTravellersFromApi();
      if (isMounted && synced.length > 0) {
        setTravellers(synced);
        setIsLoading(false);
      }
    }

    loadData();

    return () => {
      isMounted = false;
    };
  }, []);

  const duoAMembers = useMemo(
    () => travellers.filter(t => t.duoId === 'DUO_A'),
    [travellers]
  );

  const duoBMembers = useMemo(
    () => travellers.filter(t => t.duoId === 'DUO_B'),
    [travellers]
  );

  const elders = useMemo(
    () => travellers.filter(t => t.isSeniorCitizen),
    [travellers]
  );

  const coordinators = useMemo(
    () => travellers.filter(t => !t.isSeniorCitizen),
    [travellers]
  );

  const getTraveller = useCallback(
    (id: string): Traveller | undefined => {
      return travellers.find(t => t.id === id);
    },
    [travellers]
  );

  const updateTraveller = useCallback(
    async (id: string, updates: Partial<Traveller>) => {
      const updated = await updateTravellerProfile(id, updates);
      if (updated) {
        setTravellers(prev => prev.map(t => (t.id === id ? { ...t, ...updates } : t)));
      }
      return updated;
    },
    []
  );

  return {
    travellers,
    duoAMembers,
    duoBMembers,
    elders,
    coordinators,
    isLoading,
    getTraveller,
    updateTraveller
  };
}
