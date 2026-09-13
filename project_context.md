# Project Context & Architecture Specification: TripTrack by Ut-tech

**Application Name:** TripTrack by Ut-tech  
**Target Environment:** Mobile PWA (Primary: 4 Pilgrimage Travellers — 2 Father-Son Duos) & Desktop/Mobile Web (Extended Family at Home)  
**Pilgrimage Window:** September 24, 2026 – October 02, 2026  
**Primary Mission:** An elder-centric, comfortable pilgrimage & Pitru Paksha Shraddha circuit (Brahma Kapal) minimizing physical fatigue, monitoring senior vitals/altitude, and keeping home family continuously reassured.  
**Primary Route:** Durg → New Delhi → Haridwar → Joshimath → Badrinath Dham / Mana → Rishikesh → Dehradun (DED) → Raipur (RPR) → Durg

---

## 1. High-Level Vision & Core Philosophy

TripTrack by Ut-tech is a private, family-centric, **local-first, cloud-synced Progressive Web Application (PWA)** engineered specifically around the dynamics of **two father-son pairs (two senior fathers aged 60+ and two young-adult sons acting as logistics coordinators)**.

### Key Architectural Pillars:
* **Elder-First Logistics & UI:** High-contrast displays, large tap targets, and dedicated medical/oxygen tracking for the fathers. Segment planning strictly enforces daylight driving (05:00 AM – 08:00 PM curfew compliance) and unhurried rest stops.
* **Paired Duo Profiling (Config-First):** Travellers are explicitly modeled as paired father-son units (`duoId: "duo-1"` and `duoId: "duo-2"`). The sons manage uploads, beacon pings, and expenses; the dashboard highlights senior comfort indicators (elevation, hydration, rest intervals).
* **Local-First, Cloud-Synced:** Internet in the high Himalayas is treated as an intermittent bonus. The app functions continuously even in deep cellular dead zones along NH-7 gorges. Checkpoint logs, cached document PDFs, and GPS coordinates write to local IndexedDB (`Dexie.js`) and silently synchronize with MongoDB Atlas once network coverage resumes.
* **Low-Power Checkpoint Beacons:** Avoids continuous battery-draining GPS tracking. A single tap captures coordinate snapshots, elevation, and battery health to ease anxiety for family members tracking from home.
* **Zero-Cost Multimodal AI:** Integrates Google AI Studio's `@google/genai` (`gemini-2.5-flash`) for automated extraction of travel tickets/passes and push-to-talk Hinglish voice log summaries.

---

## 2. Technology Stack

| Layer | Technology | Selection Rationale |
| :--- | :--- | :--- |
| **Frontend Framework** | **React 19 + Vite (TypeScript)** | Fast compile times, minimal footprint, and zero SSR hydration failures in offline environments. |
| **Styling & UI Kit** | **Tailwind CSS + shadcn/ui + Lucide Icons** | Accessible, elder-friendly layouts with large buttons and high color contrast. |
| **PWA & Offline Cache** | **vite-plugin-pwa (Workbox)** | Deterministic caching of app shell, icons, and static assets via `StaleWhileRevalidate`. |
| **Client Storage** | **Dexie.js (IndexedDB)** | High-performance local storage for offline PDF blobs, health notes, and outgoing ping queues. |
| **Interactive Maps** | **Leaflet + react-leaflet** | Zero-cost mapping via OpenStreetMap tiles (eliminating Google Maps API billing). |
| **Backend API** | **Node.js 22+ & Express.js** | Lightweight REST endpoints with simple shared-PIN authorization. |
| **Database** | **MongoDB Atlas (M0 Free Tier)** | Document-based persistence with Mongoose models for tracking state overrides. |
| **AI Integration** | **@google/genai (Google AI Studio)** | Free-tier `gemini-2.5-flash` model utilizing structured JSON schemas for doc parsing. |
| **File Storage** | **Cloudinary / Uploadthing** | Cloud object storage for original PDFs, registration QR passes, and expense receipts. |
| **Hosting** | **Vercel (Frontend) + Render (Backend)** | Free, production-grade cloud deployment. |

---

## 3. Pre-Seeded Configurations

### A. Travellers Seed (`src/config/travellers.config.ts`)

