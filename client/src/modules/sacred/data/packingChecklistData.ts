export type PackingCategory = 'COLD_WEATHER' | 'MEDICAL_ELDER' | 'DOCUMENTS' | 'ELECTRONICS' | 'PUJA_RITUAL';

export interface PackingItem {
  id: string;
  category: PackingCategory;
  title: string;
  subtitle: string;
  isEssential: boolean;
}

export const PACKING_CATEGORIES: { id: PackingCategory; label: string; icon: string }[] = [
  { id: 'COLD_WEATHER', label: 'Cold Weather Gear', icon: '❄️' },
  { id: 'MEDICAL_ELDER', label: 'Elder Medical Kit', icon: '💊' },
  { id: 'DOCUMENTS', label: 'Passes & Cash', icon: '📜' },
  { id: 'ELECTRONICS', label: 'Power & Torch', icon: '⚡' },
  { id: 'PUJA_RITUAL', label: 'Puja & Rituals', icon: '🪔' }
];

export const DEFAULT_PACKING_ITEMS: PackingItem[] = [
  // Cold weather
  {
    id: 'pack-cold-1',
    category: 'COLD_WEATHER',
    title: 'Down Jacket / Heavy Parka',
    subtitle: 'Night temperatures at Badrinath (3,133m) drop below 4°C in late Sep.',
    isEssential: true
  },
  {
    id: 'pack-cold-2',
    category: 'COLD_WEATHER',
    title: 'Thermal Innerwear (Top & Bottom)',
    subtitle: '2 sets per traveller (Merino wool recommended for elders).',
    isEssential: true
  },
  {
    id: 'pack-cold-3',
    category: 'COLD_WEATHER',
    title: 'Woollen Monkey Cap / Balaclava & Muffler',
    subtitle: 'Protects ears and chest from sudden Alaknanda valley wind chills.',
    isEssential: true
  },
  {
    id: 'pack-cold-4',
    category: 'COLD_WEATHER',
    title: 'Thick Woollen Socks (3-4 Pairs)',
    subtitle: 'Keeps senior feet warm in icy morning sanctum stone pavements.',
    isEssential: true
  },
  {
    id: 'pack-cold-5',
    category: 'COLD_WEATHER',
    title: 'Windproof Gloves & Rain Poncho',
    subtitle: 'High Himalayan afternoon showers can occur without warning.',
    isEssential: false
  },

  // Medical
  {
    id: 'pack-med-1',
    category: 'MEDICAL_ELDER',
    title: 'Prescribed Daily BP & Heart Meds (10-Day Supply)',
    subtitle: 'Keep in cabin daypack with water bottle — never in checked luggage.',
    isEssential: true
  },
  {
    id: 'pack-med-2',
    category: 'MEDICAL_ELDER',
    title: 'Portable Finger Pulse Oximeter',
    subtitle: 'For logging SpO₂ twice daily at Joshimath and Badrinath.',
    isEssential: true
  },
  {
    id: 'pack-med-3',
    category: 'MEDICAL_ELDER',
    title: 'ORS Sachets & Electrolyte Powder',
    subtitle: 'Mix with warm water to prevent mountain dehydration.',
    isEssential: true
  },
  {
    id: 'pack-med-4',
    category: 'MEDICAL_ELDER',
    title: 'Diamox (Acetazolamide 125mg / 250mg)',
    subtitle: 'Emergency altitude medication (use only per doctor advice).',
    isEssential: true
  },
  {
    id: 'pack-med-5',
    category: 'MEDICAL_ELDER',
    title: 'Pain Relief Spray, Volini / Moov & Band-Aids',
    subtitle: 'For calf stiffness and knee relief after long stairs.',
    isEssential: false
  },

  // Documents
  {
    id: 'pack-doc-1',
    category: 'DOCUMENTS',
    title: 'Physical Laminated Aadhaar Cards',
    subtitle: 'Required at Joshimath and Badrinath police / SDRF verification gates.',
    isEssential: true
  },
  {
    id: 'pack-doc-2',
    category: 'DOCUMENTS',
    title: 'Yatra Biometric Registration Printouts',
    subtitle: 'Stored offline in TripTrack Vault, but physical backup is recommended.',
    isEssential: true
  },
  {
    id: 'pack-doc-3',
    category: 'DOCUMENTS',
    title: 'Physical Cash (₹10,000 in ₹100 / ₹200 / ₹500)',
    subtitle: 'Mountain road dhabas and porters have zero UPI signal in gorges.',
    isEssential: true
  },
  {
    id: 'pack-doc-4',
    category: 'DOCUMENTS',
    title: 'Hotel Vouchers & Driver Contact Slips',
    subtitle: 'Printed proof for fast check-in during late evening arrivals.',
    isEssential: false
  },

  // Electronics
  {
    id: 'pack-elec-1',
    category: 'ELECTRONICS',
    title: '20,000 mAh Heavy Duty Power Bank',
    subtitle: 'Cold weather drains lithium phone batteries 40% faster.',
    isEssential: true
  },
  {
    id: 'pack-elec-2',
    category: 'ELECTRONICS',
    title: 'Braided Fast Charging Cables (2x Type-C / Lightning)',
    subtitle: 'Keeps coordinator and elder devices continuously charged in cab.',
    isEssential: true
  },
  {
    id: 'pack-elec-3',
    category: 'ELECTRONICS',
    title: 'LED Headlamp or Strong Hand Torch',
    subtitle: 'Early morning 4:00 AM Brahma Muhurta temple queues are dark.',
    isEssential: true
  },

  // Puja / Ritual
  {
    id: 'pack-puja-1',
    category: 'PUJA_RITUAL',
    title: 'White Dhoti / Kurta-Pajama for Brahma Kapal',
    subtitle: 'Traditional dress for Pitru Tarpan and Sanctum Abhishek.',
    isEssential: true
  },
  {
    id: 'pack-puja-2',
    category: 'PUJA_RITUAL',
    title: 'Brass Puja Lota / Gangajal Vessel',
    subtitle: 'For bringing holy Alaknanda / Brahma Kund water home.',
    isEssential: false
  }
];
