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
| **Phase 25** | **Pre-Departure (Sep 19–23) & During-Trip (Sep 24–Oct 02) Scheduled Briefing System** | ✅ **DONE** | 100% | Completed |
| **Phase 26** | **Zero-Friction Profile Auto-Binding (Gullak, Feed, Vault, Itinerary & GPS)** | ✅ **DONE** | 100% | Completed |
| **Phase 27** | **Dual-Tier In-App & Standalone WebAPK Push Notification Engine** | ✅ **DONE** | 100% | Completed |
| **Phase 28** | **Advanced Adaptive Day Selector, 9-Day Itinerary Engine & Himalayan Contingency** | ✅ **DONE** | 100% | Completed |
| **Phase 29** | **Haridwar Hill Cab Agency Directory, Safety Inspector & Driver Handover Tool** | ✅ **DONE** | 100% | Completed |
| **Phase 30** | **"Today at a Glance" Live Auto-Pilot Mode & Next-Up Milestone Ticker** | ✅ **DONE** | 100% | Completed |
| **Phase 31** | **Elder-Care Meal & Bio-Break Interval Advisor (2.5h Highway Limit)** | ✅ **DONE** | 100% | Completed |
| **Phase 32** | **Temple Darshan & Aarti Timekeeper with 528Hz Bronze Bell Chime** | ✅ **DONE** | 100% | Completed |
| **Phase 33** | **Day-by-Day Outfit & Weather Dress-Code Advisor (9-Day Matrix)** | ✅ **DONE** | 100% | Completed |
| **Phase 34** | **Daily Hard Cash vs UPI Advisor & Dead-Zone ATM Guard** | ✅ **DONE** | 100% | Completed |
| **Phase 35** | **Bilingual Driver & Local Voice Phrasebook (Hindi & Garhwali Audio)** | ✅ **DONE** | 100% | Completed |
| **Phase 36** | **Day Itinerary Export to WhatsApp & Offline Printable Sheet / PDF** | ✅ **DONE** | 100% | Completed |

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
  - [x] Created `GET /api/feed`, `POST /api/feed`, `DELETE /api/feed/:id`, and `DELETE /api/feed/clear-all`.
  - [x] Connected real-time Socket.io events: `send_feed_post` -> persists to Atlas -> broadcasts `receive_feed_post`; `delete_feed_post` -> removes from Atlas -> broadcasts `feed_post_removed`; `clear_feed` -> purges Atlas -> broadcasts `feed_cleared`.
  - [x] Fixed cloud endpoint resolution: updated `familyFeedStorage.ts` to use `getBackendUrl()` and `getApiHeaders()`, ensuring feed operations seamlessly reach Render MongoDB backend from Vercel deployments.
  - [x] Removed UI deletion restriction on milestone cards (`!isMilestone`), allowing users to delete any feed item directly with the trash button.
  - [x] Added "Clear All" stream button in `FamilyFeedTab.tsx` with confirmation dialog to purge feed locally and in MongoDB Atlas.
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
- [x] **24.7 Render Production Deployment & Cloud Health Check Hardening (`index.ts`, `app.ts`, `package.json`)**
  - [x] Explicitly bound Express HTTP server to `0.0.0.0` host interface so Render's container routing mesh and health-checkers connect reliably over IPv4.
  - [x] Added root and multi-path health check handlers (`/`, `/health`, `/api/health`) placed before rate-limiting middleware, returning instant 200 OK JSON status.
  - [x] Pinned Node engine in `server/package.json` to `"20.x"` LTS to prevent Render from selecting experimental Node 26.9.0.
- [x] **24.8 Cloud Container SMTP IPv4 Enforcement & Dual-Port Fallback (`email.service.ts`, `index.ts`, `package.json`)**
  - [x] Configured `family: 4` on Nodemailer transports to prevent `ENETUNREACH (:::0)` caused by cloud container lack of outbound IPv6 routing.
  - [x] Added `dns.setDefaultResultOrder('ipv4first')` and `--dns-result-order=ipv4first` in server startup to force IPv4 DNS resolution for Google SMTP endpoints.
  - [x] Implemented dual-port resilience: Port 465 SSL primary with automatic failover to Port 587 STARTTLS before logging console simulation fallback.
- [x] **24.9 Brevo HTTPS REST API Engine & Client Resilient Dispatch (`email.service.ts`, `EmailAlertsModal.tsx`, `render.yaml`)**
  - [x] Integrated Brevo HTTP REST API (`https://api.brevo.com/v3/smtp/email`) on Port 443 HTTPS, completely bypassing cloud container SMTP port blocks.
  - [x] Added dynamic engine provider reporting (`status.provider.name`) in API and client UI modal badges.
  - [x] Reduced direct SMTP probe timeout to 3.5s and increased client abort timeout to 15s with graceful error banners, eliminating `signal is aborted without reason` hangs.
  - [x] Added `BREVO_API_KEY` to `render.yaml`, `server/.env`, and `server/.env.example`.

---

### ✅ Phase 25: Pre-Departure & During-Trip Structured Briefing System
*Status: Completed & Verified on Sep 19, 2026 (100%)*

- [x] **25.1 15-Briefing Pre-Departure Suite (Sep 19 – Sep 23, 2026)**
  - [x] Tightened Sep 19 Schedule (adapted for start past 11:00 AM):
    - [x] 12:30 PM (Afternoon): Kickoff & Digital Document Vault Checklist (original Aadhaar cards, 2x printout sets, offline TripTrack Vault check, emergency cash ₹15,000).
    - [x] 05:00 PM (Evening): Himalayan Altitude Acclimatization & Elder Pacing (pulse oximeter, digital BP monitor, 2x thermos flasks, electrolyte oral hydration, SpO2 benchmarks).
    - [x] 08:30 PM (Night): Haridwar & Rishikesh Sacred Orientation & Temple Guide (Har Ki Pauri Ganga Aarti seated view, Mansa/Chandi Devi ropeway cable car, Triveni sunset aarti).
  - [x] Sep 20: 3 briefings (08:00 AM Winter Wardrobe 3-layer system, 02:00 PM Badrinath Sanctum & Brahma Kapal Pinda Daan Gotra list, 08:30 PM Panch Prayag Sacred Confluences).
  - [x] Sep 21: 3 briefings (08:00 AM Mountain Dead-Zone & 20,000mAh Power Banks, 02:00 PM Mountain Road Motion Sickness & Captain Seat Pacing, 08:30 PM Mana First Village & Saraswati River).
  - [x] Sep 22: 3 briefings (08:00 AM Comprehensive 15-day Medical Kit & BP supply, 02:00 PM Badrinath Temple Etiquette & Tapt Kund Hot Spring bath, 08:30 PM Train 12441 Rajdhani Boarding Timetable).
  - [x] Sep 23: 3 briefings (08:00 AM Luggage Hand-Carry Separation, 02:00 PM Mountain Cash & Gullak 50/50 Shared Pool, 08:30 PM Shubh Yatra Blessing & Early Rest).