```typescript
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

export const TRAVELLERS_CONFIG: Traveller[] = [
  // Duo A
  {
    id: "traveller-utkarsh",
    duoId: "DUO_A",
    name: "Utkarsh",
    role: "COORDINATOR",
    relation: "Son / Primary Tech & Route Coordinator",
    age: 30,
    bloodGroup: "B+",
    emergencyContact: "+91-XXXXXXXXXX",
    avatarColor: "#2563eb", // Royal Blue
    isSeniorCitizen: false
  },
  {
    id: "traveller-rajnish",
    duoId: "DUO_A",
    name: "Rajnish (Dad)",
    role: "ELDER",
    relation: "Father / Senior Pilgrim",
    age: 60,
    bloodGroup: "B+",
    emergencyContact: "+91-XXXXXXXXXX",
    avatarColor: "#dc2626", // Crimson Red
    isSeniorCitizen: true,
    elderCareNotes: {
      dailyMeds: ["Morning blood pressure tablet after breakfast", "Warm water hydration"],
      altitudeAlertThresholdMeters: 2000,
      specialCare: "Pacing at Brahma Kapal: avoid cold wind exposure; allow seated rest between ritual steps."
    }
  },

  // Duo B
  {
    id: "traveller-shreyas",
    duoId: "DUO_B",
    name: "Cousin",
    role: "COORDINATOR",
    relation: "Cousin / Ground & Cab Support",
    age: 28,
    bloodGroup: "O+",
    emergencyContact: "+91-XXXXXXXXXX",
    avatarColor: "#16a34a", // Forest Green
    isSeniorCitizen: false
  },
  {
    id: "traveller-sanjay",
    duoId: "DUO_B",
    name: "Uncle (Bade Papa / Chacha)",
    role: "ELDER",
    relation: "Uncle / Senior Pilgrim",
    age: 62,
    bloodGroup: "A+",
    emergencyContact: "+91-XXXXXXXXXX",
    avatarColor: "#d97706", // Amber
    isSeniorCitizen: true,
    elderCareNotes: {
      dailyMeds: ["Routine post-meal meds"],
      altitudeAlertThresholdMeters: 2000,
      specialCare: "Keep warm woolens accessible in cabin; do not load warm jackets into carrier on roof."
    }
  }
];
```

### B. Trip Segments & Checkpoints (`src/config/trip.config.ts`)

