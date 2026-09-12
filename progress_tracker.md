# TripTrack by Ut-tech — Pilgrimage Development Tracker & Checklist

**Project:** TripTrack by Ut-tech  
**Target:** Private, Offline-First Mobile PWA for Badrinath Dham 2026 (Sep 24 – Oct 02, 2026)  
**Primary Users:** 4 Pilgrims (2 Father-Son Duos: Utkarsh & Rajnish Ji, Shreyas & Sanjay) + Extended Home Family  
**Current Status:** **Phase 1 Complete (100%)** • **Phase 2 Complete (100%)** • **Phase 3 Complete (100%)** • **Phase 4 Complete (100%)** • **Phase 4.5 In Progress (0%)** • **Phase 5 Next**  
**Last Updated:** September 12, 2026

---

## 📊 Overall Roadmap Completion

| Phase | Description | Status | Progress | Target Timeline |
| :--- | :--- | :---: | :---: | :--- |
| **Phase 1** | **Scaffolding, Mobile-First PWA & Seed Layer** | ✅ **DONE** | 100% | Completed |
| **Phase 2** | **Offline Document Vault & Gemini AI Parser** | ✅ **DONE** | 100% | Completed |
| **Phase 3** | **Itinerary Tracker & Leaflet Map Engine** | ✅ **DONE** | 100% | Completed |
| **Phase 4** | **Dead-Zone Shadow Guard & Voice Logger** | ✅ **DONE** | 100% | Completed |
| **Phase 4.5** | **Elder Care & Sacred Pilgrimage Toolkit** | ⏳ **IN PROGRESS** | 0% | Current Phase |
| **Phase 5** | **Hardening, PWA Offline Audit & Deployment** | ⏳ **NEXT** | 0% | Up Next |

---

## 🏔️ Phase-Wise Detailed Checklist & Sub-Checklists

### ✅ Phase 1: Project Scaffolding, Mobile-First PWA & Seed Layer
*Status: Completed & Verified on Sep 12, 2026*

