# TripTrack by Ut-tech — Pilgrimage Development Tracker & Checklist

**Project:** TripTrack by Ut-tech  
**Target:** Private, Offline-First Mobile PWA for Badrinath Dham 2026 (Sep 24 – Oct 02, 2026)  
**Primary Users:** 4 Pilgrims (2 Father-Son Duos: Utkarsh & Rajnish Ji, Cousin & Uncle Ji) + Extended Home Family  
**Current Status:** **Phase 1 Complete (100%)** • **Phase 2 Ready for Kickoff**  
**Last Updated:** September 12, 2026

---

## 📊 Overall Roadmap Completion

| Phase | Description | Status | Progress | Target Timeline |
| :--- | :--- | :---: | :---: | :--- |
| **Phase 1** | **Scaffolding, Mobile-First PWA & Seed Layer** | ✅ **DONE** | 100% | Completed |
| **Phase 2** | **Offline Document Vault & Gemini AI Parser** | ⏳ **NEXT** | 0% | Up Next |
| **Phase 3** | **Itinerary Tracker & Leaflet Map Engine** | 📋 **PENDING** | 0% | Following Phase 2 |
| **Phase 4** | **Dead-Zone Shadow Guard & Voice Logger** | 📋 **PENDING** | 0% | Following Phase 3 |
| **Phase 5** | **Hardening, PWA Offline Audit & Deployment** | 📋 **PENDING** | 0% | Final Polish |

---

## 🏔️ Phase-Wise Detailed Checklist & Sub-Checklists

### ✅ Phase 1: Project Scaffolding, Mobile-First PWA & Seed Layer
*Status: Completed & Verified on Sep 12, 2026*

- [x] **1.1 Workspace Monorepo Scaffolding**
  - [x] Create root `package.json` with npm workspaces (`client`, `server`) and concurrent dev script.
  - [x] Configure shared compiler options in `tsconfig.base.json`.
  - [x] Configure comprehensive `.gitignore`.
- [x] **1.2 Mobile-First Client PWA (`client/`)**
  - [x] Initialize React 19 + TypeScript + Vite 6 workspace.
  - [x] Configure `vite-plugin-pwa` with Workbox `StaleWhileRevalidate` and `CacheFirst` strategies.
  - [x] Generate mobile PWA manifest, service worker registration (`dist/sw.js`), and favicon/icons.
  - [x] Setup Tailwind CSS with custom alpine palette, high contrast elder tokens, and safe area spacing (`env(safe-area-inset-top)` / `env(safe-area-inset-bottom)`).
  - [x] Implement `dexie.ts` with IndexedDB stores for cached documents and queued location telemetry.
  - [x] Implement `useNetworkStatus.ts` for real-time online/offline detection and queue syncing.
- [x] **1.3 Elder-First Ergonomics & Mobile Layout**
  - [x] Create `Header.tsx` with connectivity pill, Duo filter selector (`All`, `Duo A`, `Duo B`), and SOS button.
  - [x] Build `EmergencyModal.tsx` with 1-tap dialers (108 Ambulance, 112 Police, 1364 Yatra Line) and senior health dossiers (meds, blood groups, 2,000m altitude pacing rules).
  - [x] Build `BottomNav.tsx` with $\ge 48\text{px}$ touch targets across 5 core views.
  - [x] Scaffold all 5 feature module views:
    - [x] `ItineraryPreview.tsx` (interactive milestone toggles)
    - [x] `VaultPreview.tsx` (cached offline pass gallery)
    - [x] `TrackingPreview.tsx` (one-tap beacon and elevation curve)
    - [x] `GullakPreview.tsx` (shared cash pool and pair split)
    - [x] `VoiceFeedPreview.tsx` (push-to-talk audio timeline)
- [x] **1.4 Server API & Mongoose Persistence (`server/`)**
  - [x] Setup Express + TypeScript with CORS, JSON body parser, and error handling.
  - [x] Implement `mongodb.ts` with resilient offline/mock fallback when `MONGODB_URI` is unset.
  - [x] Implement Mongoose schemas: `segment.model.ts`, `document.model.ts`, `locationPing.model.ts`, `expense.model.ts`.
  - [x] Implement `seed.controller.ts` (`GET /api/seed/init`) and health check (`GET /api/health`).
- [x] **1.5 Immutable Domain Truth Seeds**
  - [x] `travellers.config.ts` (2 Father-Son Duos, elder care notes, blood groups).
  - [x] `trip.config.ts` (6 segments, 23 checkpoints, elevation metadata).

---

### ⏳ Phase 2: Offline Document Vault & Gemini AI Parser
*Target: 100% Zero-Network Document Rendering & Multimodal AI Ingestion*

- [ ] **2.1 IndexedDB Raw Blob Storage Engine**
  - [ ] Implement `vaultStorage.ts` for direct binary Blob serialization and retrieval via Dexie.
  - [ ] Generate local `URL.createObjectURL(blob)` for instant PDF and pass rendering without network.
  - [ ] Build offline storage capacity indicator (showing MB cached on phone storage).
- [ ] **2.2 In-App Document Viewer & QR Pass Presenter**
  - [ ] Build `DocumentViewerModal.tsx` supporting in-app PDF rendering and full-screen biometric QR display for temple gate check-ins.
  - [ ] High-contrast quick copy buttons for PNRs, Coach/Berth numbers, and Yatra Registration IDs.
  - [ ] Support printing / native share sheet delegation for offline passes.
