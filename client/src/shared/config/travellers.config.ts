import { Traveller, DuoId } from '../types';

/**
 * =========================================================================
 * TRIPTRACK CENTRAL TRAVELLERS CONFIGURATION
 * Single Source of Truth for all Pilgrim Names, Roles, Contacts, and Vitals.
 * Modify names and details here — all UI components, filters, Gullak pool,
 * Voice Feed, and AI prompts will automatically update!
 * =========================================================================
 */

export const TRAVELLERS_CONFIG: Traveller[] = [
  // ── Duo A:─────────────────────────────────────────
  {
    id: "traveller-utkarsh",
    duoId: "DUO_A",
    name: "Utkarsh",
    role: "SON_COORDINATOR",
    relation: "Son / Primary Route & Tech Coordinator",
    age: 30,
    bloodGroup: "B+",
    emergencyContact: "+91-9876543210",
    avatarColor: "#2563eb", // Royal Blue
    isSeniorCitizen: false
  },
  {
    id: "traveller-rajnish",
    duoId: "DUO_A",
    name: "Rajnish (Dad)",
    role: "FATHER_ELDER",
    relation: "Father / Senior Pilgrim",
    age: 60,
    bloodGroup: "B+",
    emergencyContact: "+91-9876543210",
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

  // ── Duo B: ───────────────────────────────────────────
  {
    id: "traveller-cousin",
    duoId: "DUO_B",
    name: "Shreyas",
    role: "SON_COORDINATOR",
    relation: "Cousin / Ground & Cab Support",
    age: 28,
    bloodGroup: "O+",
    emergencyContact: "+91-9876543211",
    avatarColor: "#16a34a", // Forest Green
    isSeniorCitizen: false
  },
  {
    id: "traveller-uncle",
    duoId: "DUO_B",
    name: "Sanjay",
    role: "FATHER_ELDER",
    relation: "Uncle / Senior Pilgrim",
    age: 62,
    bloodGroup: "A+",
    emergencyContact: "+91-9876543211",
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

export const DUO_A_SON = DUO_A_MEMBERS.find(t => t.role === 'SON_COORDINATOR') || DUO_A_MEMBERS[0];
export const DUO_A_ELDER = DUO_A_MEMBERS.find(t => t.role === 'FATHER_ELDER') || DUO_A_MEMBERS[1];
export const DUO_B_SON = DUO_B_MEMBERS.find(t => t.role === 'SON_COORDINATOR') || DUO_B_MEMBERS[0];
export const DUO_B_ELDER = DUO_B_MEMBERS.find(t => t.role === 'FATHER_ELDER') || DUO_B_MEMBERS[1];

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
    name: 'Duo A',
    label: `Duo A (${DUO_A_SON.name}/${DUO_A_ELDER.name.split(' ')[0]})`,
    sonName: DUO_A_SON.name,
    elderName: DUO_A_ELDER.name,
    color: '#2563eb'
  },
  DUO_B: {
    id: 'DUO_B',
    name: 'Duo B',
    label: `Duo B (${DUO_B_SON.name}/${DUO_B_ELDER.name.split(' ')[0]})`,
    sonName: DUO_B_SON.name,
    elderName: DUO_B_ELDER.name,
    color: '#16a34a'
  }
};

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
