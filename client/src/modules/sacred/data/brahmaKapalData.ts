export interface SamagriItem {
  id: string;
  nameHindi: string;
  nameEnglish: string;
  quantityNote: string;
  purpose: string;
}

export interface RitualStep {
  stepNumber: number;
  title: string;
  description: string;
  mantraHindi?: string;
  significance: string;
}

export interface PandaContact {
  title: string;
  role: string;
  location: string;
  familyLineageNote: string;
  phoneNumbers: string[];
  ritualTimings: string;
}

export const BRAHMA_KAPAL_SAMAGRI: SamagriItem[] = [
  {
    id: 'sam-1',
    nameHindi: 'काले तिल (Kale Til)',
    nameEnglish: 'Black Sesame Seeds',
    quantityNote: '100 - 200g',
    purpose: 'Most essential sacred offering to ancestors for eternal peace.'
  },
  {
    id: 'sam-2',
    nameHindi: 'कुशा पवित्री (Kusha Ring)',
    nameEnglish: 'Sacred Kusha Grass Ring',
    quantityNote: '1 for each performer',
    purpose: 'Worn on right ring finger (अनामिका) during Tarpan for spiritual grounding.'
  },
  {
    id: 'sam-3',
    nameHindi: 'जौ (Jau)',
    nameEnglish: 'Barley Grains',
    quantityNote: '100g',
    purpose: 'Offered with Gangajal for satisfying Devas and Rishis.'
  },
  {
    id: 'sam-4',
    nameHindi: 'गंगाजल व तीर्थ पात्र',
    nameEnglish: 'Gangajal & Brass Lota',
    quantityNote: '1 Vessel',
    purpose: 'Alaknanda water from Brahma Kund for holy libation.'
  },
  {
    id: 'sam-5',
    nameHindi: 'सफेद अक्षत (चंदन मिश्रित)',
    nameEnglish: 'Unbroken Raw Rice with Sandalwood',
    quantityNote: '100g',
    purpose: 'Used for Pinda formulation and offering.'
  },
  {
    id: 'sam-6',
    nameHindi: 'तुलसी दल व श्वेत पुष्प',
    nameEnglish: 'Tulsi Leaves & White Flowers',
    quantityNote: '1 small packet',
    purpose: 'Essential for Vishnu Bhakti and purity of Pind Daan.'
  },
  {
    id: 'sam-7',
    nameHindi: 'शहद, कच्चा दूध व घी',
    nameEnglish: 'Honey, Raw Milk & Ghee',
    quantityNote: 'Small cups',
    purpose: 'Mixed with cooked rice/barley to shape sacred Pindas.'
  },
  {
    id: 'sam-8',
    nameHindi: 'दक्षिण वस्त्र व दक्षिणा',
    nameEnglish: 'Dhoti/Angavastram & Dakshina',
    quantityNote: 'White cloth set',
    purpose: 'Offered to Teerth Purohit post completion of ritual.'
  }
];

export const BRAHMA_KAPAL_RITUAL_STEPS: RitualStep[] = [
  {
    stepNumber: 1,
    title: 'Snan & Pavitrikaran at Tapt Kund / Alaknanda',
    description: 'Perform holy ablution at Tapt Kund hot sulphur springs or Alaknanda Brahma Kund. Wear fresh white traditional clothes (dhoti/kurta) without leather items.',
    mantraHindi: 'ॐ अपवित्रः पवित्रो वा सर्वावस्थां गतोऽपि वा। यः स्मरेत्पुण्डरीकाक्षं स बाह्याभ्यन्तरः शुचिः॥',
    significance: 'Purification of body and senses before stepping on the Moksha shila.'
  },
  {
    stepNumber: 2,
    title: 'Sankalp with Teerth Purohit',
    description: 'Face South towards the Yamuna-Ganga-Alaknanda confluence. Hold Gangajal, black sesame seeds, and Kusha grass in palms. Recite Gotra, family lineage, and names of three generations of ancestors.',
    mantraHindi: 'अद्य अमुक गोत्रस्य... तृप्तये ब्रह्मकपाल तीर्थे पिण्डदानं अहं करिष्ये।',
    significance: 'Establishes direct spiritual connection with departed parents, grandparents, and ancestors.'
  },
  {
    stepNumber: 3,
    title: 'Pind Nirman (Forming Sacred Rice Balls)',
    description: 'Shape cooked barley/rice mixed with honey, milk, ghee, and black sesame into sacred balls (Pindas) representing Pitrus (Paternal and Maternal lines).',
    significance: 'Each Pinda symbolizes sustenance and freedom from mortal bonds for departed souls.'
  },
  {
    stepNumber: 4,
    title: 'Tarpan on Brahma Shila Rock',
    description: 'Pour Gangajal through Kusha ringed fingers (Pitru Teertha angle) offering libations to Devas, Rishis, and Ancestors on the sacred flat Brahma Kapal boulder.',
    mantraHindi: 'ॐ पितृभ्यः स्वधायिभ्यः स्वधा नमः। तृप्यध्वम्, तृप्यध्वम्, तृप्यध्वम्॥',
    significance: 'Scriptures state that once Tarpan is completed at Brahma Kapal, spirits attain permanent Moksha and require no further Pind Daan anywhere in the world.'
  },
  {
    stepNumber: 5,
    title: 'Visarjan in Holy Alaknanda River',
    description: 'Gently consign the Pindas into the flowing Alaknanda river at the Brahma Kapal ghat edge with deep reverence and silent prayer.',
    significance: 'The holy waters of Alaknanda carry offerings directly into Lord Vishnu’s divine abode.'
  },
  {
    stepNumber: 6,
    title: 'Purohit Ashirwad & Badrinath Sanctum Darshan',
    description: 'Offer heartfelt dakshina to the local Panda family, record your names in the traditional Bahi-Khata ledger, and proceed directly to Shri Badrinath sanctum for Maha Darshan.',
    significance: 'Completes the highest ancestral pilgrimage duty for both families.'
  }
];

export const PANDA_REGISTER_INFO: PandaContact = {
  title: 'Brahma Kapal Teerth Purohit Register',
  role: 'Traditional Badrinath Panda Sabha',
  location: 'Brahma Kapal Ghat (100m north of Badrinath Temple sanctum, along river path)',
  familyLineageNote: 'Pilgrimage genealogy records (बही-खाता) indexed by State, District, Village, and Gotra.',
  phoneNumbers: ['01381-222212', '94120-88231', '98971-45620'],
  ritualTimings: 'Morning 06:30 AM to 01:00 PM (Best performed in morning sunlight)'
};