```typescript
export interface Checkpoint {
  name: string;
  estimatedTime: string;
  done: boolean;
  elderComfortNote?: string;
}

export interface TripSegment {
  id: string;
  title: string;
  origin: string;
  destination: string;
  departureTime: string;
  arrivalTime: string;
  mode: 'TRAIN' | 'CAB_PLAINS' | 'CAB_HILLS' | 'FLIGHT';
  status: 'UPCOMING' | 'IN_TRANSIT' | 'COMPLETED';
  logistics: {
    serviceName: string;
    identifier: string;
    driverPhone?: string;
    pickupLocation: string;
    vehicleType?: string; // e.g., "Ertiga / Innova Crysta (AC, Roof Carrier)"
  };
  elevationMeters: number;
  isHighAltitude: boolean;
  checkpoints: Checkpoint[];
}

export const TRIP_SEED_SEGMENTS: TripSegment[] = [
  {
    id: "seg-1",
    title: "Overnight Train Transit to Capital",
    origin: "Durg Junction (DURG)",
    destination: "New Delhi Railway Station (NDLS)",
    departureTime: "2026-09-24T16:30:00+05:30",
    arrivalTime: "2026-09-25T10:40:00+05:30",
    mode: "TRAIN",
    status: "UPCOMING",
    logistics: {
      serviceName: "12441 Bilaspur Rajdhani Express",
      identifier: "PNR: Pre-booked (2AC / 3AC Berths)",
      pickupLocation: "Durg Junction Platform 1"
    },
    elevationMeters: 216,
    isHighAltitude: false,
    checkpoints: [
      { name: "Boarding at Durg Jn", estimatedTime: "16:30", done: false, elderComfortNote: "Settle fathers in lower berths" },
      { name: "Dinner & Rest", estimatedTime: "20:30", done: false, elderComfortNote: "Early sleep before Delhi arrival" },
      { name: "Arrival at NDLS (PF 1)", estimatedTime: "10:40", done: false, elderComfortNote: "Arrange coolie / wheel-assistance if needed" }
    ]
  },
  {
    id: "seg-2",
    title: "Plains Expressway Transfer",
    origin: "New Delhi (NDLS)",
    destination: "Haridwar (Devpura / Station Area)",
    departureTime: "2026-09-25T11:45:00+05:30",
    arrivalTime: "2026-09-25T17:00:00+05:30",
    mode: "CAB_PLAINS",
    status: "UPCOMING",
    logistics: {
      serviceName: "Savaari / MMT Outstation (Ertiga with Roof Carrier)",
      identifier: "Assigned ~2h prior to arrival",
      pickupLocation: "NDLS Ajmeri Gate Cab Pick-up Bay"
    },
    elevationMeters: 314,
    isHighAltitude: false,
    checkpoints: [
      { name: "Cab Meetup at NDLS", estimatedTime: "11:45", done: false, elderComfortNote: "Fathers seated in middle row" },
      { name: "Delhi-Meerut Expressway", estimatedTime: "13:00", done: false },
      { name: "Lunch Halt (Cheetal Grand / Namaste Midway)", estimatedTime: "14:15", done: false, elderComfortNote: "Clean restrooms & light meal" },
      { name: "Haridwar Hotel Check-in", estimatedTime: "17:00", done: false, elderComfortNote: "Fathers rest immediately; sons scout morning cab" }
    ]
  },
  {
    id: "seg-3",
    title: "The Mountain Ascent (NH-7 Highway)",
    origin: "Haridwar",
    destination: "Joshimath",
    departureTime: "2026-09-26T06:00:00+05:30",
    arrivalTime: "2026-09-26T16:00:00+05:30",
    mode: "CAB_HILLS",
    status: "UPCOMING",
    logistics: {
      serviceName: "Local Haridwar Agency (Ertiga/Innova Crysta)",
      identifier: "UK-08 / UK-14 Commercial Yellow Plate",
      pickupLocation: "Haridwar Hotel Porch"
    },
    elevationMeters: 1890,
    isHighAltitude: false,
    checkpoints: [
      { name: "Early Departure from Haridwar", estimatedTime: "06:00", done: false, elderComfortNote: "Motion sickness tablet 30 min before ghats if required" },
      { name: "Devprayag Sangam Viewpoint", estimatedTime: "08:30", done: false, elderComfortNote: "Quick photo stop; stretch legs" },
      { name: "Srinagar Garhwal Breakfast Halt", estimatedTime: "10:30", done: false, elderComfortNote: "Warm tea & light breakfast" },
      { name: "Rudraprayag Sangam", estimatedTime: "12:15", done: false },
      { name: "Karnaprayag / Pipalkoti Lunch", estimatedTime: "14:00", done: false },
      { name: "Arrival at Joshimath Base Hotel", estimatedTime: "16:00", done: false, elderComfortNote: "Warm water, unpack woolens, early sleep at 1,890m" }
    ]
  },
  {
    id: "seg-4",
    title: "Badrinath Dham Darshan & Brahma Kapal Rituals",
    origin: "Joshimath",
    destination: "Badrinath Dham & Mana Village",
    departureTime: "2026-09-27T05:30:00+05:30",
    arrivalTime: "2026-09-27T16:00:00+05:30",
    mode: "CAB_HILLS",
    status: "UPCOMING",
    logistics: {
      serviceName: "Dedicated Mountain Cab",
      identifier: "UK-08 / UK-14",
      pickupLocation: "Joshimath Hotel"
    },
    elevationMeters: 3130,
    isHighAltitude: true,
    checkpoints: [
      { name: "Morning Drive to Badrinath", estimatedTime: "05:30", done: false, elderComfortNote: "Fathers dressed in layered thermals + windcheaters" },
      { name: "Brahma Kapal Pind Daan & Tarpan", estimatedTime: "07:30", done: false, elderComfortNote: "Sit on mats; conduct rituals unhurriedly" },
      { name: "Badrinath Temple Darshan", estimatedTime: "10:30", done: false, elderComfortNote: "Use senior queue access or dandi/wheelchair if needed" },
      { name: "Mana Village Excursion (Vyas Gufa)", estimatedTime: "13:00", done: false, elderComfortNote: "Optional: only if fathers feel energetic" },
      { name: "Descent to Joshimath/Pipalkoti", estimatedTime: "16:00", done: false, elderComfortNote: "Descend to lower altitude for safe night sleep" }
    ]
  },
  {
    id: "seg-5",
    title: "Unhurried Descent to Rishikesh Foothills",
    origin: "Joshimath / Pipalkoti",
    destination: "Rishikesh",
    departureTime: "2026-09-28T08:30:00+05:30",
    arrivalTime: "2026-09-28T16:30:00+05:30",
    mode: "CAB_HILLS",
    status: "UPCOMING",
    logistics: {
      serviceName: "Dedicated Mountain Cab",
      identifier: "UK-08 / UK-14",
      pickupLocation: "Hotel Porch"
    },
    elevationMeters: 372,
    isHighAltitude: false,
    checkpoints: [
      { name: "Relaxed Morning Descent Departure", estimatedTime: "08:30", done: false },
      { name: "Rishikesh Hotel Check-in", estimatedTime: "16:00", done: false, elderComfortNote: "Air pressure normalizes; comfortable rest" },
      { name: "Triveni Ghat Evening Ganga Aarti", estimatedTime: "18:00", done: false, elderComfortNote: "Reserved seating along the ghat" }
    ]
  },
  {
    id: "seg-6",
    title: "Flight Return Journey Home",
    origin: "Dehradun Jolly Grant Airport (DED)",
    destination: "Raipur Airport (RPR) -> Durg",
    departureTime: "2026-10-02T09:00:00+05:30",
    arrivalTime: "2026-10-02T16:00:00+05:30",
    mode: "FLIGHT",
    status: "UPCOMING",
    logistics: {
      serviceName: "Connecting Commercial Flight",
      identifier: "Flight PNR (Cached in App)",
      pickupLocation: "DED Airport Departure Gates"
    },
    elevationMeters: 298,
    isHighAltitude: false,
    checkpoints: [
      { name: "Check-in at DED Airport", estimatedTime: "07:30", done: false, elderComfortNote: "Request senior citizen priority boarding" },
      { name: "Transit & Landing at Raipur (RPR)", estimatedTime: "TBD", done: false },
      { name: "Safe Cab Return to Durg Home", estimatedTime: "18:00", done: false }
    ]
  }
];
```

