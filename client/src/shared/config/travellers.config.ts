import { Traveller, DuoId, UserProfile } from '../types';

/**
 * =========================================================================
 * TRIPTRACK CENTRAL TRAVELLERS CONFIGURATION
 * Single Source of Truth for all Pilgrim Names, Roles, Contacts, and Vitals.
 * Modify names and details here — all UI components, filters, Gullak pool,
 * Voice Feed, and AI prompts will automatically update!
 * =========================================================================
 */

const getClientEnv = (key: string, fallback: string): string => {
  return (typeof import.meta !== 'undefined' && (import.meta as any).env && (import.meta as any).env[key]) || fallback;
};

export const TRAVELLERS_CONFIG: Traveller[] = [
  // ── Family A: Utkarsh & Rajnish Ji ─────────────────
  {
    id: "traveller-utkarsh",
    duoId: "DUO_A",
    name: getClientEnv("VITE_FAMILY_A_SON_NAME", "Utkarsh"),
    role: "COORDINATOR",
    relation: "Son / Primary Route & Tech Coordinator",
    age: Number(getClientEnv("VITE_FAMILY_A_SON_AGE", "30")),
    bloodGroup: getClientEnv("VITE_FAMILY_A_SON_BLOOD", "B+"),
    emergencyContact: getClientEnv("VITE_FAMILY_A_EMERGENCY_PHONE", "+91-9000000001"),
    avatarColor: "#2563eb", // Royal Blue
    isSeniorCitizen: false
  },
  {
    id: "traveller-rajnish",
    duoId: "DUO_A",
    name: getClientEnv("VITE_FAMILY_A_ELDER_NAME", "Rajnish"),
    role: "ELDER",
    relation: "Father / Senior Pilgrim",
    age: Number(getClientEnv("VITE_FAMILY_A_ELDER_AGE", "65")),
    bloodGroup: getClientEnv("VITE_FAMILY_A_ELDER_BLOOD", "B+"),
    emergencyContact: getClientEnv("VITE_FAMILY_A_EMERGENCY_PHONE", "+91-9000000001"),
    avatarColor: "#dc2626", // Crimson Red
    isSeniorCitizen: true,
    elderCareNotes: {
      dailyMeds: [
        "Morning blood pressure tablet after breakfast",
        "Warm water hydration every 90 minutes"
      ],
      altitudeAlertThresholdMeters: 2000,
      specialCare: "Pacing at Brahma Kapal: avoid cold wind gusts; allow seated rest between ritual steps."
    }
  },

  // ── Family B: Shreyas & Sanjay ─────────────────────
  {
    id: "traveller-shreyas",
    duoId: "DUO_B",
    name: getClientEnv("VITE_FAMILY_B_SON_NAME", "Shreyas"),
    role: "COORDINATOR",
    relation: "Cousin / Ground & Cab Support",
    age: Number(getClientEnv("VITE_FAMILY_B_SON_AGE", "28")),
    bloodGroup: getClientEnv("VITE_FAMILY_B_SON_BLOOD", "O+"),
    emergencyContact: getClientEnv("VITE_FAMILY_B_EMERGENCY_PHONE", "+91-9000000002"),
    avatarColor: "#16a34a", // Forest Green
    isSeniorCitizen: false
  },
  {
    id: "traveller-sanjay",
    duoId: "DUO_B",
    name: getClientEnv("VITE_FAMILY_B_ELDER_NAME", "Sanjay"),
    role: "ELDER",
    relation: "Uncle / Senior Pilgrim",
    age: Number(getClientEnv("VITE_FAMILY_B_ELDER_AGE", "62")),
    bloodGroup: getClientEnv("VITE_FAMILY_B_ELDER_BLOOD", "A+"),
    emergencyContact: getClientEnv("VITE_FAMILY_B_EMERGENCY_PHONE", "+91-9000000002"),
    avatarColor: "#d97706", // Warm Amber
    isSeniorCitizen: true,
    elderCareNotes: {
      dailyMeds: [
        "Routine post-meal heart & joint supplements",
        "Keep digestive lozenges handy in ghat curves"
      ],
      altitudeAlertThresholdMeters: 2000,
      specialCare: "Keep warm woolens accessible in vehicle cabin; do not load warm windcheaters into roof carrier."
    }
  }
];

// Helper subsets
export const DUO_A_MEMBERS = TRAVELLERS_CONFIG.filter(t => t.duoId === 'DUO_A');
export const DUO_B_MEMBERS = TRAVELLERS_CONFIG.filter(t => t.duoId === 'DUO_B');
export const ELDER_MEMBERS = TRAVELLERS_CONFIG.filter(t => t.isSeniorCitizen);
export const COORDINATOR_MEMBERS = TRAVELLERS_CONFIG.filter(t => !t.isSeniorCitizen);

