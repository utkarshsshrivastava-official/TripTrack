# TripTrack by Ut-tech — Pilgrimage Development Tracker & Checklist

**Project:** TripTrack by Ut-tech  
**Target:** Private, Offline-First Mobile PWA for Badrinath Dham 2026 (Sep 24 – Oct 02, 2026)  
**Primary Users:** 4 Pilgrims (2 Father-Son Duos: Utkarsh & Rajnish Ji, Shreyas & Sanjay) + Extended Home Family (4–8 members total)  
**Current Status:** **Phases 1–4 Complete (100%)** • **Phase 5 Ready for Kickoff (0%)** • **Phases 6–8 Planned**  
**Last Updated:** September 12, 2026

---

## 📊 Overall Roadmap Completion

| Phase | Description | Status | Progress | Target Timeline |
| :--- | :--- | :---: | :---: | :--- |
| **Phase 1** | **Scaffolding, Mobile-First PWA & Seed Layer** | ✅ **DONE** | 100% | Completed |
| **Phase 2** | **Offline Document Vault & Gemini AI Parser** | ✅ **DONE** | 100% | Completed |
| **Phase 3** | **Itinerary Tracker & Leaflet Map Engine** | ✅ **DONE** | 100% | Completed |
| **Phase 4** | **Dead-Zone Shadow Guard & Voice Logger** | ✅ **DONE** | 100% | Completed |
| **Phase 5** | **Profile Login, Family Chat & Email Alerts** | ✅ **DONE** | 100% | Completed |
| **Phase 6** | **Elder Care, Altitude Health & Reassurance** | ⏳ **NEXT** | 0% | Up Next |
| **Phase 7** | **Sacred Liturgy, Stotra Player & Memorial** | ⏳ **QUEUED** | 0% | Queued |
| **Phase 8** | **Production Hardening, PWA Audit & Deploy** | ⏳ **QUEUED** | 0% | Final Phase |

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

### ✅ Phase 5: Individual Profile Login, Real-Time Family Chat & Email Alerts
*Status: Completed & Verified on Sep 12, 2026*

- [x] **5.1 Individual Profile Login & Guest Identity System**
  - [x] Define `UserProfile` entity supporting 4 Pilgrims (`DUO_A`: Utkarsh, Rajnish; `DUO_B`: Shreyas, Sanjay) + 4 Home Guests (`guest-1` to `guest-4`).
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
  - [x] Display Duo identity badges (`DUO_A`: Utkarsh / Rajnish Ji; `DUO_B`: Shreyas / Sanjay) and elder-first high contrast typography.
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

### ⏳ Phase 6: Elder Care, Altitude Health & Dead-Zone Reassurance
*Status: Queued (0%) • Target: Oxygen Monitoring, Hydration/Meds Cadence & 2G Offline SMS*

- [ ] **6.1 Dexie Pulse Oximeter Engine**
  - [ ] Add `oximeterLogs: 'id, travellerId, recordedAt'` to client Dexie schema.
  - [ ] Implement `oximeterStorage.ts` logging $SpO_2$ %, heart rate bpm, altitude, and notes.
  - [ ] Altitude safety alert heuristic: automatic warning banner if $SpO_2 < 88\%$ at elevations $>3,000\text{m}$ (Joshimath / Badrinath).
- [ ] **6.2 Pulse Oximeter Logger UI (`OximeterLoggerModal.tsx`)**
  - [ ] Large fingertip reading input dialog with instant normal / borderline / warning color-coded gauge.
  - [ ] Historical reading sparkline/timeline for fathers (Rajnish Ji & Sanjay Ji).
- [ ] **6.3 Hydration & BP Medication Cadence (`HydrationMedsTracker.tsx`)**
  - [ ] 90-minute hydration countdown timer with pleasant chime / haptic vibration for dry mountain air acclimatization.
  - [ ] Morning & Evening BP medication checkoff toggles with timestamped logs.
  - [ ] Persistent quick pill embedded in app navigation header.
- [ ] **6.4 NH-7 Emergency Relief Post Directory (`MedicalDirectoryModal.tsx`)**
  - [ ] Offline medical resource directory covering NH-7 corridor:
    - Devprayag Community Health Center
    - Srinagar Government Base Medical College
    - Rudraprayag District Hospital
    - Joshimath Army / CHC Hospital
    - Badrinath Dham Army Medical Relief Camp & PHC
  - [ ] 1-tap direct `tel:` dialer buttons with oxygen cylinder availability notes.
  - [ ] Link launcher directly in `EmergencyModal.tsx`.
