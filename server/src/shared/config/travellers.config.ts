export interface Traveller {
  id: string;
  duoId: 'DUO_A' | 'DUO_B';
  name: string;
  role: 'COORDINATOR' | 'ELDER';
  relation: string;
  age: number;
  bloodGroup: string;
  emergencyContact: string;
  avatarColor: string;
  isSeniorCitizen: boolean;
  elderCareNotes?: {
    dailyMeds: string[];
    altitudeAlertThresholdMeters: number;
    specialCare: string;
  };
}

const getEnv = (key: string, fallback: string) => process.env[key] || fallback;

export const TRAVELLERS_CONFIG: Traveller[] = [
  // ── Family A: Utkarsh & Rajnish Ji ───────────────────────
  {
    id: "traveller-utkarsh",
    duoId: "DUO_A",
    name: getEnv("FAMILY_A_SON_NAME", "Utkarsh"),
    role: "COORDINATOR",
    relation: "Son / Primary Route & Tech Coordinator",
    age: Number(getEnv("FAMILY_A_SON_AGE", "30")),
    bloodGroup: getEnv("FAMILY_A_SON_BLOOD", "B+"),
    emergencyContact: getEnv("FAMILY_A_EMERGENCY_PHONE", "+91-9000000001"),
    avatarColor: "#2563eb",
    isSeniorCitizen: false
  },
  {
    id: "traveller-rajnish",
    duoId: "DUO_A",
    name: getEnv("FAMILY_A_ELDER_NAME", "Rajnish (Dad)"),
    role: "ELDER",
    relation: "Father / Senior Pilgrim",
    age: Number(getEnv("FAMILY_A_ELDER_AGE", "65")),
    bloodGroup: getEnv("FAMILY_A_ELDER_BLOOD", "B+"),
    emergencyContact: getEnv("FAMILY_A_EMERGENCY_PHONE", "+91-9000000001"),
    avatarColor: "#dc2626",
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

  // ── Family B: Shreyas & Sanjay ───────────────────────────
  {
    id: "traveller-shreyas",
    duoId: "DUO_B",
    name: getEnv("FAMILY_B_SON_NAME", "Shreyas"),
    role: "COORDINATOR",
    relation: "Cousin / Ground & Cab Support",
    age: Number(getEnv("FAMILY_B_SON_AGE", "28")),
    bloodGroup: getEnv("FAMILY_B_SON_BLOOD", "O+"),
    emergencyContact: getEnv("FAMILY_B_EMERGENCY_PHONE", "+91-9000000002"),
    avatarColor: "#16a34a",
    isSeniorCitizen: false
  },
  {
    id: "traveller-sanjay",
    duoId: "DUO_B",
    name: getEnv("FAMILY_B_ELDER_NAME", "Sanjay"),
    role: "ELDER",
    relation: "Uncle / Senior Pilgrim",
    age: Number(getEnv("FAMILY_B_ELDER_AGE", "62")),
    bloodGroup: getEnv("FAMILY_B_ELDER_BLOOD", "A+"),
    emergencyContact: getEnv("FAMILY_B_EMERGENCY_PHONE", "+91-9000000002"),
    avatarColor: "#d97706",
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

export function getTravellerById(id: string): Traveller | undefined {
  return TRAVELLERS_CONFIG.find(t => t.id === id);
}

export function getTravellerName(id: string, fallback = 'General Pilgrim'): string {
  const t = getTravellerById(id);
  return t ? t.name : fallback;
}