export const DUO_A_SON = DUO_A_MEMBERS.find(t => t.role === 'COORDINATOR') || DUO_A_MEMBERS[0];
export const DUO_A_ELDER = DUO_A_MEMBERS.find(t => t.role === 'ELDER') || DUO_A_MEMBERS[1];
export const DUO_B_SON = DUO_B_MEMBERS.find(t => t.role === 'COORDINATOR') || DUO_B_MEMBERS[0];
export const DUO_B_ELDER = DUO_B_MEMBERS.find(t => t.role === 'ELDER') || DUO_B_MEMBERS[1];

export interface DuoInfo {
  id: DuoId;
  name: string;
  label: string;
  sonName: string;
  elderName: string;
  color: string;
}

export const DUO_CONFIG: Record<DuoId, DuoInfo> = {
  DUO_A: {
    id: 'DUO_A',
    name: 'Family A',
    label: `Family A (${DUO_A_SON.name}/${DUO_A_ELDER.name.split(' ')[0]})`,
    sonName: DUO_A_SON.name,
    elderName: DUO_A_ELDER.name,
    color: '#2563eb'
  },
  DUO_B: {
    id: 'DUO_B',
    name: 'Family B',
    label: `Family B (${DUO_B_SON.name}/${DUO_B_ELDER.name.split(' ')[0]})`,
    sonName: DUO_B_SON.name,
    elderName: DUO_B_ELDER.name,
    color: '#16a34a'
  }
};

export type FamilyInfo = DuoInfo;
export const FAMILY_CONFIG = DUO_CONFIG;

/**
 * Get traveller by unique ID
 */
export function getTravellerById(id: string): Traveller | undefined {
  return TRAVELLERS_CONFIG.find(t => t.id === id);
}

/**
 * Get traveller display name safely with fallback
 */
export function getTravellerName(id: string, fallback = 'General Pilgrim'): string {
  const t = getTravellerById(id);
  return t ? t.name : fallback;
}

// ── 4 Pre-Configured Home Family / Guest Profiles ──────────────────────────
export const DEFAULT_GUESTS: UserProfile[] = [
  {
    id: 'guest-1',
    name: 'Home Family 1 (Mummy)',
    type: 'GUEST',
    avatarColor: '#8b5cf6', // Violet
    roleLabel: 'Home Family',
    relation: 'Home Observer & Reassurance',
    isCustomName: true
  },
  {
    id: 'guest-2',
    name: 'Home Family 2 (Didi)',
    type: 'GUEST',
    avatarColor: '#ec4899', // Pink
    roleLabel: 'Home Family',
    relation: 'Home Observer & Reassurance',
    isCustomName: true
  },
  {
    id: 'guest-3',
    name: 'Home Family 3',
    type: 'GUEST',
    avatarColor: '#06b6d4', // Cyan
    roleLabel: 'Home Family',
    relation: 'Home Observer',
    isCustomName: true
  },
  {
    id: 'guest-4',
    name: 'Home Family 4',
    type: 'GUEST',
    avatarColor: '#14b8a6', // Teal
    roleLabel: 'Home Family',
    relation: 'Home Observer',
    isCustomName: true
  }
];

export function getPilgrimProfiles(sourceList: Traveller[] = TRAVELLERS_CONFIG): UserProfile[] {
  return sourceList.map(t => ({
    id: t.id,
    name: t.name,
    type: 'PILGRIM',
    duoId: t.duoId,
    avatarColor: t.avatarColor,
    roleLabel: t.role === 'COORDINATOR' ? `${t.duoId === 'DUO_A' ? 'Family A' : 'Family B'} Coordinator` : `${t.duoId === 'DUO_A' ? 'Family A' : 'Family B'} Senior Pilgrim`,
    relation: t.relation,
    isElder: t.isSeniorCitizen,
    bloodGroup: t.bloodGroup,
    emergencyContact: t.emergencyContact
  }));
}

export function getAllUserProfiles(
  customGuestNames: Record<string, string> = {},
  sourceList: Traveller[] = TRAVELLERS_CONFIG
): UserProfile[] {
  const pilgrims = getPilgrimProfiles(sourceList);
  const guests = DEFAULT_GUESTS.map(g => ({
    ...g,
    name: customGuestNames[g.id] || g.name
  }));
  return [...pilgrims, ...guests];
}

/**
 * Returns current active traveller ID stored in localStorage or default Utkarsh
 */
export function getActiveUserId(): string {
  if (typeof window !== 'undefined') {
    try {
      return localStorage.getItem('triptrack_active_user_id') || 'traveller-utkarsh';
    } catch {
      return 'traveller-utkarsh';
    }
  }
  return 'traveller-utkarsh';
}

/**
 * Synchronous resolver for active traveller object
 */
export function getActiveTraveller(): Traveller {
  const activeId = getActiveUserId();
  const found = TRAVELLERS_CONFIG.find(t => t.id === activeId);
  return found || TRAVELLERS_CONFIG[0];
}