- [ ] **2.3 Document Upload & Camera Scanner**
  - [ ] Build `UploadDocDialog.tsx` supporting file selection and native mobile camera capture.
  - [ ] Add image compression prior to cloud upload to save battery and cellular bandwidth.
- [ ] **2.4 Backend Multimodal AI Parser (Google AI Studio)**
  - [ ] Implement `vault.controller.ts` and `vault.service.ts` connecting `@google/genai` (`gemini-2.5-flash`).
  - [ ] Define structured JSON schema for travel document parsing (PNR, seat number, registration ID, travel dates, passenger matching).
  - [ ] Build fallback parser for offline scenarios and test endpoints with mock tickets.

---

### 📋 Phase 3: Itinerary Tracker & Leaflet Map Engine
*Target: Live Milestone Progression & Duo-Pinned OpenStreetMap Routing*

- [ ] **3.1 Dynamic Itinerary State Sync**
  - [ ] Build `useItinerary.ts` hook syncing MongoDB segment status with local Dexie state.
  - [ ] Segment lifecycle transitions: `UPCOMING` $\rightarrow$ `IN_TRANSIT` $\rightarrow$ `COMPLETED`.
  - [ ] Milestone checkpoint optimistic local toggles with queue-backed background server sync.
- [ ] **3.2 Logistics Inline Editor**
  - [ ] Build `LogisticsEditModal.tsx` for sons to update cab driver phone, assigned taxi plate (e.g. UK-08 commercial), and pickup bays on the fly.
  - [ ] One-tap phone dialer for assigned cab drivers.
- [ ] **3.3 Interactive Leaflet Pilgrimage Map**
  - [ ] Implement `FamilyMap.tsx` using `react-leaflet` with zero-cost OpenStreetMap tile caching.
  - [ ] Render NH-7 pilgrimage route polyline with landmark milestones (Devprayag, Srinagar, Rudraprayag, Joshimath, Badrinath, Mana).
  - [ ] Custom colored avatar pins for the 4 pilgrims (Royal Blue for Utkarsh, Crimson for Rajnish Ji, Forest Green for Cousin, Warm Amber for Uncle Ji).
- [ ] **3.4 Live GPS & Battery Telemetry Beacon**
  - [ ] Implement `geolocation.ts` interfacing with `navigator.geolocation` and `navigator.getBattery()`.
  - [ ] Implement `triggerFamilyCheckin()` saving snapshots to local Dexie when offline and flushing on reconnect.

---

### 📋 Phase 4: Dead-Zone Logic & Voice Logger
*Target: Home Family Reassurance & Hinglish Push-to-Talk AI Feed*

- [ ] **4.1 Mountain Cellular Shadow Heuristic**
  - [ ] Backend & frontend detector for `Date.now() - lastPingTime > 2.5 hours` while on mountain segments (`seg-3` or `seg-4`).
  - [ ] Reassuring notification banner for home family explaining known gorge topography between Srinagar and Joshimath.
- [ ] **4.2 Push-to-Talk Web Audio Recorder**
  - [ ] Implement `audioRecorder.ts` utilizing `MediaRecorder` API with lightweight audio encoding (WebM/Opus).
  - [ ] Build haptic hold-to-record mobile button with live recording waveform.
- [ ] **4.3 Gemini Voice Log Transcription & Summary**
  - [ ] Backend route `/api/audio/voice-log` sending audio buffer to `gemini-2.5-flash`.
  - [ ] Prompt engineering for Hindi/Hinglish transcription with English family summaries.
  - [ ] Chronological `FeedTimeline.tsx` displaying speaker badge, timestamp, location, and quick audio replay.

---

### 📋 Phase 5: Production Hardening, PWA Audit & Deployment
*Target: Flawless Offline Reliability & Zero-Cost Cloud Hosting*

- [ ] **5.1 PWA Offline Audit**
  - [ ] Verify Chrome DevTools "Offline" throttling mode retains 100% functionality across all tabs.
  - [ ] Lighthouse audit for PWA, Accessibility (WCAG AAA contrast for elders), and Performance.
  - [ ] Service worker cache invalidation tests for updates.
- [ ] **5.2 Security & Shared PIN Access**
  - [ ] Verify `x-family-pin` authentication across all backend endpoints.
  - [ ] Rate limiting on public API endpoints.
- [ ] **5.3 Deployment Configuration**
  - [ ] Configure `vercel.json` for frontend PWA deployment.
  - [ ] Configure Render / Railway deployment for Express API.
  - [ ] Validate MongoDB Atlas M0 network access rules and environment secrets.

---

## 🧭 Key Architectural Invariants (Must Never Be Broken)

1. **Elder Dignity & High Contrast First:** All text must meet minimum contrast ratios; all touch buttons must be $\ge 48\text{px}$; no tiny links or confusing gestures.
2. **Local-First Supremacy:** Any action taken in a cellular dead zone (marking a checkpoint, viewing a ticket, pinging location, logging an expense) must work immediately via Dexie IndexedDB and silently queue for background synchronization.
3. **Paired Duo Identity:** Always preserve duo distinctions (`DUO_A`: Utkarsh & Rajnish Ji, `DUO_B`: Cousin & Uncle Ji).
4. **Zero-Cost Constraint:** Use free-tier tooling exclusively (Google AI Studio `@google/genai`, OpenStreetMap tiles via Leaflet, MongoDB Atlas M0, Vercel/Render free tiers).
