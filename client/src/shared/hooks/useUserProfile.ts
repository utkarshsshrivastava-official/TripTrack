import { useState, useCallback, useMemo, useEffect } from 'react';
import { UserProfile } from '../types/user';
import { getAllUserProfiles } from '../config/travellers.config';
import { useTravellers } from './useTravellers';

export const STORAGE_KEY_ACTIVE_USER = 'triptrack_active_user_id';
export const STORAGE_KEY_GUEST_NAMES = 'triptrack_guest_custom_names';

/**
 * Synchronous non-React helper to get current active user ID
 */
export function getActiveUserId(): string {
  if (typeof window !== 'undefined') {
    try {
      return localStorage.getItem(STORAGE_KEY_ACTIVE_USER) || 'traveller-utkarsh';
    } catch {
      return 'traveller-utkarsh';
    }
  }
  return 'traveller-utkarsh';
}

export function useUserProfile() {
  const { travellers } = useTravellers();

  // Load custom guest names from localStorage
  const [guestNames, setGuestNames] = useState<Record<string, string>>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_GUEST_NAMES);
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  // All available profiles dynamically merged with synced travellers
  const allProfiles = useMemo(() => {
    return getAllUserProfiles(guestNames, travellers);
  }, [guestNames, travellers]);

  // Load active user ID from localStorage
  const [activeUserId, setActiveUserId] = useState<string>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_ACTIVE_USER);
      if (saved) return saved;
    } catch {
      // fallback
    }
    return 'traveller-utkarsh'; // default coordinator
  });

  // Listen for active profile changes across components or browser tabs
  useEffect(() => {
    const handleProfileChange = () => {
      try {
        const saved = localStorage.getItem(STORAGE_KEY_ACTIVE_USER);
        if (saved && saved !== activeUserId) {
          setActiveUserId(saved);
        }
      } catch (e) {
        console.warn('Error reading active user from storage', e);
      }
    };

    window.addEventListener('triptrack_user_profile_change', handleProfileChange);
    window.addEventListener('storage', handleProfileChange);
    return () => {
      window.removeEventListener('triptrack_user_profile_change', handleProfileChange);
      window.removeEventListener('storage', handleProfileChange);
    };
  }, [activeUserId]);

  // Modal open state (auto-prompt on first launch if not previously chosen)
  const [isModalOpen, setIsModalOpen] = useState<boolean>(() => {
    try {
      return !localStorage.getItem(STORAGE_KEY_ACTIVE_USER);
    } catch {
      return false;
    }
  });

  const activeUser: UserProfile =
    allProfiles.find(p => p.id === activeUserId) || allProfiles[0];

  const selectUser = useCallback((user: UserProfile) => {
    setActiveUserId(user.id);
    try {
      localStorage.setItem(STORAGE_KEY_ACTIVE_USER, user.id);
      window.dispatchEvent(new CustomEvent('triptrack_user_profile_change', { detail: user }));
    } catch (e) {
      console.error('Failed to save active user profile', e);
    }
    setIsModalOpen(false);
  }, []);

  const updateGuestName = useCallback((guestId: string, newName: string) => {
    if (!newName.trim()) return;
    setGuestNames(prev => {
      const updated = { ...prev, [guestId]: newName.trim() };
      try {
        localStorage.setItem(STORAGE_KEY_GUEST_NAMES, JSON.stringify(updated));
      } catch (e) {
        console.error('Failed to save custom guest name', e);
      }
      return updated;
    });
  }, []);

  return {
    activeUser,
    allProfiles,
    selectUser,
    updateGuestName,
    isModalOpen,
    setIsModalOpen
  };
}

