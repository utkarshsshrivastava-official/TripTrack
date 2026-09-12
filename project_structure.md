A **modular monolith** within a monorepo structure is decisively better than a traditional layered MVC pattern for this application.

In a traditional layered architecture (`controllers/`, `services/`, `models/`, `views/`), the codebase is organized around technical roles. While functional for simple CRUD, it falls apart quickly in an app that has fundamentally different execution paradigms:

* **The Document Vault** is driven by binary file streaming, IndexedDB synchronization, and multimodal AI parsing.
* **The Location Beacon** is driven by offline queued state machines, browser GPS hardware APIs, and real-time mapping.
* **The Itinerary Module** is configuration-seeded, linear, and state-bound.

With a **modular monolith**, each vertical domain (`vault`, `tracking`, `itinerary`, `voice-feed`) encapsulates its own contracts, schemas, UI views, offline handlers, and API endpoints. If you need to tweak the offline sync queue or update the Gemini parsing schema, you touch exactly one folder without triggering cross-cutting side effects.

Here is the complete, downloadable architecture and file structure specification:

---

```markdown
# Architecture & Directory Specification: TripTrack by Ut-tech

**Architecture Pattern:** Modular Monolith (Feature-Driven Domain Isolation)  
**Repository Pattern:** Decoupled Monorepo (`client/` PWA + `server/` Node API)  
**Frameworks:** React 19 (Vite + TypeScript) + Express.js 22+ (TypeScript) + MongoDB Atlas

---

## 1. Architectural Blueprint: The Modular Monolith

Rather than organizing files horizontally by framework types (e.g., throwing all controllers into one folder and all models into another), the application is organized vertically into self-contained domain modules.


```

```
                  ┌────────────────────────────────────────┐
                  │              App Shell                 │
                  │  (PWA Service Worker, Router, Auth)    │
                  └──────────────────┬─────────────────────┘
                                     │
   ┌──────────────────┬──────────────┴─────┬──────────────────┐
   ▼                  ▼                    ▼                  ▼

```

┌──────────────┐   ┌──────────────┐     ┌──────────────┐   ┌──────────────┐
│  Itinerary   │   │ Document     │     │ Tracking     │   │ Voice Feed   │
│  Module      │   │ Vault Module │     │ Module       │   │ & AI Module  │
├──────────────┤   ├──────────────┤     ├──────────────┤   ├──────────────┤
│ UI / Stores  │   │ UI / Stores  │     │ UI / Stores  │   │ UI / Stores  │
│ IndexedDB    │   │ Dexie Blobs  │     │ Ping Queue   │   │ Audio Stream │
│ API Routes   │   │ Gemini Parse │     │ Leaflet Pins │   │ Gemini STT   │
│ Segments DB  │   │ Documents DB │     │ Beacons DB   │   │ Activity DB  │
└──────────────┘   └──────────────┘     └──────────────┘   └──────────────┘
│                  │                    │                  │
└──────────────────┴──────────────┬─────┴──────────────────┘
│
┌──────────────────▼─────────────────────┐
│           Shared Kernel Layer          │
│   (Typed Configs, Network Bus, PIN)    │
└────────────────────────────────────────┘