- [x] **25.2 9-Briefing During-Trip Suite (Sep 24 – Oct 02, 2026)**
  - [x] Day 1 (Sep 24): Departure Day — Train 12441 Rajdhani Express Boarding Briefing.
  - [x] Day 2 (Sep 25): NDLS Arrival & Delhi-Meerut Expressway to Haridwar.
  - [x] Day 3 (Sep 26): Early 06:00 AM Departure — Haridwar to Joshimath (NH-7).
  - [x] Day 4 (Sep 27): Jai Badri Vishal! Temple Darshan & Brahma Kapal Tarpan.
  - [x] Day 5 (Sep 28): Mana First Village of India & Return Highway Descent.
  - [x] Day 6 (Sep 29): Rishikesh Foothills & Triveni Ghat Evening Rest.
  - [x] Day 7 (Sep 30): Haridwar Sacred Ghats & Ayurvedic Rest Day.
  - [x] Day 8 (Oct 01): Homeward Flight Connections — Dehradun to Delhi to Raipur.
  - [x] Day 9 (Oct 02): Pilgrimage Completion, Sacred Gangajal & Kuldevta Prasad.
- [x] **25.3 Rich Visual Email Template Expansion (`email.service.ts`)**
  - [x] Added `checklistItems` section: high-contrast navy badge cards with checkmark badges (`style="background-color: #0f172a; border: 1px solid #0284c7"`).
  - [x] Added `sightseeingTips` section: royal purple container with lotus icons for temple and scenic highlights (`style="background-color: #2e1065; border: 1px solid #7c3aed"`).
  - [x] Dynamic time-slot branding: 🌅 Morning (Amber), ☀️ Afternoon (Orange), 🌇 Evening (Pink), 🌙 Night (Purple).
  - [x] Branded sender `"TripTrack by Ut-tech" <utkarshsofficial13@gmail.com>`.
- [x] **25.4 3-Tab Mobile Modal Interface (`EmailAlertsModal.tsx`)**
  - [x] 3-way tab selector: `🎒 Pre-Trip (15)`, `🏔️ During Trip (9)`, `📍 GPS (9)`.
  - [x] Prominent "Today (Sep 19) Schedule: Tightened Timings" highlight card with +15m test trigger.
  - [x] Detailed card metadata: Time slot badge, Day title, Subject, Checklist item count pill, Sightseeing tip count pill, and 1-tap "Test Send" simulator button.
- [x] **25.5 Field Verification & Live Dispatch Testing**
  - [x] Verified `GET /api/notifications/status` returning exact counts (`totalBriefings: 24`, `preDeparture: 15`, `duringTrip: 9`, `geofences: 9`).
  - [x] Live simulated all 3 Sep 19 briefings (Afternoon 12:30, Evening 17:00, Night 20:30) with 200 OK delivery directly to Gmail inboxes.
- [x] **25.6 Full Bilingual (English + Hindi Devanagari) Accessibility for Elders (`email.service.ts`, `automation.service.ts`, `EmailAlertsModal.tsx`)**
  - [x] Rendered ALL 6 email notification templates with dual English + Hindi Devanagari script for maximum senior readability:
    - [x] Milestone Crossed Reassurance: English title + Hindi devotional subtitle (`सकुशल पड़ाव सूचना`) + elder health reassurance.
    - [x] Dead-Zone Gorge Warning: Dual-language shadow guard notice + reassuring message for home families (`कृपया बिल्कुल भी चिंता न करें`).
    - [x] Emergency SOS: Bilingual alert banners (`आपातकालीन सहायता सूचना`) and Google Maps button (`मैप में देखें`).
    - [x] Scheduled Briefings (Pre-Departure & During-Trip): Bilingual slot pills (`प्रातःकालीन`, `दोपहर`, `सायंकालीन`, `रात्रिकालीन`), dual day titles, translated core objectives, checklist items (`✓ English \n • Hindi`), sightseeing tips, and elder care protocols.
    - [x] Geofence Landmark Arrival: Dual-language confirmation (`सभी चारों तीर्थयात्री सकुशल पहुँच चुके हैं`).
    - [x] Sandhya Bulletin Daily Digest: Bilingual evening summary with senior health updates, photo count, and tomorrow's route.
  - [x] Enriched all 24 scheduled briefings in `automation.service.ts` with authentic Hindi fields (`dayTitleHindi`, `subjectHindi`, `transitInfoHindi`, `highlightsHindi`, `elderCareTipHindi`, `logisticsSummaryHindi`, `checklistItemsHindi`, `sightseeingTipsHindi`).
  - [x] Updated client PWA `EmailAlertsModal.tsx` cards with high-contrast Hindi day titles and golden Devanagari subtitles (`text-amber-400/90`).