- [x] **1.1 Workspace Monorepo Scaffolding**
  - [x] Create root [package.json](file:///d:/UTKARSH/Live%20Projects/Vercel-live-Website/TripTrack/package.json) with npm workspaces (`client`, `server`) and concurrent dev script.
  - [x] Configure shared compiler options in [tsconfig.base.json](file:///d:/UTKARSH/Live%20Projects/Vercel-live-Website/TripTrack/tsconfig.base.json).
  - [x] Configure comprehensive [.gitignore](file:///d:/UTKARSH/Live%20Projects/Vercel-live-Website/TripTrack/.gitignore).
- [x] **1.2 Mobile-First Client PWA (`client/`)**
  - [x] Initialize React 19 + TypeScript + Vite 6 workspace.
  - [x] Configure `vite-plugin-pwa` with Workbox `StaleWhileRevalidate` and `CacheFirst` strategies.
  - [x] Generate mobile PWA manifest, service worker registration (`dist/sw.js`), and favicon/icons.
  - [x] Setup Tailwind CSS with custom alpine palette, high contrast elder tokens, and safe area spacing (`env(safe-area-inset-top)` / `env(safe-area-inset-bottom)`).
  - [x] Implement [dexie.ts](file:///d:/UTKARSH/Live%20Projects/Vercel-live-Website/TripTrack/client/src/shared/db/dexie.ts) with IndexedDB stores for cached documents and queued location telemetry.
  - [x] Implement [useNetworkStatus.ts](file:///d:/UTKARSH/Live%20Projects/Vercel-live-Website/TripTrack/client/src/shared/hooks/useNetworkStatus.ts) for real-time online/offline detection and queue syncing.
- [x] **1.3 Elder-First Ergonomics & Mobile Layout**
  - [x] Create [Header.tsx](file:///d:/UTKARSH/Live%20Projects/Vercel-live-Website/TripTrack/client/src/components/Header.tsx) with connectivity pill, Duo filter selector (`All`, `Duo A`, `Duo B`), and SOS button.
  - [x] Build [EmergencyModal.tsx](file:///d:/UTKARSH/Live%20Projects/Vercel-live-Website/TripTrack/client/src/components/EmergencyModal.tsx) with 1-tap dialers (108 Ambulance, 112 Police, 1364 Yatra Line) and senior health dossiers (meds, blood groups, 2,000m altitude pacing rules).
  - [x] Build [BottomNav.tsx](file:///d:/UTKARSH/Live%20Projects/Vercel-live-Website/TripTrack/client/src/components/BottomNav.tsx) with $\ge 48\text{px}$ touch targets across 5 core views.
  - [x] Scaffold all 5 feature module views:
    - [x] [ItineraryPreview.tsx](file:///d:/UTKARSH/Live%20Projects/Vercel-live-Website/TripTrack/client/src/modules/itinerary/ItineraryPreview.tsx) (interactive milestone toggles)
    - [x] [VaultPreview.tsx](file:///d:/UTKARSH/Live%20Projects/Vercel-live-Website/TripTrack/client/src/modules/vault/VaultPreview.tsx) (cached offline pass gallery)
    - [x] [TrackingPreview.tsx](file:///d:/UTKARSH/Live%20Projects/Vercel-live-Website/TripTrack/client/src/modules/tracking/TrackingPreview.tsx) (one-tap beacon and elevation curve)
    - [x] [GullakPreview.tsx](file:///d:/UTKARSH/Live%20Projects/Vercel-live-Website/TripTrack/client/src/modules/gullak/GullakPreview.tsx) (shared cash pool and pair split)
    - [x] [VoiceFeedPreview.tsx](file:///d:/UTKARSH/Live%20Projects/Vercel-live-Website/TripTrack/client/src/modules/voice-feed/VoiceFeedPreview.tsx) (push-to-talk audio timeline)
- [x] **1.4 Server API & Mongoose Persistence (`server/`)**
  - [x] Setup Express + TypeScript with CORS, JSON body parser, and error handling.
  - [x] Implement [mongodb.ts](file:///d:/UTKARSH/Live%20Projects/Vercel-live-Website/TripTrack/server/src/shared/lib/mongodb.ts) with resilient offline/mock fallback when `MONGODB_URI` is unset.
  - [x] Implement Mongoose schemas: [segment.model.ts](file:///d:/UTKARSH/Live%20Projects/Vercel-live-Website/TripTrack/server/src/models/segment.model.ts), [document.model.ts](file:///d:/UTKARSH/Live%20Projects/Vercel-live-Website/TripTrack/server/src/models/document.model.ts), [locationPing.model.ts](file:///d:/UTKARSH/Live%20Projects/Vercel-live-Website/TripTrack/server/src/models/locationPing.model.ts), [expense.model.ts](file:///d:/UTKARSH/Live%20Projects/Vercel-live-Website/TripTrack/server/src/models/expense.model.ts).
  - [x] Implement [seed.controller.ts](file:///d:/UTKARSH/Live%20Projects/Vercel-live-Website/TripTrack/server/src/modules/seed/seed.controller.ts) (`GET /api/seed/init`) and health check (`GET /api/health`).
- [x] **1.5 Immutable Domain Truth Seeds**
  - [x] [travellers.config.ts](file:///d:/UTKARSH/Live%20Projects/Vercel-live-Website/TripTrack/client/src/shared/config/travellers.config.ts) (2 Father-Son Duos, elder care notes, blood groups).
  - [x] [trip.config.ts](file:///d:/UTKARSH/Live%20Projects/Vercel-live-Website/TripTrack/client/src/shared/config/trip.config.ts) (6 segments, 23 checkpoints, elevation metadata).

---

### ✅ Phase 2: Offline Document Vault & Gemini AI Parser
*Status: Completed & Verified on Sep 12, 2026*

- [x] **2.1 IndexedDB Raw Blob Storage Engine**
  - [x] Implement [vaultStorage.ts](file:///d:/UTKARSH/Live%20Projects/Vercel-live-Website/TripTrack/client/src/modules/vault/services/vaultStorage.ts) for direct binary Blob serialization and retrieval via Dexie.
  - [x] Generate local `URL.createObjectURL(blob)` for instant PDF and pass rendering without network, with memory revocation on close.
  - [x] Build offline storage capacity indicator (showing cached pass count and KB/MB footprint on phone storage).
- [x] **2.2 In-App Document Viewer & QR Pass Presenter**
  - [x] Build [DocumentViewerModal.tsx](file:///d:/UTKARSH/Live%20Projects/Vercel-live-Website/TripTrack/client/src/modules/vault/components/DocumentViewerModal.tsx) supporting in-app PDF rendering and full-screen biometric QR display for temple gate check-ins.
  - [x] High-contrast quick copy buttons with visual feedback for PNRs, Coach/Berth numbers, and Yatra Registration IDs.
  - [x] Support native Web Share API delegation for offline pass distribution between sons and fathers.
- [x] **2.3 Document Upload & Camera Scanner**
  - [x] Build [UploadDocDialog.tsx](file:///d:/UTKARSH/Live%20Projects/Vercel-live-Website/TripTrack/client/src/modules/vault/components/UploadDocDialog.tsx) supporting file selection and native mobile camera capture (`capture="environment"`).
  - [x] Add client-side canvas image compression via [imageCompression.ts](file:///d:/UTKARSH/Live%20Projects/Vercel-live-Website/TripTrack/client/src/modules/vault/services/imageCompression.ts) downsampling 10MB camera shots to $<500\text{KB}$.
- [x] **2.4 Backend Multimodal AI Parser (Google AI Studio)**
  - [x] Implement [vault.service.ts](file:///d:/UTKARSH/Live%20Projects/Vercel-live-Website/TripTrack/server/src/modules/vault/vault.service.ts) connecting `@google/genai` (`gemini-2.5-flash`) with structured JSON schema and heuristic regex fallback.
  - [x] Implement [vault.controller.ts](file:///d:/UTKARSH/Live%20Projects/Vercel-live-Website/TripTrack/server/src/modules/vault/vault.controller.ts) & [vault.routes.ts](file:///d:/UTKARSH/Live%20Projects/Vercel-live-Website/TripTrack/server/src/modules/vault/vault.routes.ts) with `multer` memory storage.
  - [x] Mount `/api/documents` in [app.ts](file:///d:/UTKARSH/Live%20Projects/Vercel-live-Website/TripTrack/server/src/app.ts) and verify end-to-end multipart ingest.
- [x] **2.5 Centralized Travellers Configuration & Name Decoupling**
  - [x] Establish single source of truth: [client/src/shared/config/travellers.config.ts](file:///d:/UTKARSH/Live%20Projects/Vercel-live-Website/TripTrack/client/src/shared/config/travellers.config.ts) and [server/src/shared/config/travellers.config.ts](file:///d:/UTKARSH/Live%20Projects/Vercel-live-Website/TripTrack/server/src/shared/config/travellers.config.ts).
  - [x] Decouple UI headers, Duo badges, expense splitters, voice notes, and backend Gemini prompts from hardcoded strings.
  - [x] Expose ergonomic helper selectors: `DUO_CONFIG`, `getTravellerById()`, `getTravellerName()`, and typed `Traveller` entity.

---

### ✅ Phase 3: Itinerary Tracker & Leaflet Map Engine
*Status: Completed & Verified on Sep 12, 2026*

- [x] **3.1 Dynamic Itinerary State Sync**
  - [x] Build [useItinerary.ts](file:///d:/UTKARSH/Live%20Projects/Vercel-live-Website/TripTrack/client/src/modules/itinerary/hooks/useItinerary.ts) hook syncing MongoDB segment status with local Dexie state.
  - [x] Segment lifecycle transitions: `UPCOMING` $\rightarrow$ `IN_TRANSIT` $\rightarrow$ `COMPLETED`.
  - [x] Milestone checkpoint optimistic local toggles with queue-backed background server sync.
- [x] **3.2 Logistics Inline Editor**
  - [x] Build [LogisticsEditModal.tsx](file:///d:/UTKARSH/Live%20Projects/Vercel-live-Website/TripTrack/client/src/modules/itinerary/components/LogisticsEditModal.tsx) for sons to update cab driver phone, assigned taxi plate (e.g. UK-08 commercial), and pickup bays on the fly.
  - [x] One-tap phone dialer for assigned cab drivers.
- [x] **3.3 Interactive Leaflet Pilgrimage Map**
  - [x] Implement [FamilyMap.tsx](file:///d:/UTKARSH/Live%20Projects/Vercel-live-Website/TripTrack/client/src/modules/tracking/components/FamilyMap.tsx) using Leaflet with zero-cost, zero-watermark OpenStreetMap tiles.
  - [x] Render NH-7 pilgrimage route polyline with landmark milestones (Devprayag, Srinagar, Rudraprayag, Joshimath, Badrinath, Mana).
  - [x] Custom colored avatar pins for the 4 pilgrims (Royal Blue for Utkarsh, Crimson for Rajnish Ji, Forest Green for Shreyas, Warm Amber for Sanjay).
- [x] **3.4 Live GPS & Battery Telemetry Beacon**
  - [x] Implement [telemetry.ts](file:///d:/UTKARSH/Live%20Projects/Vercel-live-Website/TripTrack/client/src/modules/tracking/services/telemetry.ts) interfacing with `navigator.geolocation` and `navigator.getBattery()`.
  - [x] Implement `broadcastPilgrimBeacon()` saving snapshots to local Dexie when offline and flushing on reconnect.

---

### ✅ Phase 4: Dead-Zone Logic & Voice Logger
*Status: Completed & Verified on Sep 12, 2026*

- [x] **4.1 Mountain Cellular Shadow Heuristic**
  - [x] Backend & frontend detector for `Date.now() - lastPingTime > 2.5 hours` while on mountain segments (`seg-3` or `seg-4`).
  - [x] Reassuring notification banner for home family explaining known gorge topography between Srinagar and Joshimath ([deadZoneHeuristic.ts](file:///d:/UTKARSH/Live%20Projects/Vercel-live-Website/TripTrack/client/src/modules/tracking/services/deadZoneHeuristic.ts)).
- [x] **4.2 Push-to-Talk Web Audio Recorder**
  - [x] Implement [audioRecorder.ts](file:///d:/UTKARSH/Live%20Projects/Vercel-live-Website/TripTrack/client/src/modules/voice-feed/services/audioRecorder.ts) utilizing `MediaRecorder` API with lightweight audio encoding (WebM/Opus) and recording timer.
  - [x] Build haptic mobile button with audio playback controls and Dexie IndexedDB storage ([voiceLogStorage.ts](file:///d:/UTKARSH/Live%20Projects/Vercel-live-Website/TripTrack/client/src/modules/voice-feed/services/voiceLogStorage.ts)).
- [x] **4.3 Gemini Voice Log Transcription & Summary**
  - [x] Backend route `/api/voice/transcribe` sending audio buffer to `gemini-2.5-flash` ([voice.service.ts](file:///d:/UTKARSH/Live%20Projects/Vercel-live-Website/TripTrack/server/src/modules/voice/voice.service.ts)).
  - [x] Multimodal prompt for Hindi/Hinglish transcription with English family reassurance summaries.
  - [x] Chronological timeline displaying speaker avatar initials, timestamp, location, and in-browser audio replay.
- [x] **4.4 Gullak Shared Pool Split Engine**
  - [x] Implement [expenseStorage.ts](file:///d:/UTKARSH/Live%20Projects/Vercel-live-Website/TripTrack/client/src/modules/gullak/services/expenseStorage.ts) with Dexie IndexedDB persistence and sample pilgrimage seeds.
  - [x] Real-time equal 50/50 split calculation between Son Coordinators (Utkarsh & Shreyas) with automated settlement banner.
  - [x] Interactive "Add Expense" dialog with category breakdown and immediate offline saving.

---

### ⏳ Phase 4.5: Elder Care & Sacred Pilgrimage Toolkit (Pre-Deployment Enhancements)
*Status: In Progress • Target: Elder Health Monitoring, Offline Chants, Ritual Liturgy & Dead-Zone Reassurance*

- [ ] **4.5.1 Elder Care & Health Suite**
  - [ ] Upgrade Dexie IndexedDB schema to `version(3)` with `oximeterLogs: 'id, travellerId, recordedAt'`.
  - [ ] Implement `oximeterStorage.ts` for $SpO_2$ & pulse logging with altitude safety thresholds ($SpO_2 < 88\%$ trigger at $>3,000\text{m}$).
  - [ ] Build `HydrationMedsTracker.tsx` with 90-minute hydration countdown chime and morning/evening BP meds checkoff for senior fathers (Rajnish Ji & Sanjay Ji).
  - [ ] Build `OximeterLoggerModal.tsx` for quick finger pulse oximeter recordings and health dossier history.
  - [ ] Build `MedicalDirectoryModal.tsx` listing NH-7 relief posts (Devprayag, Srinagar Base Hospital, Rudraprayag, Joshimath CHC, Badrinath Army Camp / PHC) with direct `tel:` dialers.
  - [ ] Wire triggers into `EmergencyModal.tsx` and main screen quick action bar.
- [ ] **4.5.2 Zero-Signal 2G SMS & WhatsApp Reassurance Generator**
  - [ ] Implement `OfflineSmsModal.tsx` generating preformatted 1-tap `sms:?body=...` and WhatsApp links.
  - [ ] Format exact GPS coordinates, altitude (e.g., 3,100m), battery level, current milestone name, and elder health reassurance text for home family.
  - [ ] Embed 2G SMS trigger directly in `TrackingPreview.tsx` alongside the Mountain Shadow Guard banner.
- [ ] **4.5.3 Brahma Kapal Pitru Tarpan Ritual Guide & Packing Checklist**
  - [ ] Build `BrahmaKapalGuideModal.tsx` providing step-by-step offline liturgy, samagri checklist (black sesame, barley, kush grass), and panda/priest contact record keeper.
  - [ ] Build `PackingChecklistModal.tsx` dynamic segment-by-segment packing checkoff (thermals, rain ponchos, power banks, medication kits).
  - [ ] Wire modal launchers into `ItineraryPreview.tsx`.
- [ ] **4.5.4 Offline Sacred Chants & Stotras Audio Player**
  - [ ] Build `OfflineStotraPlayer.tsx` in `VoiceFeedPreview.tsx`.
  - [ ] Include *Badrinath Aarti*, *Vishnu Sahasranama*, and *Hanuman Chalisa* with synced Sanskrit/Hindi lyrics, web audio synth / offline playback controls for mountain cab rides.
- [ ] **4.5.5 Yatra Memorial & 50/50 Gullak Settlement Statement**
  - [ ] Build `YatraMemorialModal.tsx` in `GullakPreview.tsx` generating a printable / shareable yatra summary card.
  - [ ] Render 50/50 split settlement statement between Utkarsh & Shreyas with category summary and one-tap print/PDF styling.
- [ ] **4.5.6 Real-Time In-Family Socket.io Chat (Local-First + Live Relay)**
  - [ ] Configure `socket.io` server attached to Express HTTP server in `server/src/server.ts`.
  - [ ] Support 4-8 group members (Pilgrim Duos + Home Observers) with live room join, typing indicators, and instant broadcast.
  - [ ] Client `useFamilySocket.ts` hook + Dexie IndexedDB `offlineChatMessages` store with dead-zone auto-queue and reconnect replay.
  - [ ] Build `FamilyChatDrawer.tsx` with high-contrast elder chat typography, quick presets ("Reached safely", "Chai break", "Taking meds"), and Duo badge tagging.
- [ ] **4.5.7 Targeted Family Email Dispatch System (Nodemailer + Google App Password)**
  - [ ] Install `nodemailer` and `@types/nodemailer` on backend.
  - [ ] Implement `email.service.ts` using Gmail SMTP (`smtp.gmail.com`) with Google App Password authentication and graceful fallback if unconfigured.
  - [ ] Centralize recipient email list (`FAMILY_NOTIFICATION_EMAILS`) in config and `.env`.
  - [ ] Beautiful alpine-themed responsive HTML email templates for:
    - Milestone Checkpoint Reassurance (with photo/notes & time)
    - Mountain Dead-Zone Entry Notice (explaining 2-3 hr gorge radio silence)
    - Emergency SOS / Critical Health Dispatch (GPS link, battery %, elder details)
  - [ ] Backend routes `/api/notifications/test-email`, `/api/notifications/milestone`, `/api/notifications/sos`.

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
2. **Local-First Supremacy:** Any action taken in a cellular dead zone (marking a checkpoint, viewing a ticket, pinging location, logging an expense, tracking $SpO_2$) must work immediately via Dexie IndexedDB and silently queue for background synchronization.
3. **Paired Duo Identity:** Always preserve duo distinctions (`DUO_A`: Utkarsh & Rajnish Ji, `DUO_B`: Shreyas & Sanjay).
4. **Zero-Cost Constraint:** Use free-tier tooling exclusively (Google AI Studio `@google/genai`, OpenStreetMap tiles via Leaflet, MongoDB Atlas M0, Vercel/Render free tiers).