---

## 4. Database Schemas (MongoDB / Mongoose)

```typescript
import mongoose from 'mongoose';

// 1. Dynamic Segments & Checkpoints (Seeded from trip.config.ts)
export const SegmentModel = mongoose.model('Segment', new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  title: String,
  origin: String,
  destination: String,
  departureTime: Date,
  arrivalTime: Date,
  mode: { type: String, enum: ['TRAIN', 'CAB_PLAINS', 'CAB_HILLS', 'FLIGHT'] },
  status: { type: String, enum: ['UPCOMING', 'IN_TRANSIT', 'COMPLETED'], default: 'UPCOMING' },
  logistics: {
    serviceName: String,
    identifier: String,
    driverPhone: String,
    pickupLocation: String,
    vehicleType: String
  },
  elevationMeters: Number,
  isHighAltitude: Boolean,
  checkpoints: [{
    name: String,
    estimatedTime: String,
    done: { type: Boolean, default: false },
    elderComfortNote: String
  }]
}));

// 2. Document Vault (Linked to Specific Traveller / Father / Son)
export const DocumentModel = mongoose.model('Document', new mongoose.Schema({
  title: { type: String, required: true },
  category: { 
    type: String, 
    enum: ['ID_CARD', 'TRAIN_TICKET', 'FLIGHT_PASS', 'YATRA_PASS', 'HOTEL_VOUCHER'], 
    required: true 
  },
  fileUrl: { type: String, required: true },
  fileType: { type: String, required: true },
  passengerId: { type: String, required: true }, // References Traveller ID
  parsedData: {
    pnr: String,
    seatNumber: String,
    yatraRegistrationNo: String,
    validDate: String
  },
  createdAt: { type: Date, default: Date.now }
}));

// 3. Location Beacons & Vital Logs
export const LocationPingModel = mongoose.model('LocationPing', new mongoose.Schema({
  passengerId: { type: String, required: true },
  latitude: { type: Number, required: true },
  longitude: { type: Number, required: true },
  altitudeMeters: Number,
  batteryLevel: Number,
  checkpointName: String,
  note: String,
  elderVitalsNote: String, // e.g., "Dad feeling great, BP normal, tea break"
  deviceTimestamp: { type: Date, required: true },
  serverReceivedAt: { type: Date, default: Date.now }
}));

// 4. Shared Cash Ledger ("Gullak")
export const ExpenseModel = mongoose.model('Expense', new mongoose.Schema({
  title: { type: String, required: true },
  amountINR: { type: Number, required: true },
  paidBy: { type: String, required: true }, // Utkarsh or Cousin
  category: { 
    type: String, 
    enum: ['FOOD', 'TOLL_TAXI', 'RITUAL', 'PORTER_DANDI', 'HOTEL', 'MISC'] 
  },
  receiptUrl: String,
  createdAt: { type: Date, default: Date.now }
}));
```