- [x] **Phase 26: Zero-Friction Profile Auto-Binding Across App Features**
  - [x] **26.1 Architectural Audit & Gap Discovery**
    - [x] Identified 8 modules with redundant traveller selection dropdowns / legacy hardcoded `traveller-utkarsh` initializers:
      - `AddExpenseSheet.tsx` (Gullak): `payerMode` hardcoded to `'UTKARSH'`.
      - `FamilyFeedTab.tsx` (Feed Quick Post & Voice Studio): `selectedSpeakerId` hardcoded to `TRAVELLERS_CONFIG[0].id`.
      - `ReportObstructionModal.tsx` (Route Guard): `reportingTravellerId` hardcoded to `TRAVELLERS_CONFIG[0].id`.
      - `UploadDocDialog.tsx` (Vault): `passengerId` hardcoded to `TRAVELLERS_CONFIG[0].id`.
      - `TrackingPreview.tsx` (GPS Broadcaster): `selectedTravellerId` hardcoded to `TRAVELLERS_CONFIG[0].id`.
      - `itineraryStorage.ts` (Milestone Feed): Milestone attribution hardcoded to `'traveller-utkarsh'`.
      - `OximeterLoggerModal.tsx` (Elder Health): Pre-selection defaulted to `seniorPilgrims[0]` (Rajnish Ji) instead of Duo-aware father.
      - `EmailAlertsModal.tsx` (Geofence): Test trigger passengerId hardcoded to `'traveller-utkarsh'`.
  - [x] **26.2 Reactive Shared Profile Hooks & Non-React Resolvers**
    - [x] Added `triptrack_user_profile_change` and `storage` event dispatchers to `useUserProfile.ts` for instant cross-component re-rendering without page refreshes.
    - [x] Exported synchronous non-React helpers `getActiveUserId()` and `getActiveTraveller()`.
  - [x] **26.3 Automated Module Binding & "(You)" Visual Indicators**
    - [x] Bound `AddExpenseSheet.tsx` payer to logged-in user (`SHREYAS` for Shreyas/Duo B; `UTKARSH` for Utkarsh/Duo A) with `(You)` badge.
    - [x] Bound `FamilyFeedTab.tsx` speaker selector in Quick Post and Voice Studio to active profile with `(You)` label.
    - [x] Bound `ReportObstructionModal.tsx` reporter chips to active coordinator with `(You)` badge.
    - [x] Bound `UploadDocDialog.tsx` assigned pilgrim to active user with `(You)` option text.
    - [x] Bound `TrackingPreview.tsx` broadcasting pilgrim to active user with `(You)` option text.
    - [x] Updated `itineraryStorage.ts` to log milestone check-ins under `getActiveUserId()`.
    - [x] Updated `OximeterLoggerModal.tsx` to pre-select elder matching the active user's family duo (Sanjay Ji for Duo B; Rajnish Ji for Duo A) with `Your Elder` pill.
  - [x] **26.4 Multi-Profile Switching & Zero-Click Verification**
    - [x] Verified zero-error compilation across both client (`vite build`) and server (`tsc`); confirmed instant profile auto-binding.
  - [x] **26.5 WhatsApp-Grade Live Typing Indicators in Family Chat (`FamilyChatDrawer.tsx`, `useFamilySocket.ts`)**
    - [x] Added dynamic header subtitle typing state: pulsing green ping dot with `[UserName] is typing...`.
    - [x] Added WhatsApp-style incoming animated chat bubble with 3-dot bouncy wave animation (`animate-bounce` with staggered delay).
    - [x] Implemented 2000ms debounce timer for keystroke typing emission and instant cleanup on submit, blur, or drawer close.
    - [x] Auto-scrolls conversation stream smoothly to reveal the typing bubble as soon as a family member starts typing.

---

### ✅ Phase 27: Dual-Tier In-App & Standalone WebAPK Push Notification Engine
*Status: Completed & Verified on Sep 19, 2026*

- [x] **27.1 Tier 1: In-App Real-Time Notification & Unread Counter**
  - [x] App-level persistent chat socket listener in `App.tsx` (active even when chat drawer is closed).
  - [x] Dynamic unread badge counter (`1`, `2`, `9+`) on `FloatingChatButton.tsx` with pulsing emerald/amber glow.
  - [x] Ultra-crisp slide-down `ChatNotificationToast.tsx` with sender badge, preview, and one-tap drawer launcher.
  - [x] Zero-dependency Web Audio API synthetic bell chime (`playChatChime()`) and tactile vibration (`triggerChatHaptic()`).
- [x] **27.2 Tier 2: Standalone WebAPK Background Push via VAPID & Service Worker**
  - [x] Server `web-push` integration with generated VAPID keypair (`VAPID_PUBLIC_KEY` & `VAPID_PRIVATE_KEY`).
  - [x] MongoDB Atlas `PushSubscriptionModel` for device token persistence.
  - [x] Endpoints: `GET /api/notifications/vapid-public-key`, `POST /api/notifications/push-subscribe`, `POST /api/notifications/test-push`.
  - [x] Service worker background push listener (`sw-push.js`) in Workbox with high-priority vibration and click routing (`openChat=true`).
  - [x] Auto-dispatch background push to all family members when a socket message arrives.

---

### ✅ Phase 28: Advanced Adaptive Day Selector, 9-Day Itinerary Engine & Himalayan Contingency
*Status: Completed & Verified on Sep 22, 2026*

- [x] **28.1 Full 9-Day Pilgrimage Model Alignment (Sep 24 – Oct 02, 2026)**
  - [x] Configured 9 distinct segments (`seg-1` to `seg-9`) in both client (`trip.config.ts`) and server (`seed.controller.ts`) covering:
    - Day 1 (Sep 24): Durg Dep (Train 12441 Bilaspur Rajdhani 2AC)
    - Day 2 (Sep 25): NDLS 10:40 Arr $\rightarrow$ Delhi-Meerut Expressway to Haridwar hotel $\rightarrow$ Local agency booking for Badrinath round-trip cab
    - Day 3 (Sep 26): 05:30 Early Departure via NH-7 to Joshimath / Badrinath base
    - Day 4 (Sep 27): Badrinath Dham Darshan & Brahma Kapal Tarpan (1st Half) $\rightarrow$ Mana Village Vyas Gufa & Bheem Pul (2nd Half)
    - Day 5 (Sep 28): Return descent via Panch Prayags & Maa Dhari Devi Temple Shaktipeeth $\rightarrow$ Haridwar hotel check-in
    - Day 6 (Sep 29): Full Day Haridwar Sacred Sightseeing (Mansa Devi & Chandi Devi ropeways, Har Ki Pauri Sandhya Aarti, Bara Bazaar)
    - Day 7 (Sep 30): Rishikesh Sacred Exploration (Ram Jhula, Janki Setu, Parmarth Niketan Aarti, Beatles Ashram) / Haridwar spillover
    - Day 8 (Oct 01): Flexible Buffer Day (Mussoorie Kempty Falls OR Dehradun nature tour OR riverside retreat) $\rightarrow$ Hotel near Jolly Grant Airport
    - Day 9 (Oct 02): 13:15 IndiGo Flight (DED $\rightarrow$ DEL $\rightarrow$ RPR 2-leg) $\rightarrow$ Cab drive home to Durg
