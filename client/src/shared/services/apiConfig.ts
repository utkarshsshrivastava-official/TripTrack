/**
 * Centralized API and Security Configuration for Client
 * Provides shared x-family-pin and backend URL resolution.
 */

export const getFamilyPin = (): string => {
  try {
    return localStorage.getItem('triptrack_family_pin') ||
      (typeof import.meta !== 'undefined' && (import.meta as any).env?.VITE_FAMILY_PIN) ||
      '2026';
  } catch {
    return '2026';
  }
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