---

## 5. Offline Engine: Client IndexedDB (`Dexie.js`)

```typescript
// src/services/offlineStorage.ts
import Dexie, { Table } from 'dexie';

export interface CachedDoc {
  id: string;
  title: string;
  category: string;
  passengerId: string;
  blobData: Blob;
  mimeType: string;
  updatedAt: number;
}

export interface QueuedPing {
  id?: number;
  passengerId: string;
  latitude: number;
  longitude: number;
  altitudeMeters?: number;
  batteryLevel?: number;
  checkpointName?: string;
  note?: string;
  elderVitalsNote?: string;
  deviceTimestamp: string;
}

class TripTrackDB extends Dexie {
  cachedDocs!: Table<CachedDoc, string>;
  queuedPings!: Table<QueuedPing, number>;

  constructor() {
    super('TripTrackDB');
    this.version(1).stores({
      cachedDocs: 'id, passengerId, category',
      queuedPings: '++id, deviceTimestamp'
    });
  }
}

export const localDB = new TripTrackDB();

// Sync function triggered when network reconnects
export async function flushQueuedPings(apiEndpoint: string) {
  const pending = await localDB.queuedPings.toArray();
  if (pending.length === 0) return;

  try {
    const res = await fetch(`${apiEndpoint}/api/tracking/bulk-ping`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ pings: pending })
    });
    if (res.ok) {
      await localDB.queuedPings.clear();
    }
  } catch (err) {
    console.warn('Network sync failed; pings retained in IndexedDB', err);
  }
}
```

---

## 6. AI Engine Services: Google AI Studio (`@google/genai`)

```typescript
// server/services/geminiService.ts
import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

// 1. Multimodal Document Parsing
export async function parseTravelDocument(fileBuffer: Buffer, mimeType: string) {
  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: [
      {
        inlineData: {
          data: fileBuffer.toString("base64"),
          mimeType: mimeType,
        },
      },
      "Extract structured travel logistics from this document. Match against configured travellers (Utkarsh, Rajnish, Cousin, Uncle). Output strict JSON only.",
    ],
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          docType: { 
            type: Type.STRING, 
            enum: ['TRAIN_TICKET', 'FLIGHT_PASS', 'HOTEL_VOUCHER', 'YATRA_PASS'] 
          },
          bookingReferenceOrPNR: { type: Type.STRING },
          passengers: { type: Type.ARRAY, items: { type: Type.STRING } },
          originOrCity: { type: Type.STRING },
          destinationOrHotel: { type: Type.STRING },
          travelDate: { type: Type.STRING },
          seatOrCoach: { type: Type.STRING }
        },
        required: ["docType", "passengers"]
      }
    }
  });

  return JSON.parse(response.text || '{}');
}

// 2. Push-to-Talk Voice Log Transcription
export async function transcribeVoiceLog(audioBuffer: Buffer, mimeType: string) {
  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: [
      {
        inlineData: {
          data: audioBuffer.toString("base64"),
          mimeType: mimeType,
        },
      },
      "Transcribe this voice log from our pilgrimage. It may contain Hindi/Hinglish updates about our fathers' well-being and road status. Translate into a concise update for the home family dashboard.",
    ],
  });

  return response.text;
}
```

---

## 7. Zero-Drain GPS Beacon & Dead-Zone Shadow Tracking