- [x] **28.2 Dynamic Day Selector Strip & Contextual Status Bar (`DaySelectorStrip.tsx`)**
  - [x] Interactive horizontal pill strip with distinct badges: 🚆 (Train), 🚗 (Cab/Agency), 🏔️ (Ascent), 🛕 (Darshan), 🌊 (Aarti/Return), 🏛️ (Haridwar), 🌿 (Rishikesh), ⛰️ (Buffer), ✈️ (Flight).
  - [x] Day status bar with day number, destination, archetype pill (`Transit & Travel`, `Sacred Darshan`, `Sightseeing & Explore`, `Flexible Buffer`), altitude meter gauge (`3,133m • High Altitude` vs `314m • Plains`), and weather guideline.
  - [x] Integrated view switcher (`Timeline` vs `Sightseeing`) and quick action buttons (`+ Activity` and `NH-7 Plan B`).
- [x] **28.3 Curated Sightseeing Recommendations & 1-Tap Checkpoint Ingestion (`DaySightseeingCard.tsx`)**
  - [x] Curated pool of 20+ verified pilgrimage and sightseeing spots across Haridwar, Rishikesh, En-route Panch Prayags / Dhari Devi, Mana Village, and Dehradun/Mussoorie.
  - [x] Color-coded elder walking difficulty tags (`🟢 Easy / Flat`, `🟡 Moderate`, `🔴 Steep / Ropeway Available`), cable car / lift indicators, and elder comfort tips.
  - [x] 1-Tap **"+ Add to Plan"** action converting any recommendation into an active checkpoint for that day's timeline.
- [x] **28.4 Custom Activity Creator & Offline Dexie Storage (`AddCustomActivityModal.tsx`)**
  - [x] Elder-friendly modal to schedule custom activities with preferred time slot (`Morning`, `Afternoon`, `Evening`, `Flexible`), category, and elder comfort notes.
  - [x] Dexie IndexedDB table `customActivities` (schema version 7) with offline persistence and sync event dispatching.
  - [x] Option to automatically bind custom activity as a checklist milestone in that day's timeline.
- [x] **28.5 Himalayan Route Contingency & Gemini AI Rebalancer ("Plan B") (`RouteContingencyModal.tsx`)**
  - [x] 1-Click contingency presets:
    - *Plan A: Standard Yatra* (as scheduled)
    - *Plan B: Hill Delay Buffer (+1 Day in Hills)* (absorbs landslide delays, darshan Sep 28, compresses foothills without touching Oct 02 flight)
    - *Plan C: Foothills First (Reverse Route)* (if NH-7 is blocked on Sep 26 morning, explore Haridwar & Rishikesh first, then ascend Sep 28)
  - [x] Natural language AI Schedule Rebalancer powered by `@google/genai` (`gemini-2.5-flash`) via `POST /api/itinerary/rebalance` with elder dignity and flight safety guarantees.
- [x] **28.6 Dual-Compilation & Build Verification**
  - [x] `npm --prefix client run build`: Passed with 0 errors (`vite build` + `tsc -b`).
  - [x] `npm --prefix server run build`: Passed with 0 errors (`tsc`).

---

### ✅ Phase 29: Haridwar Hill Cab Agency Directory, Safety Inspector & Driver Handover Tool
*Status: Completed & Verified on Sep 22, 2026*

- [x] **29.1 Curated Haridwar Hill Cab Directory (`trip.config.ts`)**
  - [x] 7 verified, reputable Haridwar travel agencies (Devpura, Railway Station Circle, Shiv Murti, Lalta Rao Bridge):
    - Haridwar Taxi Services (Devpura)
    - Kaka Travels (Near Railway Station)
    - Haridwar Railway Station Taxi Union Desk
    - Trayambhkam Tour & Travels (Devpura Chowk)
    - Triveni Cabs Haridwar
    - Kaushik Tour & Travels (Shiv Murti Chowk)
    - Shubh Yatra Cabs (Lalta Rao Bridge)
  - [x] 2026 realistic price benchmarks (Ertiga: ₹16,000–₹19,000 all-inclusive; Innova Crysta: ₹22,000–₹26,000 with captain seats).
  - [x] Direct 1-tap phone dialer (`tel:+91...`) and pre-filled WhatsApp quotation generator inquiring about the 3-day Badrinath round trip with pickup date, senior citizen comfort, and all-inclusive pricing.
- [x] **29.2 Elder-Safety Vehicle Inspection Checklist (`HaridwarCabHubModal.tsx`)**
  - [x] 8-point critical safety checklist tailored to high-altitude Himalayan ascents (NH-7 Alaknanda valley):
    - Yellow Commercial Plate (`UK-08` / `UK-07` or `DL`) with valid Hill Green Card / Trip Card.
    - Mountain-endorsed commercial driver license with 5+ years ghat driving experience.
    - Middle-row captain seats with operational seatbelts for Rajnish Ji & Uncle Ji (Sanjay).
    - Mountain tyre health (deep tread grooves $>4\text{mm}$, fully inflated spare stepney, hydraulic jack & wheel spanner).
    - Functional air conditioning / defogger for heavy mist and valley rain.
    - All-inclusive written price agreement (Toll, Green Card, Parking, Driver DA $\le$ ₹400/night).
    - First aid kit with motion sickness bags (Avomine / Ondansetron) and camphor tablets.
    - Strict agreement on **NO NIGHT DRIVING** after 18:30 dusk on NH-7 curves.
  - [x] Real-time elder safety rating calculator (`All Clear / Elder Ready` vs `Caution Required`) stored persistently in `localStorage`.
