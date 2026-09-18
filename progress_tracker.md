# TripTrack by Ut-tech — Pilgrimage Development Tracker & Checklist

**Project:** TripTrack by Ut-tech  
**Target:** Private, Offline-First Mobile PWA for Badrinath Dham 2026 (Sep 24 – Oct 02, 2026)  
**Primary Users:** 4 Pilgrims (2 Families: Family A [Utkarsh & Rajnish Ji] & Family B [Shreyas & Sanjay]) + Extended Home Family (4–8 members total)  
**Current Status:** **Core System Complete (100%)** • **UI/UX App Redesign Engineering (Phases 9–14) Kickoff**  
**Last Updated:** September 13, 2026

---

## 📊 Overall Roadmap Completion

| Phase | Description | Status | Progress | Target Timeline |
| :--- | :--- | :---: | :---: | :--- |
| **Phase 1** | **Scaffolding, Mobile-First PWA & Seed Layer** | ✅ **DONE** | 100% | Completed |
| **Phase 2** | **Offline Document Vault & Gemini AI Parser** | ✅ **DONE** | 100% | Completed |
| **Phase 3** | **Itinerary Tracker & Leaflet Map Engine** | ✅ **DONE** | 100% | Completed |
| **Phase 4** | **Dead-Zone Shadow Guard & Voice Logger** | ✅ **DONE** | 100% | Completed |
| **Phase 5** | **Profile Login, Family Chat & Email Alerts** | ✅ **DONE** | 100% | Completed |
| **Phase 6** | **Elder Care, Altitude Health & Reassurance** | ✅ **DONE** | 100% | Completed |
| **Phase 7** | **Sacred Liturgy, Stotra Player & Memorial** | ✅ **DONE** | 100% | Completed |
| **Sec Milestone** | **Traveller Data Security & MongoDB Dexie Sync** | ✅ **DONE** | 100% | Completed |
| **Phase 8** | **Production Hardening, PWA Audit & Deploy** | ✅ **DONE** | 100% | Completed |
| **Phase 9** | **Unified App Shell, Slide-Out Sidebar & Design Tokens** | ✅ **DONE** | 100% | Completed |
| **Phase 10** | **Itinerary Timeline & Live Transit Cards Redesign** | ✅ **DONE** | 100% | Completed |
| **Phase 11** | **Apple Wallet-Grade Document Vault & Pass Redesign** | ✅ **DONE** | 100% | Completed |
| **Phase 12** | **Immersive Full-Bleed Map & Mountain Telemetry Redesign** | ✅ **DONE** | 100% | Completed |
| **Phase 13** | **Fintech-Grade Gullak 50/50 Shared Pool Redesign** | ✅ **DONE** | 100% | Completed |
| **Phase 14** | **Voice Studio, Audio Waveforms & Sacred Chants Redesign** | ✅ **DONE** | 100% | Completed |
| **Phase 15** | **MongoDB Atlas Family Chat Persistence & WhatsApp Engine** | ✅ **DONE** | 100% | Completed |
| **Phase 16** | **Zero-Cost Train 12441 Smart Transit Engine & IRCTC Berth Pass** | ✅ **DONE** | 100% | Completed |
| **Phase 17** | **Zero-Cost IndiGo Flight Engine & Dual-PNR Connection Tracker** | ✅ **DONE** | 100% | Completed |
| **Phase 18** | **Himalayan Route Guard, Highway Alerts & Dual-Tab Feed Hub** | ✅ **DONE** | 100% | Completed |
| **Phase 19** | **Feed Restructure: Family Feed & Live Gemini AI News Scanner** | ✅ **DONE** | 100% | Completed |
| **Phase 20** | **Chat Sync Reconciliation, App Mockup Scrub & Mobile Header Polish** | ✅ **DONE** | 100% | Completed |
| **Phase 21** | **Universal Live Data Sync: MongoDB Atlas, Socket.io & Dexie** | ✅ **DONE** | 100% | Completed |
| **Phase 22** | **Cloudinary Media Integration: Receipts, Voice Streaming & Photo Moments** | ✅ **DONE** | 100% | Completed |
| **Phase 23** | **Splitwise-Grade Multi-Payer & Custom Split Financial Engine in Gullak** | ✅ **DONE** | 100% | Completed |
| **Phase 24** | **Autonomous Scheduled & Geofenced Email Notification Engine** | ✅ **DONE** | 100% | Completed |

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
  - [x] Create [Header.tsx](file:///d:/UTKARSH/Live%20Projects/Vercel-live-Website/TripTrack/client/src/components/Header.tsx) with connectivity pill, Family filter selector (`All`, `Family A`, `Family B`), and SOS button.
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
  - [x] [travellers.config.ts](file:///d:/UTKARSH/Live%20Projects/Vercel-live-Website/TripTrack/client/src/shared/config/travellers.config.ts) (2 Families: Family A & Family B, elder care notes, blood groups).
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
  - [x] Decouple UI headers, Family badges, expense splitters, voice notes, and backend Gemini prompts from hardcoded strings.
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

### ✅ Phase 5: Individual Profile Login, Real-Time Family Chat & Email Alerts
*Status: Completed & Verified on Sep 12, 2026*

- [x] **5.1 Individual Profile Login & Guest Identity System**
  - [x] Define `UserProfile` entity supporting 4 Pilgrims (Family A: Utkarsh, Rajnish; Family B: Shreyas, Sanjay) + 4 Home Guests (`guest-1` to `guest-4`).
  - [x] Support local editable display names for guests (e.g., "Mummy", "Pooja", "Auntie") with `localStorage` persistence.
  - [x] Implement `useUserProfile.ts` hook managing active device user profile.
  - [x] Build `ProfileLoginModal.tsx`:
    - [x] First-time launch device onboarding: *"Who is using this phone?"*
    - [x] Large elder-friendly cards ($\ge 64\text{px}$) with colored initials/avatars and role badges.
    - [x] Inline name editor for guest slots.
    - [x] Header profile pill allowing 1-tap switching anytime.
  - [x] Bind active profile ID to all client actions: chat messages, GPS telemetry pings, voice recordings, and health checks.
- [x] **5.2 Real-Time In-Family Socket.io Server**
  - [x] Wrap Express server in `http.createServer(app)` and attach `socket.io` Server.
  - [x] Implement pilgrimage room management (`badrinath-family-2026`) with connected member presence (4 pilgrims + home observers).
  - [x] Socket event handlers: `join_family_room`, `send_message`, `receive_message`, `typing_indicator`, `elder_ping`.
- [x] **5.3 Local-First Chat Engine (Dexie IndexedDB)**
  - [x] Upgrade Dexie schema to include `offlineChatMessages: 'id, senderId, recipientDuo, timestamp, status'`.
  - [x] Build `chatStorage.ts` for instant offline message persistence with status flags (`queued` $\rightarrow$ `sent` $\rightarrow$ `delivered`).
  - [x] Implement `useFamilySocket.ts` hook with automatic reconnection, heartbeat, and offline queue flush upon signal recovery.
- [x] **5.4 Family Chat Drawer UI (`FamilyChatDrawer.tsx`)**
  - [x] Build slide-over / bottom-sheet mobile chat drawer with $\ge 48\text{px}$ touch targets.
  - [x] Display Family identity badges (Family A: Utkarsh / Rajnish Ji; Family B: Shreyas / Sanjay) and elder-first high contrast typography.
  - [x] Implement 1-tap quick status chips: *"Reached safely 🙏"*, *"Tea break ☕"*, *"Taking BP meds 💊"*, *"Network low, all well 👍"*.
  - [x] Add chat icon with unread badge in top `Header.tsx`.
- [x] **5.5 Targeted Family Email Dispatcher (Nodemailer + Google App Password)**
  - [x] Install `nodemailer` and `@types/nodemailer` on backend.
  - [x] Build `email.service.ts` connecting to Google SMTP (`smtp.gmail.com:465`) with `SMTP_USER` & `SMTP_APP_PASSWORD`.
  - [x] Graceful safe dry-run fallback if credentials are unset (logs HTML email to server output without throwing).
  - [x] Configure `FAMILY_NOTIFICATION_EMAILS` recipient distribution list in config and `.env`.
- [x] **5.6 Responsive Pilgrimage Email Templates**
  - [x] Checkpoint Reassurance Template (photo, timestamp, landmark name, next destination).
  - [x] Mountain Dead-Zone Entry Notice (informs family of 2–3 hour silence in Alaknanda gorges).
  - [x] Emergency SOS & Critical Alert Template (live Google Maps link, battery %, elder medical dossiers).
  - [x] Backend controller & routes: `/api/notifications/test-email`, `/api/notifications/milestone`, `/api/notifications/sos`.

---

### ✅ Phase 6: Elder Care, Altitude Health & Dead-Zone Reassurance
*Status: Completed & Verified on Sep 12, 2026*

- [x] **6.1 Dexie Pulse Oximeter Engine**
  - [x] Add `oximeterLogs: 'id, travellerId, recordedAt, spo2'` to client Dexie schema (version 4).
  - [x] Implement [oximeterStorage.ts](file:///d:/UTKARSH/Live%20Projects/Vercel-live-Website/TripTrack/client/src/modules/health/services/oximeterStorage.ts) logging $SpO_2$ %, heart rate bpm, altitude, and notes.
  - [x] Altitude safety alert heuristic: automatic warning banner if $SpO_2 < 88\%$ at elevations $>2,500\text{m}$ (Joshimath / Badrinath).
- [x] **6.2 Pulse Oximeter Logger UI (`OximeterLoggerModal.tsx`)**
  - [x] Large fingertip reading input dialog with instant normal / borderline / warning color-coded gauge.
  - [x] Historical reading sparkline/timeline for fathers (Rajnish Ji & Sanjay Ji).
- [x] **6.3 Hydration & BP Medication Cadence (`HydrationMedsModal.tsx`)**
  - [x] 90-minute hydration countdown timer with pleasant Web Audio API Himalayan chime for dry mountain air acclimatization.
  - [x] Morning & Evening BP medication checkoff toggles with timestamped logs.
  - [x] Persistent quick pills embedded in app navigation header (`SpO₂` & `Water`).
- [x] **6.4 NH-7 Emergency Relief Post Directory (`MedicalDirectoryModal.tsx`)**
  - [x] Offline medical resource directory covering NH-7 corridor:
    - Devprayag Community Health Center
    - Srinagar Government Base Medical College
    - Rudraprayag District Hospital
    - Joshimath Army / CHC Hospital
    - Badrinath Dham Army Medical Relief Camp & PHC
  - [x] 1-tap direct `tel:` dialer buttons with oxygen cylinder availability notes.
  - [x] Link launcher directly in `EmergencyModal.tsx`.
- [x] **6.5 Zero-Signal 2G SMS & WhatsApp Reassurance Generator (`OfflineSmsModal.tsx`)**
  - [x] 1-tap `sms:?body=...` generator formatted with GPS lat/lng, altitude, battery %, milestone name, and elder health status.
  - [x] Works via native cellular SMS without data packets in deep mountain dead zones.
  - [x] WhatsApp fallback trigger for momentary 2G/EDGE connectivity windows.
  - [x] Embed 2G SMS launcher in `TrackingPreview.tsx` alongside Mountain Shadow Guard banner.

---

### ✅ Phase 7: Sacred Pilgrimage Suite, Audio Chants & Memorial
*Status: Completed & Verified on Sep 12, 2026*

- [x] **7.1 Brahma Kapal Pitru Tarpan Ritual Guide (`BrahmaKapalGuideModal.tsx`)**
  - [x] Complete offline step-by-step liturgy guide for Pitru Tarpan rituals at Brahma Kapal Ghat (Badrinath).
  - [x] Samagri checklist (black sesame, barley, kush grass, gangajal, uncooked rice) with interactive checkoff counters.
  - [x] Panda / family priest contact directory and Bahi-Khata lineage register card with direct phone contacts.
- [x] **7.2 Dynamic Segment Packing Checklist (`PackingChecklistModal.tsx`)**
  - [x] Segment-specific packing checklists (thermals, down jackets, rain ponchos, power banks, medication boxes).
  - [x] Dexie IndexedDB / localStorage persistence with real-time percentage progress bar.
  - [x] Launch triggers from `ItineraryPreview.tsx`.
- [x] **7.3 Offline Sacred Chants & Stotras Player (`OfflineStotraPlayer.tsx`)**
  - [x] Built-in audio player with synced Sanskrit & Hindi lyrics in `VoiceFeedPreview.tsx`.
  - [x] Chants library: *Badrinath Aarti (Shri Badrinath Stuti)*, *Vishnu Sahasranamam*, *Hanuman Chalisa*, *Mahamrityunjaya Mantra*.
  - [x] Offline Himalayan Tanpura synthesizer drone (C# scale) using pure Web Audio API oscillators and temple bell chime.
  - [x] 108 Japa counter with haptic increment and Elder A+ font zoom toggle.
- [x] **7.4 Printable Yatra Memorial & 50/50 Gullak Settlement (`YatraMemorialModal.tsx`)**
  - [x] Generate printable / shareable pilgrimage keepsake souvenir certificate with Sanskrit header, crossed milestones, duration, and elder blessing notes.
  - [x] Complete 50/50 Gullak shared expense settlement breakdown between Utkarsh and Shreyas.
  - [x] Print-ready CSS `@media print` styling for 1-tap PDF export / physical printing without dark app chrome.

---

### ✅ Phase 8: Production Hardening, PWA Audit & Deployment
*Status: Completed & Verified on Sep 13, 2026*

- [x] **8.1 PWA Offline Audit & Map Tile Caching**
  - [x] Workbox `runtimeCaching` configured with `CacheFirst` for OpenStreetMap tiles (`https://*.tile.openstreetmap.org/*`).
  - [x] Full mobile PWA audit across all 5 navigation tabs (`Itinerary`, `Vault`, `Tracking Map`, `Gullak`, `Voice Feed`).
  - [x] Elder ergonomics verified: dedicated SOS button anchored on top right with $\ge 48\text{px}$ touch targets.
- [x] **8.2 Security & Shared PIN Access Control**
  - [x] Implemented `familyPinAuth` and `familyPinMutationsOnly` middleware verifying `x-family-pin` header (`2026`).
  - [x] Implemented zero-dependency sliding window `rateLimiter` (100 req/min per IP) protecting Gemini and MongoDB free quotas.
  - [x] Client services (`travellerStorage`, `dexie`, `voiceLogStorage`, `telemetry`, `itineraryStorage`) configured to attach `x-family-pin`.
- [x] **8.3 Cloud Deployment Configuration**
  - [x] Configured `vercel.json` (root and `client/`) for SPA routing fallback, asset caching, and PWA manifest headers.
  - [x] Configured `render.yaml` for one-click backend deployment to Render free tier with health check path `/api/health`.
  - [x] Created `client/.env.example` and verified clean `server/.env.example` with zero secrets.

---

### ✅ Phase 9: Unified App Shell, Slide-Out Sidebar & Design Tokens
*Status: Completed & Verified on Sep 13, 2026 (100%)*

- [x] **9.1 Minimalist Himalayan App Bar**
  - [x] Replace crowded multi-row header with an ultra-sleek, clean single-tier App Bar (~56px).
  - [x] Left: Hamburger menu button with active user avatar initial + Brand crest ("TripTrack '26 Badrinath Dham").
  - [x] Center-Right: Compact active Family badge toggle pill (`All`, `A`, `B`).
  - [x] Far-Right: Connection status & cloud sync button (`Wifi` / `2G`), completely eliminating horizontal overflow on mobile viewports.
  - [x] Consolidate Emergency SOS protocols as the primary sticky footer action inside the slide-out navigation drawer.
- [x] **9.2 Slide-Out Navigation Drawer / Sidebar (`AppSidebar.tsx`)**
  - [x] Gesture/tap-driven slide-out drawer (`w-80 max-w-[85vw]`) with backdrop blur (`backdrop-blur-2xl bg-slate-950/95`).
  - [x] Active device profile switcher with large elder avatar cards, role badges, and guest alias editors.
  - [x] Health quick launch section: $SpO_2$ Monitor, 90-Min Hydration timer, NH-7 Relief Post Directory, 2G SMS Dispatcher.
  - [x] Sacred suite section: Brahma Kapal Tarpan liturgy, Packing checklists, Offline Stotras & Tanpura Synthesizer, Yatra Memorial keepsake.
  - [x] Cloud sync & storage diagnostics: live network state, queued records counter, and force cloud sync button.
- [x] **9.3 Floating Glass Dock Navigation (`BottomDock.tsx`)**
  - [x] Elevated floating dock with frosted glass styling (`glass-dock backdrop-blur-2xl border border-white/12 shadow-2xl`).
  - [x] Glowing active tab indicator pill and spring animation transitions.
  - [x] Tactile haptic feedback on tab change across Itinerary, Vault, Map, Gullak, Feed.
- [x] **9.4 Design Tokens & Micro-Interactions**
  - [x] Deep alpine obsidian theme (`#060913`, `#0d1527`), subtle border glows, and custom scrollbars.
  - [x] Tap-scale physics (`tap-active active:scale-[0.96]`) across all cards and buttons.

---

### ✅ Phase 10: Itinerary Timeline & Live Transit Cards Redesign
*Status: Completed & Verified on Sep 13, 2026 (100%)*

- [x] **10.1 Vertical Transit Route Roadmap**
  - [x] Glowing transit timeline line with altitude elevation markers at Devprayag, Srinagar, Rudraprayag, Joshimath, Badrinath.
  - [x] Dynamic day selector pill strip (`DaySelectorStrip.tsx` from Sep 24 to Oct 02) with 1-tap day filtering and auto-expansion.
- [x] **10.2 Live Segment Hero Card**
  - [x] Real-time status indicator (`TransitHeroCard.tsx` with `UPCOMING`, `IN_TRANSIT`, `COMPLETED` tap-to-cycle).
  - [x] Station-to-station flighty route nodes (e.g. `DURG` $\rightarrow$ `NDLS`, `HW` $\rightarrow$ `JOSH`, `JOSH` $\rightarrow$ `BADRI`).
  - [x] Dynamic elevation ascent visualization (e.g. `312m ▲ +2,821m to 3,133m`).
  - [x] Redesigned cab & driver logistics callout card with taxi plate badge and 1-tap phone dialer.
- [x] **10.3 Checkpoint Interaction Polish**
  - [x] Interactive checkoff milestone rings (`TransitTimelineItem.tsx`) with haptic completion green glow.
  - [x] Real-time recalculation of milestone percentage and segment completion.
  - [x] High-contrast Elder Comfort notes (rest stops, hot tea, motion sickness timing, pacing).

---

### ✅ Phase 11: Apple Wallet-Grade Document Vault & Pass Redesign
*Status: Completed & Verified on Sep 13, 2026 (100%)*

- [x] **11.1 Passbook Card Stack UI**
  - [x] Physical ticket aesthetics: notched ticket edges, perforated separation lines, metallic pass headers ([WalletPassCard.tsx](file:///d:/UTKARSH/Live%20Projects/Vercel-live-Website/TripTrack/client/src/modules/vault/components/WalletPassCard.tsx)).
  - [x] Category-coded glow badges: Train (`Indigo`), Temple (`Saffron`), Cab (`Emerald`), Hotel (`Sky`), Government ID (`Slate`).
  - [x] Copyable PNR and Biometric Registration numbers with 1-tap clipboard confirmation.
- [x] **11.2 Biometric Turnstile Presenter Modal**
  - [x] High-contrast, full-screen biometric QR code with brightness boost mode for temple turnstiles ([DocumentViewerModal.tsx](file:///d:/UTKARSH/Live%20Projects/Vercel-live-Website/TripTrack/client/src/modules/vault/components/DocumentViewerModal.tsx)).
  - [x] Large copyable PNR and Coach/Seat callouts.
  - [x] Verification mode banner for Uttarakhand Police & Temple Trust barcode readers.
- [x] **11.3 Floating Action Button (FAB) Document Ingest**
  - [x] Floating upload button launching camera scanner or PDF picker without taking screen space ([VaultPreview.tsx](file:///d:/UTKARSH/Live%20Projects/Vercel-live-Website/TripTrack/client/src/modules/vault/VaultPreview.tsx)).
  - [x] Dexie offline storage footprint metric banner (100% offline security guarantee).

---

### ✅ Phase 12: Immersive Full-Bleed Map & Mountain Telemetry Redesign
*Status: Completed & Verified on Sep 13, 2026 (100%)*

- [x] **12.1 Edge-to-Edge Map Canvas**
  - [x] Full-bleed Leaflet canvas extending to screen borders with dark alpine tiles ([FamilyMap.tsx](file:///d:/UTKARSH/Live%20Projects/Vercel-live-Website/TripTrack/client/src/modules/tracking/components/FamilyMap.tsx)).
  - [x] Floating frosted control pills: Camera quick-focus (`Dham`, `Base`, `Fit Circuit`), live GPS pill, and re-center crosshair button.
  - [x] Family Duo filter integration (`All`, `Fam A`, `Fam B`).
- [x] **12.2 Animated Pilgrim Halos & Battery Rings**
  - [x] High-fidelity SVG pilgrim pins with concentric SVG battery level rings (color-coded green/amber/rose).
  - [x] Dynamic radar breath halos in each pilgrim's signature color (Royal Blue, Crimson, Forest Green, Warm Amber).
  - [x] Rich telemetry popup with location, battery %, altitude, blood group, and elder care pacing notices.
  - [x] Floating Mountain Cellular Shadow gorge banner with zero-signal 2G SMS & relief directory launchers ([TrackingPreview.tsx](file:///d:/UTKARSH/Live%20Projects/Vercel-live-Website/TripTrack/client/src/modules/tracking/TrackingPreview.tsx)).
- [x] **12.3 Collapsible Elevation Sheet & Telemetry Beacon**
  - [x] Collapsible floating bottom sheet with slim pill collapsed state and expanded elevation profile.
  - [x] Stylized NH-7 Himalayan ascent gradient curve (Durg 216m $\rightarrow$ Haridwar 314m $\rightarrow$ Rudraprayag 895m $\rightarrow$ Joshimath 1890m $\rightarrow$ Badrinath 3130m $\rightarrow$ Mana 3200m).
  - [x] One-tap pilgrim telemetry and vital beacon broadcaster with instant Dexie IndexedDB offline queueing.

---

### ✅ Phase 13: Fintech-Grade Gullak 50/50 Shared Pool Redesign
*Status: Completed & Verified on Sep 13, 2026 (100%)*

- [x] **13.1 High-Impact Balance Hero**
  - [x] Apple Card-grade obsidian glass card with gold metallic foil borders ([GullakBalanceHero.tsx](file:///d:/UTKARSH/Live%20Projects/Vercel-live-Website/TripTrack/client/src/modules/gullak/components/GullakBalanceHero.tsx)).
  - [x] Massive typography displaying total collective outlay, equal coordinator fair share, and individual contributions (Utkarsh vs Shreyas).
  - [x] Proportional segmented category spending distribution bar (Food, Cab/Tolls, Rituals, Hotel, Porters, Misc).
- [x] **13.2 50/50 Settlement Gauge & WhatsApp Dispatcher**
  - [x] Bilateral visual balance scale with dynamic needle indicating divergence from ₹0 parity ([SettlementGauge.tsx](file:///d:/UTKARSH/Live%20Projects/Vercel-live-Website/TripTrack/client/src/modules/gullak/components/SettlementGauge.tsx)).
  - [x] Clear "Who Owes Whom" settlement verdict card with exact delta amount.
  - [x] 1-tap WhatsApp audit message generator and 1-tap clipboard copy action with tactile feedback.
- [x] **13.3 Frictionless Expense Bottom Sheet & Transaction Ledger**
  - [x] Frictionless bottom sheet drawer with fast preset amount chips (`₹200`, `₹500`, `₹1,000`, `₹2,500`, `₹5,000`), title suggestions, coordinator selector, and category grid ([AddExpenseSheet.tsx](file:///d:/UTKARSH/Live%20Projects/Vercel-live-Website/TripTrack/client/src/modules/gullak/components/AddExpenseSheet.tsx)).
  - [x] Sleek itemized transaction ledger with category glyphs, delete controls, and category filter strip ([GullakPreview.tsx](file:///d:/UTKARSH/Live%20Projects/Vercel-live-Website/TripTrack/client/src/modules/gullak/GullakPreview.tsx)).
  - [x] Floating Action Button (`+ Add Expense`) for instant tap without taking vertical scroll space.

---

### ✅ Phase 14: Voice Studio, Audio Waveforms & Sacred Chants Redesign
*Status: Completed & Verified on Sep 13, 2026 (100%)*

- [x] **14.1 Waveform Voice Feed & Studio Dispatcher**
  - [x] Telegram/WhatsApp-style waveform visualization for recorded family voice notes ([AudioWaveformCard.tsx](file:///d:/UTKARSH/Live%20Projects/Vercel-live-Website/TripTrack/client/src/modules/voice-feed/components/AudioWaveformCard.tsx)).
  - [x] Variable playback speed switcher (`1.0x`, `1.25x`, `1.5x`, `2.0x`) with live scrub track and seekable waveform bars.
  - [x] Speaker avatar initials with Duo badges (`Family A` / `Family B`), timestamp, 📍 landmark, and Himalayan dead-zone reassurance pills (*"Safe & Rested"*, *"Offline Blob"*).
  - [x] Modern Push-to-Talk Voice Studio console with animated recording frequency bars, duration timer, and Gemini 2.5 Flash summary card ([VoiceFeedPreview.tsx](file:///d:/UTKARSH/Live%20Projects/Vercel-live-Website/TripTrack/client/src/modules/voice-feed/VoiceFeedPreview.tsx)).
- [x] **14.2 Sacred Chants Studio & Tanpura Soundboard**
  - [x] Glowing Himalayan Tanpura soundboard with multi-scale pitch tuning: `C# (Traditional)`, `D (Uplifting)`, `B (Deep Om)` ([sacredAudioSynth.ts](file:///d:/UTKARSH/Live%20Projects/Vercel-live-Website/TripTrack/client/src/modules/sacred/services/sacredAudioSynth.ts)).
  - [x] Authentic brass temple bell striker with acoustic decay and haptic vibration feedback.
  - [x] Synchronized Sanskrit & Hindi lyric teleprompter with auto-scroll speed controls (`1x` / `2x`) and Elder A+ high-contrast font zoom ([OfflineStotraPlayer.tsx](file:///d:/UTKARSH/Live%20Projects/Vercel-live-Website/TripTrack/client/src/modules/sacred/components/OfflineStotraPlayer.tsx)).
  - [x] Tactile 108 Japa Mala counter with circular completion ring, progress percentage, milestone haptic pulses at 27, 54, 81, and 108 beads, and celebratory chime on completion.

---

### ✅ Phase 15: MongoDB Atlas Family Chat Persistence & WhatsApp Engine
*Status: Completed & Verified on Sep 13, 2026 (100%)*

- [x] **15.1 MongoDB Atlas M0 Chat Schema & Persistence API**
  - [x] Implement [chatMessage.model.ts](file:///d:/UTKARSH/Live%20Projects/Vercel-live-Website/TripTrack/server/src/models/chatMessage.model.ts) Mongoose schema with unique client-side message IDs, indexed timestamps, sender metadata, and delivered status.
  - [x] Implement [chat.controller.ts](file:///d:/UTKARSH/Live%20Projects/Vercel-live-Website/TripTrack/server/src/modules/chat/chat.controller.ts) (`GET /api/chat/history`, `POST /api/chat/sync`) with bulk upsert operations.
  - [x] Mount `/api/chat` with `familyPinMutationsOnly` auth in [app.ts](file:///d:/UTKARSH/Live%20Projects/Vercel-live-Website/TripTrack/server/src/app.ts).
- [x] **15.2 Real-Time Dual-Layer Sync Engine**
  - [x] Update [socket.service.ts](file:///d:/UTKARSH/Live%20Projects/Vercel-live-Website/TripTrack/server/src/modules/chat/socket.service.ts) to asynchronously persist incoming messages to MongoDB Atlas before broadcasting.
  - [x] Emit `message_ack` with `status: 'delivered'` back to the sender.
  - [x] Update [chatStorage.ts](file:///d:/UTKARSH/Live%20Projects/Vercel-live-Website/TripTrack/client/src/modules/chat/services/chatStorage.ts) with `syncWithCloudHistory()` to merge cloud messages into local Dexie without overwriting local queued messages.
  - [x] Implement `bulkSyncQueuedMessages()` HTTP fallback to flush dead-zone queued messages.
  - [x] Enhance [useFamilySocket.ts](file:///d:/UTKARSH/Live%20Projects/Vercel-live-Website/TripTrack/client/src/modules/chat/hooks/useFamilySocket.ts) to hydrate from MongoDB on mount, reconnect, and `online` window events.
- [x] **15.3 WhatsApp-Grade Visual Polish & Group Chat Ergonomics**
  - [x] Floating bottom-left chat bubble launcher ([FloatingChatButton.tsx](file:///d:/UTKARSH/Live%20Projects/Vercel-live-Website/TripTrack/client/src/components/FloatingChatButton.tsx)) coexisting frictionlessly with Gullak FAB and zero header crowding.
  - [x] Date divider chips ("Today", "Yesterday", or formatted Indian calendar date) grouping messages ([FamilyChatDrawer.tsx](file:///d:/UTKARSH/Live%20Projects/Vercel-live-Website/TripTrack/client/src/modules/chat/components/FamilyChatDrawer.tsx)).
  - [x] WhatsApp-grade delivery receipt indicators: Gray clock for `queued`, single gray tick for `sent`, double bold emerald checkmarks for `delivered`.
  - [x] High-contrast elder typography, quick status chips (*"Reached safely 🙏"*, *"Tea break ☕"*, etc.), and live typing indicators.

---

### ✅ Phase 16: Zero-Cost Train 12441 Smart Transit Engine & Official IRCTC Ticket Integration
*Status: Completed & Verified on Sep 13, 2026 (100%)*

- [x] **16.1 Official IRCTC Ticket & Passenger Bay Data Grounding**
  - [x] Ground official confirmed PNR `6709136735` (Class 2A, Durg to New Delhi, 1362 km) in `trip.config.ts` and `vaultStorage.ts`.
  - [x] Store confirmed 4-berth private bay assignments in Coach A2:
    - Sanjay Shrivasta (62, Family B Elder): Berth 19 (Lower, Veg)
    - Shreyas Shrivast (28, Family B Son): Berth 20 (Upper, Veg)
    - Rajnish Shrivast (65, Family A Elder): Berth 21 (Lower, Jain Meal)
    - Utkarsh Shrivast (30, Family A Son): Berth 22 (Upper, Veg)
- [x] **16.2 Zero-Cost 12441 Timetable & Real-Time Interpolation Engine (`rajdhani12441.ts`)**
  - [x] 11 key stations with exact scheduled timings, distances, and elder comfort markers (Dinner, BP meds, night sleep, morning tea).
  - [x] Real-time timetable interpolation calculating current station stretch, speed, and ETA to Delhi based on clock.
  - [x] Optional free-tier sandbox API slot with automatic offline fallback.
- [x] **16.3 Family Delay Synchronization & Cloud Persistence**
  - [x] Server endpoint `/api/train/12441/delay` and `/api/train/12441/status` with MongoDB persistence and WebSockets sync.
  - [x] Quick buttons (`+15m`, `+30m`, `Reset On-Time`) to recalculate Delhi arrival and cab pickup across all family devices.
- [x] **16.4 Interactive Live Rajdhani Transit Drawer (`RajdhaniTrackerDrawer.tsx`)**
  - [x] Full-bleed responsive sheet accessible from Day 1 Itinerary card.
  - [x] Official IRCTC Confirmed Bay card with 1-tap PNR copy.
  - [x] Vertical station journey line with passed/current/upcoming stations.
  - [x] 1-tap RailMadad (139) & "Where Is My Train" deep launcher.

---

### ✅ Phase 17: Zero-Cost IndiGo Flight Engine & Dual-PNR Connection Tracker
*Status: Completed & Verified on Sep 13, 2026 (100%)*

- [x] **17.1 Ground Official Dual-PNR IndiGo Return Tickets**
  - [x] Sons' Ticket (Utkarsh & Shreyas): Confirmed PNR `VGLHWK`
    - Leg 1 (DED-DEL): Seat 28E (Utkarsh, Middle), Seat 28F (Shreyas, Window)
    - Leg 2 (DEL-RPR): Seat 28B (Utkarsh, Middle), Seat 28A (Shreyas, Window)
  - [x] Senior Citizens' Ticket (Sanjay Ji & Rajnish Ji): Confirmed PNR `L8CM7C`
    - Leg 1 (DED-DEL): Seat 27F (Sanjay Ji, Window), Seat 27E (Rajnish Ji, Middle)
    - Leg 2 (DEL-RPR): Seat 27A (Sanjay Ji, Window), Seat 27B (Rajnish Ji, Middle)
  - [x] Update Segment 6 in `trip.config.ts` (dep: 13:15, arr: 18:10) and `vaultStorage.ts`.
- [x] **17.2 IndiGo 2-Leg Schedule & Delhi T2 -> T1 Connection Health Evaluator (`flight6E.ts`)**
  - [x] Leg 1: 6E 2476 (Dehradun DED 13:15 -> Delhi DEL T2 14:10, 55 mins)
  - [x] Inter-terminal transit: Delhi T2 -> T1 Shuttle Transfer guide (130 mins scheduled layover)
  - [x] Connection health badge (🟢 Healthy > 90m, 🟡 Moderate 60-90m, 🔴 Tight < 60m)
  - [x] Leg 2: 6E 734 (Delhi DEL T1 16:20 -> Raipur RPR 18:10, 1h 50m)
- [x] **17.3 Family Delay & Connection Sync Engine**
  - [x] Server endpoint `/api/flight/6e/delay` and `/api/flight/6e/status` with MongoDB persistence and WebSockets sync.
  - [x] 1-tap delay simulator (+15m, +30m, +45m, On-Time) to dynamically recalculate remaining layover minutes at Delhi.
- [x] **17.4 Interactive IndiGo Flight Tracker Drawer (`FlightTrackerDrawer.tsx`)**
  - [x] Slide-out responsive sheet accessible from Day 1 Itinerary card and Segment 6 card.
  - [x] Dual PNR copy pills (`VGLHWK` & `L8CM7C`) with haptic check.
  - [x] Row 27 (Fathers) & Row 28 (Sons) visual cabin seating layout.
  - [x] 1-tap IndiGo Support (+91 9910383838) and web check-in launcher.

---

### ✅ Phase 18: Himalayan Route Guard, Highway Alerts & Dual-Tab Feed Hub
*Status: Completed & Verified on Sep 13, 2026 (100%)*

- [x] **18.1 Dexie DB v6 Offline Route Alerts Table**
  - [x] Add `offlineRouteAlerts: 'id, stretch, severity, eventType, timestamp, isFamilyReport'` in `dexie.ts`.
  - [x] Support local caching of server alerts and crowdsourced family spotter records.
- [x] **18.2 Zero-Cost Google News RSS & Gemini 2.5 Flash Pipeline**
  - [x] Build `routeAlert.service.ts` to ingest free public Google News RSS for NH-7 / Badrinath landslides.
  - [x] Classify and structure raw news into normalized disruption objects using `gemini-2.5-flash` with in-memory caching and fallback heuristics.
  - [x] Express endpoints `GET /api/alerts/route-status` and `POST /api/alerts/report`.
- [x] **18.3 Dual-Tab Feed Hub in Bottom Navigation**
  - [x] Refactor `VoiceFeedPreview.tsx` to host top segmented switcher: `[ 🎙️ Family Voice Studio ]` & `[ 🏔️ Route Guard & Alerts ]`.
  - [x] Maintain state and audio playback across tab changes without unmounting active voice recording or player.
- [x] **18.4 Interactive NH-7 Corridor Health & Alert UI (`RouteGuardTab.tsx`)**
  - [x] Corridor Health Bar spanning Haridwar to Badrinath across 6 segments (🟢 Clear, 🟡 Caution, 🔴 Blocked).
  - [x] Alert cards with BRO clearance status, severity badges, and source attribution.
  - [x] Emergency dialers: Highway Police (`112`), BRO (`1364`), SDRF (`1070`).
- [x] **18.5 Crowdsourced Family Road Spotter (`ReportObstructionModal.tsx`)**
  - [x] 1-tap modal for Utkarsh & Shreyas to report landslides, falling rocks, or traffic halts with estimated delays.
  - [x] Offline-first Dexie queueing and optimistic UI updates with cloud sync.

---

### ✅ Phase 19: Feed Restructure: Family Feed & Live Gemini AI News Scanner
*Status: Completed & Verified on Sep 17, 2026 (100%)*

- [x] **19.1 Feed Architecture Restructure into 2 Dedicated Tabs**
  - [x] Restructured `VoiceFeedPreview.tsx` to switch cleanly between **Family Feed** (`FAMILY`) and **News Feed** (`NEWS`).
  - [x] Retained accessible header banner for Sacred Chants & Tanpura Drone audio soundboard.
- [x] **19.2 Family Feed & Dynamic Journey Timeline (`FamilyFeedTab.tsx` & `familyFeedStorage.ts`)**
  - [x] Unified timeline stream combining itinerary milestones, cab updates, and audio voice broadcasts.
  - [x] Modular Voice Studio feature: streamlined collapsible dispatcher with push-to-talk microphone, real-time audio visualizer bars, and Gemini AI speech summarizer.
  - [x] Quick Travel Update bar with 1-tap preset chips (`📍 Arrived Delhi`, `🚕 Cab Boarded`, `☕ Tea Halt`, `🏨 Hotel Check-in`, `🛕 Darshan Done`).
  - [x] Automatic sync: checking off checkpoints in `itineraryStorage.ts` or updating cab logistics automatically creates rich cards in the Family Feed.
  - [x] Duo & type filtering: `All Stream`, `Milestones`, `Voice Notes`, `Cab & Transit`, and `Family A / Family B`.
- [x] **19.3 Live Gemini AI Route News Scanner & Ground Intelligence (`routeAlert.service.ts` & `RouteGuardTab.tsx`)**
  - [x] 1-tap **"✨ Scan Live Route Intel (Gemini AI)"** button calling `POST /api/alerts/scan-live`.
  - [x] Ingests public Google News RSS and synthesizes up-to-date NH-7 route bulletins via `gemini-2.5-flash` (`@google/genai`).
  - [x] Categorized news cards for landslides & rockfalls, rain & river warnings, Badrinath Darshan queues, and cab driver advisories.
  - [x] Topic filter chips (`All Route Intel`, `🚨 Landslides & Blocks`, `🌧️ Weather & Rain`, `🛕 Temple & Yatra`, `🚗 Highway Transit`).
  - [x] 1-tap WhatsApp sharing and emergency helplines (`112 Police`, `1364 Yatra`, `1070 SDRF`).

---

### ✅ Phase 20: Chat Sync Reconciliation, App Mockup Scrub & Mobile Header Polish
*Status: Completed & Verified on Sep 17, 2026 (100%)*

- [x] **20.1 Chat Cloud Deletion Reconciliation & Broadcast Synchronization**
  - [x] Fixed root cause of chat messages reappearing: `syncWithCloudHistory()` in `chatStorage.ts` now detects messages removed from MongoDB Atlas and purges local Dexie records accordingly.
  - [x] Added `DELETE /api/chat/history` endpoint in `chat.controller.ts` and `chat.routes.ts` (`ChatMessageModel.deleteMany({})`).
  - [x] Emits `chat_history_cleared` socket event to instantly purge Dexie and reset UI across all active family devices.
  - [x] Added "Clear All Chat" (`Trash2`) button with confirmation banner (`Delete all messages for everyone?`) in `FamilyChatDrawer.tsx`.
- [x] **20.2 Complete Mockup Dummy Data Scrub Across App Modules**
  - [x] Gullak (`expenseStorage.ts`): Emptied `INITIAL_EXPENSE_SEEDS = []` and added auto-purge for legacy `exp-1`..`exp-4` IDs, ensuring initial balance starts at clean ₹0.
  - [x] Voice Studio (`voiceLogStorage.ts` & `AudioWaveformCard.tsx`):
    - [x] Purged all unwanted demo offline voice blobs (Devprayag / NH-7 test audio notes) from Dexie `offlineVoiceLogs`.
    - [x] Replaced the technical jargon badge `"Offline Blob"` with `"Voice Broadcast"`.
    - [x] Added `deleteVoiceLogFromDexie(id)` and `clearAllVoiceLogsFromDexie()` with 1-tap delete button (`Trash2`) and confirmation modal on audio cards.
  - [x] Family Feed (`familyFeedStorage.ts`): Emptied `INITIAL_FEED_SEEDS = []` and purged legacy `feed-init-` and cached `voice-feed-` mockup cards from `localStorage`.
  - [x] Protected genuine pilgrimage documents in `vaultStorage.ts` (Train 12441 PNR `6709136735`, IndiGo PNRs `VGLHWK` & `L8CM7C`, and Yatra Biometric Passes).
- [x] **20.3 Responsive Mobile Header Redesign (Eliminating Squeeze on Narrow Devices)**
  - [x] Streamlined `Header.tsx` layout with responsive padding (`px-2.5 sm:px-3.5`) and component spacing (`gap-1.5 sm:gap-2`).
  - [x] Added `whitespace-nowrap` protection and compact sizing for `TripTrack '26` and `Badrinath Dham` branding text.
  - [x] Scaled hamburger button, brand crest, and Duo filter pills (`px-1.5 py-1 text-[10px] sm:text-[11px]`) so the entire header fits comfortably on screens down to 320px–360px without truncation.
- [x] **20.4 News Feed Year Normalization & Real-time Relative Timestamps**
  - [x] Diagnosed `18697h ago` bug: Real-world Google News RSS pubDates (calendar year 2024) compared against the app's target pilgrimage clock (`2026-09-17`) created a 2-year difference ($18,697\text{ hours}$).
  - [x] Fixed in `routeAlert.service.ts`: Anchored intelligence synthesis timestamps directly to current scan time (`new Date().toISOString()`).
  - [x] Updated `RouteGuardTab.tsx`: Added hours/days capping and graceful `"Recent Intel"` fallback so multi-year differences never display raw hour counts.
  - [x] Automated Dexie cleanup: Auto-purges route alerts older than 48 hours on startup to prevent lingering multi-year cached records.

---

### ✅ Phase 21: Universal Live Data Sync: MongoDB Atlas, Socket.io & Dexie
*Status: Completed & Verified on Sep 18, 2026 (100%)*

- [x] **21.1 Global Application-Wide Socket.io Client (`socketClient.ts`)**
  - [x] Replaced isolated hook-level socket connection with an app-wide persistent singleton initialized at root (`App.tsx`).
  - [x] Automatically connects to MongoDB/Express backend and joins shared family room (`badrinath-family-2026`).
  - [x] Emits `triptrack_network_sync` upon connection/reconnection to auto-reconcile all offline data stores with MongoDB Atlas.
  - [x] Refactored `useFamilySocket.ts` so opening/closing the chat drawer no longer disconnects socket operations for other modules.
- [x] **21.2 Full-Stack Gullak Expense Synchronization (`ExpenseModel`, `expense.controller.ts`, `expenseStorage.ts`)**
  - [x] Added `id: string` indexed field to `ExpenseModel` in MongoDB Atlas.
  - [x] Implemented `GET /api/expenses`, `POST /api/expenses`, `POST /api/expenses/sync`, and `DELETE /api/expenses/:id`.
  - [x] Connected real-time Socket.io events: `send_expense` -> persists to Atlas -> broadcasts `receive_expense`; `delete_expense` -> removes from Atlas -> broadcasts `expense_removed`.
  - [x] Reconciled Dexie with Atlas in `syncExpensesWithCloud()`.
  - [x] Real-time UI updates: `GullakPreview.tsx` listens to `triptrack_expense_update`, recalculating 50/50 balance and ledger instantaneously.
- [x] **21.3 Full-Stack Family Feed Journey Timeline Synchronization (`familyFeed.model.ts`, `feed.controller.ts`, `familyFeedStorage.ts`)**
  - [x] Implemented Mongoose model `FamilyFeedModel` storing title, description, timestamp, speakerId, duoId, and transit metadata.
  - [x] Created `GET /api/feed`, `POST /api/feed`, and `DELETE /api/feed/:id`.
  - [x] Connected real-time Socket.io events: `send_feed_post` -> persists to Atlas -> broadcasts `receive_feed_post`; `delete_feed_post` -> removes from Atlas -> broadcasts `feed_post_removed`.
  - [x] Automated sync: `FamilyFeedTab.tsx` reflects posts from all family devices instantaneously.
- [x] **21.4 Real-time Itinerary Milestone Checkpoint Synchronization (`segment.controller.ts`, `itineraryStorage.ts`)**
  - [x] Added `checkpoint_updated` socket broadcast in `socket.service.ts` and HTTP `toggleCheckpointHandler`.
  - [x] Connected `itineraryStorage.ts` to broadcast checkpoint toggles and auto-reconcile with `/api/segments`.
  - [x] Connected `useItinerary.ts` to `triptrack_itinerary_update` event so all open devices see completed milestones in real-time.
- [x] **21.5 Offline-First Himalayan Resilience Invariant Maintained**
  - [x] All actions (logging expenses, publishing feed updates, toggling milestones) write optimistically to Dexie IndexedDB first with `isSynced: false` when offline.
  - [x] Auto-flush to MongoDB Atlas and broadcast over Socket.io upon cellular reconnection.

---

### ✅ Phase 22: Cloudinary Media Integration & Cross-Device Multimedia
*Status: Completed & Verified on Sep 18, 2026 (100%)*

- [x] **22.1 Cloudinary Server Architecture & Resilient Media Upload (`cloudinary.service.ts`, `media.controller.ts`, `media.routes.ts`)**
  - [x] Installed `cloudinary` SDK in `server/`.
  - [x] Implemented `cloudinary.service.ts` supporting `CLOUDINARY_URL` and `CLOUDINARY_CLOUD_NAME` / `API_KEY` / `API_SECRET`.
  - [x] Configured image uploads (`quality: 'auto:good'`, `fetch_format: 'auto'`) and audio uploads (`resource_type: 'video'` for `.webm` / `.mp3` audio streams).
  - [x] Implemented graceful offline/keyless fallback: returns data URLs if keys are missing or offline, preventing server crashes.
  - [x] Created `POST /api/media/upload` with Multer memory storage (20MB limit) and `GET /api/media/status`.
- [x] **22.2 Fintech-Grade Receipt Photography in Gullak (`AddExpenseSheet.tsx`, `GullakPreview.tsx`)**
  - [x] Added mobile camera capture and photo gallery picker in `AddExpenseSheet.tsx` with thumbnail preview and 1-tap removal.
  - [x] Integrated client-side canvas compression (`compressImage`) before uploading to optimize bandwidth on mountain 3G/4G networks.
  - [x] Added `receiptUrl` support to `ExpenseModel`, `/api/expenses`, and `expenseStorage.ts`.
  - [x] Added high-contrast `"🧾 Bill"` pill button in `GullakPreview.tsx` expense ledger items.
  - [x] Built full-screen `ReceiptViewerModal` with zoom-in presentation, external link, and elder-friendly close buttons.
- [x] **22.3 Cross-Device Voice Broadcast Audio Streaming (`FamilyFeedTab.tsx`, `uploadMedia`)**
  - [x] Uploads recorded voice audio blob to Cloudinary upon stopping voice note in `FamilyFeedTab.tsx`.
  - [x] Attaches remote CDN audio URL to the family feed broadcast so remote relatives can stream and listen to elders' voice notes on any device.
  - [x] Preserved local Dexie `offlineVoiceLogs` blob storage for zero-signal playback.
  - [x] Mounted `<audio ref={audioPlayerRef} />` element in `FamilyFeedTab.tsx` for audio playback.
- [x] **22.4 Highway & Shrine Photo Moments in Family Feed (`FamilyFeedTab.tsx`, `familyFeedStorage.ts`)**
  - [x] Extended `FamilyFeedItem['metadata']` with `photoUrl?: string`.
  - [x] Added photo attachment button (`Camera`) and live image thumbnail preview with remove button in the Quick Post composer.
  - [x] Rendered photo cards within feed cards with click-to-enlarge action.
  - [x] Built `viewingFeedPhoto` modal displaying full-bleed photo, title, location, and link to high-resolution CDN asset.
- [x] **22.5 Offline-First Himalayan Invariant & Vault Dignity Preserved**
  - [x] Kept Document Vault passes (IRCTC Train 12441 tickets, IndiGo boarding passes, biometric Yatra permits) strictly in Dexie IndexedDB blobs for guaranteed 0ms offline rendering at temple security checkposts.
  - [x] Graceful fallback: when cellular data is unreachable in mountain valleys, receipts and feed photos gracefully fallback to local storage and sync upon reconnection.
- [x] **22.6 Hybrid Cloud-to-Dexie Document Vault Synchronization (`uploadDocumentBuffer`, `vault.controller.ts`, `vaultStorage.ts`, `UploadDocDialog.tsx`)**
  - [x] Added `uploadDocumentBuffer()` to `cloudinary.service.ts` with `resource_type: 'auto'` for PDF passes and photos.
  - [x] Connected `POST /api/documents/upload` to store files on Cloudinary and document records on MongoDB Atlas with `id: doc-...`.
  - [x] Implemented real-time Socket.io events: `send_document` -> persists to Atlas -> broadcasts `receive_document`; `delete_document` -> removes from Atlas -> broadcasts `document_removed`.
  - [x] Added client background sync (`syncVaultWithCloud()` & `setupVaultSocketListeners()`): peer devices automatically download binary file blobs and cache them in local Dexie IndexedDB.
  - [x] Guaranteed 0ms offline access: any document uploaded by Shreyas or Utkarsh becomes 100% offline accessible on all family phones.

---

### ✅ Phase 23: Splitwise-Grade Multi-Payer & Custom Split Financial Engine in Gullak
*Status: Completed & Verified on Sep 18, 2026 (100%)*

- [x] **23.1 Multi-Payer Data Modeling & TypeScript Typing (`types/index.ts`, `dexie.ts`, `expense.model.ts`)**
  - [x] Defined `ExpenseSplitMode = 'EQUAL_50_50' | 'CUSTOM_AMOUNTS' | 'FULL_FAMILY_A' | 'FULL_FAMILY_B'`.
  - [x] Extended `Expense` and `OfflineExpenseRecord` with `paymentSplits?: { utkarshPaidINR: number; shreyasPaidINR: number }`, `splitMode?: ExpenseSplitMode`, and `owedSplits?: { utkarshOwesINR: number; shreyasOwesINR: number }`.
  - [x] Updated MongoDB `ExpenseSchema` and `IExpense` in `server/src/models/expense.model.ts` with typed subdocuments for split fields.
- [x] **23.2 Mathematical Balance & Fair Share Computation Engine (`expenseStorage.ts`)**
  - [x] Implemented exact net position formula: $\text{Net Position} = \text{Paid} - \text{Owed}$.
  - [x] Multi-payer aggregation: accurately accumulates partial contributions per coordinator ($P_U$ and $P_S$).
  - [x] Flexible fair share aggregation: correctly tallies custom shares or 100% single-family charges ($O_U$ and $O_S$).
  - [x] Guaranteed zero-sum bilateral settlement: $\text{Net}_U + \text{Net}_S = 0$, accurately displaying who owes whom in `netSettlement`.
  - [x] Maintained 100% backward compatibility with single-payer expenses.
- [x] **23.3 Interactive Multi-Payer & Custom Split Bottom Sheet (`AddExpenseSheet.tsx`)**
  - [x] Payer Selector: 3-way toggle between `[ Utkarsh Paid 100% ]`, `[ Shreyas Paid 100% ]`, and `[ Both Paid (Custom ₹) ]`.
  - [x] Dual-rupee inputs with live auto-balance helper button (`"Auto-Balance ₹X"`) and real-time sum validator.
  - [x] Split Mode Selector: 4-way segmented tabs for `50-50 Equal`, `Custom Share`, `100% Fam A`, and `100% Fam B`.
  - [x] Live Splitwise Settlement Preview Banner: renders real-time settlement delta (e.g., *"Shreyas will owe Utkarsh ₹75"*) before the expense is logged.
  - [x] Elder-friendly touch targets ($\ge 48\text{px}$) and clear high-contrast rupee buttons.
- [x] **23.4 Ledger Visual Enhancements & Dynamic Filtering (`GullakPreview.tsx`)**
  - [x] Expense Cards: renders payment contribution pill (`Paid: Utkarsh ₹200 • Shreyas ₹50`) when multiple payers contributed.
  - [x] Split Badges: renders distinct pills for `100% Fam A`, `100% Fam B`, or `Split: ₹X / ₹Y`.
  - [x] Receipt Modal: shows multi-payer breakdown alongside bill image.
  - [x] Duo Filter Reconciliation: shows multi-payer expenses in `Duo A` or `Duo B` filters if that coordinator contributed.
- [x] **23.5 Bilateral Settlement Gauge & WhatsApp Keepsake Updates (`SettlementGauge.tsx`)**
  - [x] Needle Position: dynamically positions gauge pin based on net settlement balance rather than raw paid difference.
  - [x] WhatsApp Export: generates clean markdown audit with bilateral balance.
- [x] **23.6 Full-Stack Real-Time Persistence & Zero-Signal Resilience (`expense.controller.ts`, `expenseStorage.ts`)**
  - [x] Preserved `paymentSplits`, `splitMode`, and `owedSplits` across REST API endpoints (`GET /api/expenses`, `POST /api/expenses`, `POST /api/expenses/sync`).
  - [x] Real-time Socket.io events (`send_expense`, `receive_expense`) broadcast and sync split records instantaneously across devices.
  - [x] Dexie IndexedDB stores split records locally first for complete offline operation in Alaknanda river gorges.

---

### ✅ Phase 24: Autonomous Scheduled & Geofenced Email Notification Engine
*Status: Completed & Verified on Sep 18, 2026 (100%)*

- [x] **24.1 High-Contrast Email Template Suite (`email.service.ts`)**
  - [x] Enhanced `notifyEmergencySos()` with 1-tap Google Maps coordinates pin, battery percentage, senior medical dossiers, and national/Uttarakhand helplines.
  - [x] Implemented `notifyScheduledBriefing()`: rich morning briefing with day title, core objectives, milestone timings, elder dignity pacing, and logistics notes.
  - [x] Implemented `notifyGeofenceArrival()`: green celebration banner, altitude, source detection type (GPS geofence vs milestone check), and next target segment.
  - [x] Implemented `notifyDailyEveningDigest()`: "Sandhya Bulletin" summarizing today's milestones, SpO2 & BP status, photos uploaded, and tomorrow's morning schedule.
  - [x] Updated `getRecipients()`: merges `FAMILY_NOTIFICATION_EMAILS` and `SMTP_USER` deduplicated.
- [x] **24.2 Autonomous GPS Geofencing Engine (`automation.service.ts`, `telemetry.controller.ts`)**
  - [x] Configured 8 pilgrimage landmark geofences: NDLS (12km), Haridwar (8km), Rishikesh (6km), Devprayag (4km), Rudraprayag (4km), Joshimath (5km), Badrinath Sanctum (3km), and Mana Village (2.5km).
  - [x] Implemented mathematical Haversine Distance algorithm: $d = 2R \cdot \arcsin(\dots)$.
  - [x] Hooked into `pingLocationHandler` and `bulkPingHandler` in `telemetry.controller.ts`: incoming pings automatically trigger arrival notice upon entry.
  - [x] Idempotency & duplicate protection: `dispatchedTriggers` ensures each waypoint fires at most once.
- [x] **24.3 Dual-Trigger Himalayan Checkpoint Fallback (`segment.controller.ts`)**
  - [x] Mountain battery-saver protection: when background GPS is throttled or phone is asleep, marking a milestone in the Itinerary tab automatically triggers the same waypoint arrival email.
  - [x] Zero-signal queueing: offline checkpoint toggles stored in client Dexie IndexedDB flush and dispatch the arrival email upon cellular reconnection.
- [x] **24.4 Time-Based Scheduled Briefings & Sandhya Bulletin Scheduler (`automation.service.ts`, `index.ts`)**
  - [x] Scheduled briefings for Sep 24 (Train 12441 departure), Sep 25 (NDLS arrival & Expressway transfer), Sep 26 (Mountain ascent to Joshimath), Sep 27 (Badrinath Sanctum & Tarpan), Sep 28 (Mana village & descent), and Oct 01 (IndiGo flight connections).
  - [x] Background 60-second heartbeat in `startScheduler()` initialized on server boot.
  - [x] Daily 20:00 (8:00 PM) automated Sandhya Bulletin dispatch compiling live DB stats (milestones, expenses, photos).
- [x] **24.5 Client-Side Dispatchers & Settings UI (`EmergencyModal.tsx`, `EmailAlertsModal.tsx`, `AppSidebar.tsx`)**
  - [x] Emergency Modal: added prominent `"🚨 Broadcast Emergency GPS SOS Email Now"` button capturing live coordinates, battery level, and elders' medical dossier.
  - [x] Email Alerts Modal: dedicated modal displaying active recipients, 6 scheduled morning briefings with status pills, 8 GPS geofence waypoints, 1-tap "Send Today's Evening Digest Now", and "Send Test Email to Family".
  - [x] Sidebar integration: added `"Family Email Alerts"` drawer action with active mail icon and badge.
- [x] **24.6 Live Field Verification & Durg CG Geofencing (`automation.service.ts`, `EmailAlertsModal.tsx`)**
  - [x] Added `wp-durg` (Durg Junction & City, Chhattisgarh at $21.1904^\circ\text{N}, 81.2849^\circ\text{E}$, $25\text{km}$ radius).
  - [x] Verified live geofence detection: triggered real arrival notification email via Gmail SMTP to `utkarshshrivastava.13@gmail.com`.
  - [x] Verified automated 15-minute scheduled briefing countdown and active background server scheduler.
  - [x] Added interactive "Trigger Durg GPS" and "Schedule (+15m)" controls to `EmailAlertsModal.tsx`.

---

## 🧭 Key Architectural Invariants (Must Never Be Broken)

1. **Elder Dignity & High Contrast First:** All text must meet minimum contrast ratios; all touch buttons must be $\ge 48\text{px}$; no tiny links or confusing gestures.
2. **Local-First Supremacy:** Any action taken in a cellular dead zone (marking a checkpoint, viewing a ticket, pinging location, logging an expense, tracking $SpO_2$, writing a chat message) must work immediately via Dexie IndexedDB and silently queue for background synchronization.
3. **Paired Family Identity:** Always preserve family distinctions (Family A: Utkarsh & Rajnish Ji, Family B: Shreyas & Sanjay).
4. **Zero-Cost Constraint:** Use free-tier tooling exclusively (Google AI Studio `@google/genai`, OpenStreetMap tiles via Leaflet, MongoDB Atlas M0, Google SMTP via Gmail App Password, Vercel/Render free tiers).
