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
  return (typeof import.meta !== 'undefined' && (import.meta as any).env?.VITE_BACKEND_URL) ||
    (typeof window !== 'undefined' && window.location.hostname === 'localhost' ? 'http://localhost:5000' : (typeof window !== 'undefined' ? window.location.origin : ''));
};