- [x] **29.3 Driver Itinerary Handover & WhatsApp Briefing Generator**
  - [x] Form to record confirmed driver name, phone number, vehicle plate, model, and hotel pickup location.
  - [x] 1-Tap formatted Hindi/English WhatsApp message generator briefing the driver on:
    - 4 Pilgrims (including 2 senior citizens requiring gentle ghat cornering and prompt rest breaks).
    - Complete 3-day itinerary milestones (Day 3 Haridwar $\rightarrow$ Joshimath; Day 4 Darshan $\rightarrow$ Mana $\rightarrow$ Joshimath; Day 5 Dhari Devi $\rightarrow$ Haridwar).
    - Key passenger contacts (Utkarsh & Shreyas) and emergency helplines.
- [x] **29.4 Cross-Day Logistics Synchronization Engine**
  - [x] `handleSyncDriverLogistics` in `ItineraryPreview.tsx` automatically cascades the confirmed driver, phone, plate, and vehicle model across `seg-2` (Haridwar Cab Booking), `seg-3` (Ascent), `seg-4` (Darshan), and `seg-5` (Descent) in Dexie IndexedDB.
  - [x] Contextual Day 2 Cab Booking card banner displayed prominently on Day 2 in the itinerary.
  - [x] Dedicated "Hill Cab Hub" quick action pill in the preparation pills row for instant 1-tap access anytime.
- [x] **29.5 Dual-Compilation & Build Verification**
  - [x] `npm --prefix client run build`: Passed cleanly with zero TypeScript errors.
  - [x] `npm --prefix server run build`: Passed cleanly with zero TypeScript errors.

---

### ✅ Phase 30: "Today at a Glance" Live Auto-Pilot Mode & Next-Up Milestone Ticker
*Status: Completed & Verified on Sep 22, 2026*

- [x] **30.1 Real-Time Day Detection & Auto-Pilot Engine (`useAutoPilot.ts`)**
  - [x] Auto-detects real calendar date against the 9 pilgrimage days (Sep 24 – Oct 02, 2026).
  - [x] Live 1-second ticking clock in Indian Standard Time (IST).
  - [x] Pre-Trip Phase: calculates precise days/hours/minutes/seconds countdown until Train 12441 Bilaspur Rajdhani departs Durg Platform 1 (Sep 24, 16:30).
  - [x] Testing & Simulation Engine: allows instant 1-click preview of any pilgrimage day (e.g. Day 2 Delhi $\rightarrow$ Haridwar, Day 4 Badrinath Darshan) stored in `sessionStorage` with a clean 1-click reset to live calendar date.
  - [x] Persistent Auto-Pilot active state stored in `localStorage`.
- [x] **30.2 "Today at a Glance" Live Mission Card (`TodayAtAGlanceCard.tsx`)**
  - [x] Real-time header with status badge (`LIVE TODAY`, `AUTO-PILOT: PRE-TRIP`, or `DEMO: DAY X`), test days dropdown, and live IST clock.
  - [x] High-contrast digital departure countdown block for pre-trip preparation.
  - [x] Next-Up Milestone Ticker: dynamically scans the active day's checkpoints, isolates the upcoming uncompleted task, displays target time, checkpoint name, and elder comfort note.
  - [x] 1-Tap `✓ Mark Done` action directly on the card with instant Dexie persistence and visual tick animation.
  - [x] Dynamic Progress Meter: displays completed vs total milestones (e.g., `3/5 Milestones • 60%`) with smooth gradient progress bar.
  - [x] Celebration card when all checkpoints for the day are accomplished.
  - [x] "Jump to Today" shortcut when browsing ahead or looking at other days on the day selector strip.
- [x] **30.3 Day Selector Strip Integration (`DaySelectorStrip.tsx`)**
  - [x] Glowing green `TODAY` indicator badge placed directly on the active day's pill button in the horizontal strip.
  - [x] 1-Tap "Today" jump button in the timeline header row.
- [x] **30.4 Dual-Compilation & Build Verification**
  - [x] `npm --prefix client run build`: Passed cleanly with zero TypeScript errors.
  - [x] `npm --prefix server run build`: Passed cleanly with zero TypeScript errors.

---

### ✅ Phase 31: Elder-Care Meal & Bio-Break Interval Advisor (2.5h Highway Limit)
*Status: Completed & Verified on Sep 22, 2026*

- [x] **31.1 Verified Roadside Rest-Stops Database (`trip.config.ts`)**
  - [x] Curated 8 verified highway halts tailored for senior fathers (Rajnish Ji & Sanjay Ji):
    - *Delhi-Meerut / HW Expressway (Day 2)*: Cheetal Grand (Khatauli) & Namaste Midway (Mansurpur) with 5/5 luxury Western washrooms, wheelchair ramps, hot Jain/vegetarian meals, and masala tea.
    - *NH-7 Mountain Highway (Day 3 & Day 5)*: Teen Dhara Spring Oasis (fresh lime water for altitude nausea), Devprayag Sangam Viewpoint (10-min leg stretch), Srinagar Garhwal (GMVN/Hotel Chahat, hospital & medical shops), Rudraprayag Sangam, Pipalkoti Valley, and Joshimath base.
  - [x] Each stop includes star cleanliness rating, Western WC availability, wheelchair accessibility, recommended senior treat (e.g. hot ginger tea, yellow dal khichdi, pahadi soup), and driving time from origin.
