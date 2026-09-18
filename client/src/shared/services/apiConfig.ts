/**
 * Centralized API and Security Configuration for Client
 * Provides shared x-family-pin and backend URL resolution.
 */

export const getFamilyPin = (): string => {
  try {
    const raw = localStorage.getItem('triptrack_family_pin');
    if (raw) {
      const cleaned = raw.trim().replace(/^["']|["']$/g, '');
      if (cleaned && cleaned.length === 4) {
        return cleaned;
      }
    }
  } catch {
    // Ignore storage read error
  }
  return '2026';
};

export const setFamilyPin = (pin: string): void => {
  try {
    localStorage.setItem('triptrack_family_pin', pin);
  } catch {
    // Ignore in non-browser environments
  }
};

export const getApiHeaders = (extra: Record<string, string> = {}): Record<string, string> => {
  return {
    'x-family-pin': getFamilyPin(),
    ...extra
  };
};

export const getBackendUrl = (): string => {
  if (typeof import.meta !== 'undefined' && (import.meta as any).env?.VITE_BACKEND_URL) {
    return (import.meta as any).env.VITE_BACKEND_URL;
  }
  if (typeof window !== 'undefined') {
    if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
      return 'http://localhost:5000';
    }
    // Production Render cloud backend for live Vercel deployments
    return 'https://triptrack-api.onrender.com';
  }
  return 'https://triptrack-api.onrender.com';
};