```

### Module Boundaries
1. **Shared Kernel (`shared/`):** Contains the immutable truth (`travellers.config.ts`, `trip.config.ts`), base API clients, network status listeners, and common TypeScript interfaces.
2. **Module: Itinerary:** Controls segment transitions (`UPCOMING` $\rightarrow$ `IN_TRANSIT` $\rightarrow$ `COMPLETED`), checkpoint checkboxes, elder comfort guidelines, and altitude alert triggers.
3. **Module: Document Vault:** Manages multi-passenger PDF/image storage, zero-network IndexedDB caching, camera uploads, and Gemini AI optical parsing.
4. **Module: Tracking & Shadow Beacon:** Interfaces with phone GPS and Battery APIs, maintains the offline-to-online sync queue, and manages the Leaflet family map and cellular shadow logic.
5. **Module: Voice Feed & AI:** Handles web audio capture, audio streaming to the backend, and Google AI Studio (`gemini-2.5-flash`) transcription for the family dashboard.

---

## 2. Complete File Directory Tree

```text
triptrack-by-uttech/
├── package.json                       # Workspace root configuration
├── tsconfig.base.json                 # Shared TypeScript compiler options
├── .gitignore
├── README.md
│
├── client/                            # React 19 + Vite PWA
│   ├── index.html
│   ├── vite.config.ts                 # Includes VitePWA plugin & path aliases
│   ├── tailwind.config.ts
│   ├── postcss.config.js
│   ├── package.json
│   ├── tsconfig.json
│   │
│   ├── public/
│   │   ├── favicon.ico
│   │   ├── apple-touch-icon.png
│   │   ├── pwa-192x192.png
│   │   ├── pwa-512x512.png
│   │   └── sounds/                    # Optional subtle ping/alert audio
│   │
│   └── src/
│       ├── main.tsx                   # App mounting & PWA register
│       ├── App.tsx                    # Shell layout, tab navigation, auth guard
│       ├── index.css                  # Tailwind variables & global styles
│       │
│       ├── shared/                    # Core configs & shared utilities
│       │   ├── config/
│       │   │   ├── travellers.config.ts # The 2 Father-Son Duos profile seeds
│       │   │   └── trip.config.ts     # The 6 fixed travel segments seeds
│       │   ├── types/
│       │   │   └── index.ts           # Centralized shared domain interfaces
│       │   ├── db/
│       │   │   └── dexie.ts           # IndexedDB client database definition
│       │   ├── hooks/
│       │   │   ├── useNetworkStatus.ts# Detects online/offline browser state
│       │   │   └── useElderAlerts.ts  # Alerts on elevation & rest intervals
│       │   └── components/ui/         # shadcn/ui shared primitives (Button, Dialog, Card)
│       │
│       └── modules/                   # Independent vertical feature slices
│           ├── itinerary/
│           │   ├── components/
│           │   │   ├── SegmentCard.tsx        # Milestone card with elder notes
│           │   │   ├── CheckpointList.tsx     # One-tap checkboxes
│           │   │   └── LogisticsEditModal.tsx # In-place plate/driver updater
│           │   ├── hooks/
│           │   │   └── useItinerary.ts        # Syncs DB segments with local state
│           │   └── ItineraryView.tsx          # Full chronological list page
│           │
│           ├── vault/
│           │   ├── components/
│           │   │   ├── DocumentCard.tsx       # Document thumbnail + offline badge
│           │   │   ├── DuoFilterTabs.tsx      # Filter by All / Duo A / Duo B
│           │   │   ├── DocumentViewerModal.tsx# In-app canvas/PDF blob renderer
│           │   │   └── UploadDocDialog.tsx    # Drag-and-drop / Camera snap
│           │   ├── services/
│           │   │   └── vaultStorage.ts        # Blob-to-IndexedDB sync logic
│           │   └── VaultView.tsx              # Main document gallery page
│           │
│           ├── tracking/
│           │   ├── components/
│           │   │   ├── FamilyMap.tsx          # Leaflet map with colored duo pins
│           │   │   ├── BeaconButton.tsx       # "Ping Location" action button
│           │   │   └── ShadowNoticeBanner.tsx # >2.5 hr cellular shadow alert
│           │   ├── services/
│           │   │   ├── geolocation.ts         # Hardware GPS & Battery reader
│           │   │   └── pingQueueSync.ts       # Flushes queued pings on reconnect
│           │   └── TrackingView.tsx           # Live map & status feed page
│           │
│           └── voice-feed/
│               ├── components/
│               │   ├── PushToTalkMic.tsx      # Hold-to-record browser component
│               │   └── FeedTimeline.tsx       # Transcribed Hinglish updates list
│               ├── services/
│               │   └── audioRecorder.ts       # MediaStream recording utilities
│               └── VoiceFeedView.tsx          # Family update stream
│
└── server/                            # Node.js 22+ & Express API
    ├── package.json
    ├── tsconfig.json
    ├── .env.example
    │
    └── src/
        ├── index.ts                   # Server entrypoint & DB connection
        ├── app.ts                     # Express middleware setup & router mounting
        │
        ├── shared/
        │   ├── middleware/
        │   │   ├── auth.middleware.ts # Family 4-digit PIN verification
        │   │   └── errorHandler.ts    # Global structured API error formatter
        │   └── lib/
        │       ├── mongodb.ts         # Mongoose connection manager
        │       └── geminiClient.ts    # @google/genai SDK initialization
        │
        └── modules/                   # Backend modular domains
            ├── seed/
            │   ├── seed.controller.ts # Auto-seeds DB on first run from configs
            │   └── seed.routes.ts
            │
            ├── itinerary/
            │   ├── itinerary.model.ts      # Segment & Checkpoint Mongoose schema
            │   ├── itinerary.controller.ts # Segment PATCH & status mutations
            │   └── itinerary.routes.ts
            │
            ├── vault/
            │   ├── document.model.ts       # Document metadata schema
            │   ├── vault.controller.ts     # Cloudinary ingest & metadata sync
            │   ├── vault.service.ts        # Passes buffers to Gemini Flash parser
            │   └── vault.routes.ts
            │
            ├── tracking/
            │   ├── locationPing.model.ts   # GPS coordinate & vitals schema
            │   ├── tracking.controller.ts  # Single & bulk ping batch ingestion
            │   └── tracking.routes.ts
            │
            └── voice-feed/
                ├── voiceFeed.controller.ts # Ingests audio -> Gemini STT -> saves
                └── voiceFeed.routes.ts

```

---

## 3. Data Flow & Synchronization Strategy

```
[ USER INTERACTION (e.g. Checkpoint Ticked / GPS Pinged) ]
                          │
                          ▼
            [ Is Device Online? ]
               ├── YES ───────────────> [ REST Call to Express Backend ]
               │                                      │
               │                                      ▼
               │                            [ Write to MongoDB Atlas ]
               │                                      │
               │                                      ▼
               │                            [ Return 200 OK to Client ]
               │                                      │
               └── NO (Mountain Valley)               ▼
                          │             [ Update Local Dexie.js DB ]
                          ▼                           │
               [ Save to IndexedDB ]                  ▼
               [ Outbox Queue Table]         [ Update UI Instantly ]
                          │
                          ▼
            [ Network Returns Event ]
           (window.addEventListener('online'))
                          │
                          ▼
               [ Flush Outbox Queue ]
           (POST /api/tracking/bulk-ping)

```

---

## 4. Key Implementation Rules for Your IDE Agent

1. **Strict Feature Encapsulation:** Modules should never directly import private components from other modules. All cross-module communication must go through `src/shared/types` or `src/shared/db`.
2. **PWA Offline Integrity:** All critical static assets, icons, and fonts must be defined inside the `vite-plugin-pwa` configuration. Never fetch runtime styling or scripts from external CDNs.
3. **Blob Serialization for IndexedDB:** When a user uploads or views a PDF ticket, always persist it as a raw `Blob` in `Dexie.js`. Generate object URLs via `URL.createObjectURL(blob)` for the viewer, ensuring it renders instantly with zero connectivity.
4. **Structured JSON Output for Gemini:** Always pass explicit `responseSchema` configurations using the official `@google/genai` SDK when querying `gemini-2.5-flash` for document parsing.

```

```