```typescript
// Client-side Beacon Trigger
export async function triggerFamilyCheckin(activePassengerId: string, vitalNote?: string) {
  if (!navigator.geolocation) return;

  navigator.geolocation.getCurrentPosition(
    async (position) => {
      let batteryPercent = 100;
      if ('getBattery' in navigator) {
        const battery: any = await (navigator as any).getBattery();
        batteryPercent = Math.round(battery.level * 100);
      }

      const pingPayload = {
        passengerId: activePassengerId,
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
        altitudeMeters: position.coords.altitude || 0,
        batteryLevel: batteryPercent,
        elderVitalsNote: vitalNote || "All well, travel on schedule",
        deviceTimestamp: new Date().toISOString()
      };

      if (navigator.onLine) {
        await fetch('/api/tracking/ping', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(pingPayload)
        });
      } else {
        // Save to IndexedDB outbox
        await localDB.queuedPings.add(pingPayload);
      }
    },
    (err) => console.error('GPS Read Error', err),
    { enableHighAccuracy: true, timeout: 8000 }
  );
}
```

### Home Dead-Zone Predictor Logic

If the backend detects `Date.now() - lastPingTime > 2.5 hours` while on mountain segments (`seg-3` or `seg-4`), the home screen displays a reassuring notification:

> ⚠️ **Mountain Cellular Shadow Zone:** The group is in transit along the Alaknanda river gorge between Srinagar and Joshimath. Cellular towers are limited in this section. Last verified check-in: Srinagar (11:20 AM). Both fathers are traveling comfortably.

---

## 8. REST API Endpoints

| Method | Route | Description |
| :--- | :--- | :--- |
| `GET` | `/api/seed/init` | Hydrates MongoDB from static configs if database is empty |
| `GET` | `/api/segments` | Returns all trip segments, checkpoints, and current states |
| `PATCH` | `/api/segments/:id` | Updates logistics (driver phone, cab number, checkpoint toggles) |
| `POST` | `/api/documents/upload` | Ingests file → runs Gemini parser → stores metadata |
| `GET` | `/api/documents/:passengerId` | Fetches documents scoped to a specific traveller |
| `POST` | `/api/tracking/ping` | Ingests live GPS coordinate snapshot and vital note |
| `POST` | `/api/tracking/bulk-ping` | Ingests batched pings accumulated during dead zones |
| `GET` | `/api/tracking/latest` | Returns latest known location for all 4 travellers |
| `POST` | `/api/audio/voice-log` | Ingests audio → Gemini processes → updates feed |

---

## 9. Implementation Roadmap for Coding Agent

```text
[Phase 1: Project Scaffolding & Seed Layer]
  ├── Initialize Vite React 19 (TypeScript) + Tailwind CSS + shadcn/ui
  ├── Configure vite-plugin-pwa with Workbox StaleWhileRevalidate strategies
  ├── Create src/config/travellers.config.ts (2 Father-Son Duos)
  ├── Create src/config/trip.config.ts (6 Fixed Itinerary Segments)
  └── Scaffold Express API server + MongoDB Mongoose models + Seed endpoint

[Phase 2: Offline Document Vault & Gemini AI Parser]
  ├── Setup Dexie.js local database schemas (cachedDocs, queuedPings)
  ├── Build Document Vault UI with Duo-based filter tabs (All, Duo A: Utkarsh/Dad, Duo B: Cousin/Uncle)
  ├── Build direct-to-blob IndexedDB downloader to ensure 100% offline document view
  └── Implement Express endpoint /api/documents/upload utilizing gemini-2.5-flash

[Phase 3: Itinerary Tracker & Map Engine]
  ├── Render chronological milestones with Elder Comfort badges
  ├── Build "One-Tap Checkpoint" toggles that persist to DB and sync on reconnect
  ├── Build Leaflet map view with 4 custom avatar pins and NH-7 route polyline
  └── Implement "Send Location Ping" button (GPS + Battery Status + Offline Dexie Queue)

[Phase 4: Dead-Zone Logic & Voice Logger]
  ├── Build home dashboard with "Dead-Zone Shadow" status detector (>2.5 hr timeout)
  ├── Implement Push-to-Talk audio recorder -> Gemini Hinglish transcription pipeline
  └── Final review: Audit PWA manifest, offline service worker, and deploy to Vercel/Render
```