- [x] **31.2 Active Driving Timer & Bio-Break Interval Engine (`ElderBreakAdvisorModal.tsx`)**
  - [x] Live elapsed driving timer calculating time on the road since last stop.
  - [x] Three-tier elder dignity alert levels:
    - 🟢 *Drive Time Healthy* ($<2\text{h}$): Normal relaxed travel.
    - 🟡 *Break Recommended Soon* ($2\text{h} - 2.5\text{h}$): Informs drivers and sons to plan a pull-over within 20 minutes.
    - 🔴 *Bio-Break Overdue* ($>2.5\text{h}$): High-priority pulsating warning advising immediate stop to prevent joint stiffness and nausea.
  - [x] 1-Tap "Stopped Here: Reset 2.5h Interval" button with `localStorage` persistence and transient toast confirmation.
  - [x] Highway filter selector (NH-7 Mountain Ghat vs Delhi-HW Expressway vs All).
- [x] **31.3 Contextual UI Integration (`ItineraryPreview.tsx`)**
  - [x] Dedicated "Elder Bio-Breaks" quick action pill in the preparation pills row.
  - [x] Contextual callout banner automatically displayed on long highway travel days (Day 3 & Day 5) to keep sons and drivers aligned on senior comfort.

---

### ✅ Phase 32: Temple Darshan & Aarti Timekeeper with 528Hz Bronze Bell Chime
*Status: Completed & Verified on Sep 22, 2026*

- [x] **32.1 Auspicious Rituals & Darshan Slots Schedule (`trip.config.ts`)**
  - [x] Curated 7 sacred ritual slots across Haridwar, Badrinath, and Rishikesh:
    - *Day 2 (Sep 25)*: Har Ki Pauri Maha Ganga Sandhya Aarti (17:45 – 18:30; arrive by 16:45 for Malviya Dweep seating).
    - *Day 4 (Sep 27)*: Shri Badrinath Brahma Muhurta Maha Abhishek & Nirmalya Darshan (04:30 – 06:30; arrive by 04:15).
    - *Day 4 (Sep 27)*: Brahma Kapal Ghat Ancestral Pind Daan & Tarpan Mahapuja (08:30 – 11:00; arrive by 08:15).
    - *Day 4 (Sep 27)*: Shri Badrinath Shayan Aarti & Geeta Govinda Recital (18:00 – 19:30; arrive by 17:15).
    - *Day 5 (Sep 28)*: Maa Dhari Devi Enroute Darshan & Afternoon Bhog (11:30 – 13:00; arrive by 11:15).
    - *Day 6 (Sep 29)*: Har Ki Pauri Complete Sandhya Aarti & Deep Daan (17:45 – 18:30; arrive by 16:45).
    - *Day 7 (Sep 30)*: Parmarth Niketan Ganga Aarti & Choir, Rishikesh (17:30 – 18:30; arrive by 16:45).
  - [x] Detailed elder seating advice (cushions for cold stones, wooden stools, wheelchair access ramps) and traditional attire recommendations (Dhoti/Kurta for Karta, heavy woollen coats for 3,133m altitude chill).
- [x] **32.2 Offline Sacred Bronze Bell Synthesizer (`sacredBellAudio.ts`)**
  - [x] Web Audio API synthetic bell generator using 528Hz Ohm fundamental frequency and 4 natural bronze harmonics decaying smoothly over 3.5 seconds.
  - [x] 100% offline, zero-network, zero-cost audio synthesizer requiring zero external MP3 downloads.
- [x] **32.3 Sacred Aarti Timekeeper Modal (`SacredAartiTimekeeperModal.tsx`)**
  - [x] Filter by "Today's Rituals" vs "All Pilgrimage Rituals".
  - [x] 1-Tap "Ring Bell" button to chime the sacred temple bell.
  - [x] "Arrive by" queue cutoff notices ensuring seniors never get stuck in peak crowd surges.
- [x] **32.4 Contextual UI Integration (`ItineraryPreview.tsx`)**
  - [x] Dedicated "Aarti Timekeeper" quick action pill in the preparation pills row.
  - [x] Contextual callout banner automatically displayed on sacred temple days (Day 2, Day 4, Day 6, Day 7).
- [x] **32.5 Dual-Compilation & Build Verification**
  - [x] `npm --prefix client run build`: Passed cleanly with zero TypeScript errors.
  - [x] `npm --prefix server run build`: Passed cleanly with zero TypeScript errors.

---

### ✅ Phase 33: Day-by-Day Outfit & Weather Dress-Code Advisor (9-Day Matrix)
*Status: Completed & Verified on Sep 22, 2026*

- [x] **33.1 Complete 9-Day Weather & Clothing Guidance Data Structure (`trip.config.ts`, `types/index.ts`)**
  - [x] Defined `DayOutfitGuidance` type covering weather, temperature ranges, elder specific attire, sons attire, footwear, and interactive day-bag checklist.
  - [x] Detailed climate mappings across the 9-day journey:
    - *Day 1 (Durg to Delhi AC Train)*: Light cotton layers, travel socks, light shawl for 3AC/2AC train draft.
    - *Day 2 (Delhi to Haridwar Plains)*: 30°C–34°C humid heat; breathable Kurta/Pajama for Ganga Aarti.
    - *Day 3 (Haridwar to Joshimath/Badrinath Ascent)*: Temperature plunge from 28°C down to 8°C; mandatory thermal innerwear + fleece jacket at Joshimath checkpost.
    - *Day 4 (Badrinath Darshan & Mana Village)*: 3°C–12°C high-altitude chill; heavy woollens, monkey cap, muffler, gloves for Rajnish Ji & Sanjay Ji; traditional cotton Dhoti/Kurta for Karta during Brahma Kapal pind daan.
    - *Day 5 (Return Ghat to Haridwar)*: Transitional layering shedding thermals as descending to plains.
    - *Day 6–8 (Haridwar & Rishikesh Exploration)*: Modest temple attire, easy slip-on shoes for temple ghats, sun hats.
    - *Day 9 (Dehradun Airport & IndiGo Flight)*: Comfortable airport apparel, slip-on shoes for security check, light jacket for cabin AC.
