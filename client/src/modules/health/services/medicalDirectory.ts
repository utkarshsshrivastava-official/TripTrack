import { ReliefPost } from '../types/health.types';

export const NH7_MEDICAL_POSTS: ReliefPost[] = [
  {
    id: 'relief-devprayag',
    name: 'Community Health Center (CHC) Devprayag',
    location: 'NH-7 near Bhagirathi-Alaknanda Sangam',
    altitudeMeters: 475,
    primaryPhone: '01378-266225',
    altPhone: '108',
    hasOxygenCylinders: true,
    hasEmergencyBeds: true,
    notes: '24x7 Emergency OPD, basic trauma stabilization, and altitude hydration support.',
    distanceFromRishikeshKm: 71
  },
  {
    id: 'relief-srinagar',
    name: 'Govt. Medical College & Base Hospital Srinagar',
    location: 'Srinagar Garhwal, NH-7 Highway',
    altitudeMeters: 560,
    primaryPhone: '01346-252134',
    altPhone: '01346-252222',
    hasOxygenCylinders: true,
    hasEmergencyBeds: true,
    notes: 'Largest tertiary medical institution in Garhwal hills. Full ICU, ventilators, cardiac care, and 24x7 blood bank.',
    distanceFromRishikeshKm: 105
  },
  {
    id: 'relief-rudraprayag',
    name: 'District Hospital Rudraprayag',
    location: 'Near Mandakini Sangam, NH-7',
    altitudeMeters: 610,
    primaryPhone: '01364-233224',
    altPhone: '108',
    hasOxygenCylinders: true,
    hasEmergencyBeds: true,
    notes: 'District health headquarters before entering high Alaknanda gorge. Oxygen cylinder refill post.',
    distanceFromRishikeshKm: 139
  },
  {
    id: 'relief-joshimath',
    name: 'Community Health Center & Army Hospital Joshimath',
    location: 'Upper Bazaar, Joshimath',
    altitudeMeters: 1890,
    primaryPhone: '01389-222125',
    altPhone: '01389-222144',
    hasOxygenCylinders: true,
    hasEmergencyBeds: true,
    notes: 'Critical high-altitude acclimatization checkpoint. Dedicated AMS ward, portable hyperbaric chambers, and army doctors.',
    distanceFromRishikeshKm: 253
  },
  {
    id: 'relief-badrinath',
    name: 'Badrinath PHC & Army Medical Relief Camp',
    location: 'Near Temple Gate & Bus Stand, Badrinath',
    altitudeMeters: 3133,
    primaryPhone: '01381-222227',
    altPhone: '1364',
    hasOxygenCylinders: true,
    hasEmergencyBeds: true,
    notes: 'Immediate sanctum high-altitude medical post. Continuous high-flow oxygen supply, cold-injury treatment, and emergency evacuation liaison.',
    distanceFromRishikeshKm: 297
  }
];

export function getNearestReliefPost(currentAltitudeMeters: number): ReliefPost {
  // Return closest match by altitude / progression
  if (currentAltitudeMeters >= 2500) {
    return NH7_MEDICAL_POSTS[4]; // Badrinath
  } else if (currentAltitudeMeters >= 1200) {
    return NH7_MEDICAL_POSTS[3]; // Joshimath
  } else if (currentAltitudeMeters >= 580) {
    return NH7_MEDICAL_POSTS[2]; // Rudraprayag
  } else if (currentAltitudeMeters >= 500) {
    return NH7_MEDICAL_POSTS[1]; // Srinagar
  }
  return NH7_MEDICAL_POSTS[0]; // Devprayag
}