- [ ] **6.5 Zero-Signal 2G SMS & WhatsApp Reassurance Generator (`OfflineSmsModal.tsx`)**
  - [ ] 1-tap `sms:?body=...` generator formatted with GPS lat/lng, altitude, battery %, milestone name, and elder health status.
  - [ ] Works via native cellular SMS without data packets in deep mountain dead zones.
  - [ ] WhatsApp fallback trigger for momentary 2G/EDGE connectivity windows.
  - [ ] Embed 2G SMS launcher in `TrackingPreview.tsx` alongside Mountain Shadow Guard banner.

---

### ⏳ Phase 7: Sacred Pilgrimage Suite, Audio Chants & Memorial
*Status: Queued (0%) • Target: Brahma Kapal Liturgy, Offline Stotras & Gullak Memorial Export*

- [ ] **7.1 Brahma Kapal Pitru Tarpan Ritual Guide (`BrahmaKapalGuideModal.tsx`)**
  - [ ] Complete offline step-by-step liturgy guide for Pitru Tarpan rituals at Brahma Kapal Ghat (Badrinath).
  - [ ] Samagri checklist (black sesame, barley, kush grass, gangajal, uncooked rice).
  - [ ] Panda / family priest contact and lineage register card.
- [ ] **7.2 Dynamic Segment Packing Checklist (`PackingChecklistModal.tsx`)**
  - [ ] Segment-specific packing checklists (thermals, down jackets, rain ponchos, power banks, medication boxes).
  - [ ] Dexie IndexedDB persistence with quick checkoff progress bar.
  - [ ] Launch triggers from `ItineraryPreview.tsx`.
- [ ] **7.3 Offline Sacred Chants & Stotras Player (`OfflineStotraPlayer.tsx`)**
  - [ ] Built-in audio player with synced Sanskrit & Hindi lyrics in `VoiceFeedPreview.tsx`.
  - [ ] Chants library: *Badrinath Aarti (Shri Badrinath Stuti)*, *Vishnu Sahasranama*, *Hanuman Chalisa*.
  - [ ] Offline audio synth / lightweight web audio playback for long cab journeys between Rishikesh and Badrinath.
- [ ] **7.4 Printable Yatra Memorial & 50/50 Gullak Settlement (`YatraMemorialModal.tsx`)**
  - [ ] Generate printable / shareable pilgrimage souvenir card with crossed milestones, duration, and elder blessing notes.
  - [ ] Complete 50/50 Gullak shared expense settlement breakdown between Utkarsh and Shreyas.
  - [ ] Print-ready CSS `@media print` styling for 1-tap PDF export / physical printing.

---

### ⏳ Phase 8: Production Hardening, PWA Audit & Deployment
*Status: Queued (0%) • Target: Flawless Offline Reliability & Zero-Cost Cloud Hosting*

- [ ] **8.1 PWA Offline Audit**
  - [ ] Verify Chrome DevTools "Offline" throttling mode retains 100% functionality across all tabs.
  - [ ] Lighthouse audit for PWA, Accessibility (WCAG AAA contrast for elders), and Performance.
  - [ ] Service worker cache invalidation tests for updates.
- [ ] **8.2 Security & Shared PIN Access**
  - [ ] Verify `x-family-pin` authentication across all backend endpoints.
  - [ ] Rate limiting on public API endpoints.
- [ ] **8.3 Cloud Deployment Configuration**
  - [ ] Configure `vercel.json` for frontend PWA deployment.
  - [ ] Configure Render / Railway deployment for Express API.
  - [ ] Validate MongoDB Atlas M0 network access rules and environment secrets.

---

## 🧭 Key Architectural Invariants (Must Never Be Broken)

1. **Elder Dignity & High Contrast First:** All text must meet minimum contrast ratios; all touch buttons must be $\ge 48\text{px}$; no tiny links or confusing gestures.
2. **Local-First Supremacy:** Any action taken in a cellular dead zone (marking a checkpoint, viewing a ticket, pinging location, logging an expense, tracking $SpO_2$, writing a chat message) must work immediately via Dexie IndexedDB and silently queue for background synchronization.
3. **Paired Duo Identity:** Always preserve duo distinctions (`DUO_A`: Utkarsh & Rajnish Ji, `DUO_B`: Shreyas & Sanjay).
4. **Zero-Cost Constraint:** Use free-tier tooling exclusively (Google AI Studio `@google/genai`, OpenStreetMap tiles via Leaflet, MongoDB Atlas M0, Google SMTP via Gmail App Password, Vercel/Render free tiers).
