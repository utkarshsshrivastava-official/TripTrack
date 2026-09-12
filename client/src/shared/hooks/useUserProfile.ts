import { useState, useCallback } from 'react';
import { UserProfile } from '../types/user';
import { getAllUserProfiles } from '../config/travellers.config';

const STORAGE_KEY_ACTIVE_USER = 'triptrack_active_user_id';
const STORAGE_KEY_GUEST_NAMES = 'triptrack_guest_custom_names';

export function useUserProfile() {
  // Load custom guest names from localStorage
  const [guestNames, setGuestNames] = useState<Record<string, string>>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_GUEST_NAMES);
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  // All available profiles with customized guest names
  const allProfiles = getAllUserProfiles(guestNames);

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