- [x] **33.2 Outfit & Weather Dress-Code Advisor Modal (`OutfitWeatherAdvisorModal.tsx`)**
  - [x] Horizontal 9-day selector pills allowing instant inspection of any day of the pilgrimage.
  - [x] Temperature badge, weather conditions, elder attire card with amber accents, sons attire card with sky accents, and footwear recommendation.
  - [x] Interactive day-bag checklist with tap-to-check state allowing families to verify essential medicines, caps, and water before departing hotel.
  - [x] High-contrast UI with $\ge 48\text{px}$ touch targets meeting Elder Dignity standards.
- [x] **33.3 Contextual UI Integration (`ItineraryPreview.tsx`)**
  - [x] Quick access "Dress & Weather" action pill in Row 3.
  - [x] Opens directly to the active selected day in the itinerary.

---

### ✅ Phase 34: Daily Hard Cash vs UPI Advisor & Dead-Zone ATM Guard
*Status: Completed & Verified on Sep 22, 2026*

- [x] **34.1 Complete 9-Day Financial & Connectivity Guidance Data Structure (`trip.config.ts`, `types/index.ts`)**
  - [x] Defined `DayCashUpiGuidance` type with recommended cash per duo, UPI reliability classification (`FULL_UPI`, `INTERMITTENT`, `CASH_MANDATORY`), primary cash expenses list, last reliable ATM alert, and optimal currency denomination split.
  - [x] High-fidelity Himalayan reality mapping:
    - *Day 1–2 (Plains & Delhi/Haridwar)*: Full UPI functionality; minimal cash needed (₹1,500 for auto/rickshaws).
    - *Day 3 (Highway Ascent)*: Intermittent UPI in river canyons; ₹3,000 cash needed for dhabas and toll-points.
    - *Day 4 (Badrinath & Mana)*: **Zero-signal dead zone / Cash Mandatory!** ATMs frequently dry or offline. Explicit alert to carry ₹6,000–₹8,000 in crisp ₹100, ₹200, and ₹500 notes for Panda dakshina at Brahma Kapal, temple offerings, and Mana Village tea stalls. Alert warns that **Joshimath (Day 3)** is the last 100% reliable ATM.
    - *Day 5–9 (Descent & Return)*: Cash requirements decrease back to standard tourist levels; Haridwar & Rishikesh markets accept UPI.
- [x] **34.2 Hard Cash vs UPI Advisor Modal (`CashVsUpiAdvisorModal.tsx`)**
  - [x] 9-day day-switcher strip with visual connectivity indicators.
  - [x] Distinct color badges for UPI status (Emerald for Full UPI, Amber for Intermittent, Rose for Cash Mandatory).
  - [x] Prominent "Last Reliable ATM" warning callout box with location pins.
  - [x] Itemized cash expense list and recommended denomination breakdown chips (e.g. ₹500 × 8, ₹200 × 10, ₹100 × 15, ₹50 × 10).
- [x] **34.3 Contextual UI Integration (`ItineraryPreview.tsx`)**
  - [x] Quick access "Cash vs UPI" action pill in Row 3.
  - [x] Seamless modal switching aligned with the active itinerary view.
- [x] **34.4 Dual-Compilation & Build Verification**
  - [x] `npm --prefix client run build`: Passed cleanly with zero TypeScript errors.
  - [x] `npm --prefix server run build`: Passed cleanly with zero TypeScript errors.

---

### ✅ Phase 35: Bilingual Driver & Local Voice Phrasebook (Hindi & Garhwali Audio)
*Status: Completed & Verified on Sep 22, 2026*

- [x] **35.1 Curated Himalayan & Driver Phrasebook Database (`trip.config.ts`, `types/index.ts`)**
  - [x] Defined `TravelPhrase` schema with Devanagari Hindi, phonetic English transliteration, English meaning, context tip, audio text, and Pahadi marker.
  - [x] Curated 20 essential phrases across 5 critical pilgrimage categories:
    - *Cab & Driving Safety*: Polite requests to slow down on hairpin curves for senior motion sickness ("Bhaiya thoda aaram se chalaiye..."), 2.5h bio-break requests, cracking windows for fresh mountain air, no-overtake reminders on blind curves, and dusk arrival check.
    - *Garhwali / Pahadi Local*: Traditional respectful greetings ("Bhaaiji, saadar dandavat pranaam!"), health inquiries ("Kanduk chho aap?"), road & landslide status ("Aagai baatu theek cha?"), Badrinath distance inquiries, and divine gratitude ("Bhagwan Badrivishal tum tain khush raakhin!").
    - *Temple, Rituals & Pandas*: Inquiring about Brahma Kapal ancestral Tarpan & Pind Daan rituals, accessible elder queues / ramps, Aarti timing & crowd queue cutoff recommendations, and safe non-slip bathing at Tapt Kund.
    - *Food & Senior Digestive Care*: Yellow moong dal khichdi without chillies/onion/garlic for fathers, clean boiled/lukewarm drinking water, and hot ginger-tulsi tea for altitude chill.
    - *Emergency & Medical*: Nearest chemist / PHC location, portable oxygen canister & BP check availability, and SDRF / police disaster assistance booth locator.
- [x] **35.2 Web Speech API Native Offline Audio Playback (`DriverVoicePhrasebookModal.tsx`)**
  - [x] Web Speech API integration (`SpeechSynthesisUtterance`) with automatic `hi-IN` Hindi voice selection.
  - [x] 100% offline, zero-network, zero-cost audio pronunciation with 0.88x gentle rate for mountain clarity.
  - [x] Active speech status with pulsating button and 1-tap "Stop Voice" toggle.
  - [x] Category selector tabs + instant live search input for keywords (e.g. AC, oxygen, dal, stop, nausea).
  - [x] 1-Tap "Copy" to clipboard with checkmark confirmation and 1-Tap "Share via WhatsApp".
- [x] **35.3 Contextual UI Integration (`ItineraryPreview.tsx`)**
  - [x] Quick access "Voice Phrasebook" pill in Row 4 with speaker volume icon.

---

### ✅ Phase 36: Day Itinerary Export to WhatsApp & Offline Printable Sheet / PDF
*Status: Completed & Verified on Sep 22, 2026*

