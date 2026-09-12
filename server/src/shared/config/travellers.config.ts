export interface Traveller {
  id: string;
  duoId: 'DUO_A' | 'DUO_B';
  name: string;
  role: 'SON_COORDINATOR' | 'FATHER_ELDER';
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

export const TRAVELLERS_CONFIG: Traveller[] = [
  // ── Family A: Utkarsh & Rajnish Ji ───────────────────────
  {
    id: "traveller-utkarsh",
    duoId: "DUO_A",
    name: "Utkarsh",
    role: "SON_COORDINATOR",
    relation: "Son / Primary Route & Tech Coordinator",
    age: 30,
    bloodGroup: "B+",
    emergencyContact: "+91-9876543210",
    avatarColor: "#2563eb",
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

  // Duo B
  {
    id: "traveller-cousin",
    duoId: "DUO_B",
    name: "Shreyas",
    role: "SON_COORDINATOR",
    relation: "Cousin / Ground & Cab Support",
    age: 28,
    bloodGroup: "O+",
    emergencyContact: "+91-9876543211",
    avatarColor: "#16a34a",
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
