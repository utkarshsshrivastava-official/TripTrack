import { Traveller } from '../types';

export const TRAVELLERS_CONFIG: Traveller[] = [
  // Duo A: Utkarsh & Rajnish Ji
  {
    id: "traveller-utkarsh",
    duoId: "DUO_A",
    name: "Utkarsh",
    role: "SON_COORDINATOR",
    relation: "Son / Primary Tech & Route Coordinator",
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
      specialCare: "Pacing at Brahma Kapal: avoid cold gust exposure; provide seated rest between tarpan rituals."
    }
  },

  // Duo B: Cousin & Uncle Ji
  {
    id: "traveller-cousin",
    duoId: "DUO_B",
    name: "Cousin",
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
    name: "Uncle (Bade Papa)",
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
        "Keep digestive lozenges handy in ghat sections"
      ],
      altitudeAlertThresholdMeters: 2000,
      specialCare: "Keep warm woolens accessible in vehicle cabin; do not pack warm windcheaters into the roof carrier."
    }
  }
];

export const DUO_A_MEMBERS = TRAVELLERS_CONFIG.filter(t => t.duoId === 'DUO_A');
export const DUO_B_MEMBERS = TRAVELLERS_CONFIG.filter(t => t.duoId === 'DUO_B');
export const ELDER_MEMBERS = TRAVELLERS_CONFIG.filter(t => t.isSeniorCitizen);