- [x] **36.1 Rich WhatsApp Briefing Generator (`DayItineraryExportModal.tsx`)**
  - [x] Generates beautifully formatted WhatsApp text with bold headers, italics, dates, elevations, weather overview, cash recommendations, sacred Aarti muhurtas, milestones with elder notes, transit logistics, and emergency contacts.
  - [x] Toggle between "Single Day Schedule" (Day 1–9) and "Entire 9-Day Master Dossier".
  - [x] 1-Tap "Copy WhatsApp Text" to clipboard with animated visual confirmation.
  - [x] 1-Tap "Open in WhatsApp" via encoded deep link (`https://api.whatsapp.com/send?text=...`).
- [x] **36.2 Printer-Ready Offline Sheet / PDF Layout (`DayItineraryExportModal.tsx`)**
  - [x] High-contrast, clean-border print layout for physical paper printing or "Save as PDF".
  - [x] Pilgrim roster header: Family A (Utkarsh & Rajnish Ji) & Family B (Shreyas & Sanjay Ji).
  - [x] Itemized timetable table with milestone times and elder care notes.
  - [x] Prominent emergency contact box (SDRF: 1070 / 112, Badrinath Control Room, Railway Helpline, AIIMS Rishikesh).
  - [x] 1-Tap "Print Sheet / Save as PDF" button triggering native `window.print()`.
- [x] **36.3 Contextual UI Integration (`ItineraryPreview.tsx`)**
  - [x] Quick access "Export & WhatsApp" pill in Row 4 with share icon.
- [x] **36.4 Dual-Compilation & Build Verification**
  - [x] `npm --prefix client run build`: Passed cleanly with zero TypeScript errors.
  - [x] `npm --prefix server run build`: Passed cleanly with zero TypeScript errors.

---

### ✅ Phase 37: Comprehensive Page-to-Page Mobile UI/UX Audit & Ergonomic Hardening
*Status: Completed & Verified on Sep 22, 2026 (100%)*

- [x] **37.1 Safe-Area Inset Ergonomics (`BottomDock.tsx`, `FloatingChatButton.tsx`, `App.tsx`)**
  - [x] Upgraded bottom dock positioning from static `bottom-3` to dynamic `bottom-[max(0.75rem,env(safe-area-inset-bottom,0px))]` to eliminate collision with modern iOS gesture indicators and Android navigation bars.
  - [x] Upgraded floating AI assistant bubble to `bottom-[calc(max(0.75rem,env(safe-area-inset-bottom,0px))+4.25rem)]` for consistent spacing above the dock across all device aspect ratios.
  - [x] Hardened main scroll container bottom padding to `pb-[calc(6rem+env(safe-area-inset-bottom,0px))]` so bottom-most content and cards scroll cleanly above the floating dock.
- [x] **37.2 Floating Action Buttons & Elevation Sheet Alignment**
  - [x] Upgraded Vault scan pass FAB to `bottom-[calc(max(0.75rem,env(safe-area-inset-bottom,0px))+4.5rem)]`.
  - [x] Upgraded Gullak add expense FAB to `bottom-[calc(max(0.75rem,env(safe-area-inset-bottom,0px))+4.5rem)]`.
  - [x] Upgraded Tracking elevation & telemetry bottom sheet to `bottom-[calc(max(0.75rem,env(safe-area-inset-bottom,0px))+4.25rem)]`.
- [x] **37.3 Touch Targets ($\ge 48\text{px}$ `min-h-touch`) Enforced Across All Modules**
  - [x] `ItineraryPreview.tsx`: Applied `min-h-touch` across all action rows (Packing, Brahma Kapal, Cab Hub, Bio-Breaks, Aarti, Dress Code, Cash vs UPI, Voice Phrasebook, WhatsApp Export).
  - [x] `DaySelectorStrip.tsx`: Enforced `min-h-[52px]` and `min-w-[78px]` on day pill buttons; added smooth auto-scroll to center active day pill on selection change.
  - [x] `EmergencyModal.tsx`: Upgraded 108/112/1364/Joshimath speed dials, medical directory, and 2G SMS buttons to `min-h-touch`.
  - [x] `AppSidebar.tsx`: Upgraded manual cloud sync and Emergency SOS protocol buttons to `min-h-touch`.
  - [x] `Header.tsx`: Upgraded hamburger drawer button to `w-10 h-10` with comfortable touch targets.
  - [x] `VoiceFeedPreview.tsx` & `FamilyFeedTab.tsx`: Enforced `min-h-touch` on Chants open, Voice Studio toggle, photo attach, and publish buttons.
  - [x] `RouteGuardTab.tsx`: Enforced `min-h-touch` on Gemini live scan and road obstruction spotter buttons.
  - [x] `TrackingPreview.tsx`: Upgraded Mountain Shadow relief launchers to `min-h-touch`.
- [x] **37.4 Offline Printable Sheet Stylesheet (`index.css`)**
  - [x] Added dedicated `@media print` rules hiding app navigation chrome, header, floating buttons, and rendering clean, high-contrast black-and-white trip dossiers.
- [x] **37.5 Dual-Compilation & Build Verification**
  - [x] `npm --prefix client run build`: Passed cleanly with zero TypeScript errors.
  - [x] `npm --prefix server run build`: Passed cleanly with zero TypeScript errors.

---

## 🧭 Key Architectural Invariants (Must Never Be Broken)

1. **Elder Dignity & High Contrast First:** All text must meet minimum contrast ratios; all touch buttons must be $\ge 48\text{px}$; no tiny links or confusing gestures.
2. **Local-First Supremacy:** Any action taken in a cellular dead zone (marking a checkpoint, viewing a ticket, pinging location, logging an expense, tracking $SpO_2$, writing a chat message) must work immediately via Dexie IndexedDB and silently queue for background synchronization.
3. **Paired Family Identity:** Always preserve family distinctions (Family A: Utkarsh & Rajnish Ji, Family B: Shreyas & Sanjay).
4. **Zero-Cost Constraint:** Use free-tier tooling exclusively (Google AI Studio `@google/genai`, OpenStreetMap tiles via Leaflet, MongoDB Atlas M0, Google SMTP via Gmail App Password, Vercel/Render free tiers).

