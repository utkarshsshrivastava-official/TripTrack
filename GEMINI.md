# Mandatory Workspace Rule: Progress Tracker Lifecycle & Development Standards

## 1. Progress Tracker Lifecycle Rule (MANDATORY)

For every task, feature, bugfix, or phase execution in this project:

1. **BEFORE STARTING A TASK:**
   - You **MUST** always refer to the project development progress tracker:
     - IDE Artifact: `progress_tracker.md`
     - Workspace file: [`progress_tracker.md`](./progress_tracker.md)
   - Inspect the current phase, check off dependencies, and verify the specific sub-checklists that apply to the upcoming work.
   - Ensure the new task aligns with the roadmap milestones and architectural invariants.

2. **AFTER COMPLETING A TASK:**
   - You **MUST** update the progress tracker:
     - Mark completed items and sub-checklists with `[x]`.
     - Update phase status, completion percentages, and milestone summaries in both the IDE artifact (`progress_tracker.md`) and the workspace file ([`progress_tracker.md`](./progress_tracker.md)).
     - If new sub-tasks or discoveries emerge, add them to the relevant phase checklist.

---

## 2. Core Architectural & Ergonomic Invariants

1. **Mobile-First & Elder Dignity Priority:**
   - Always prioritize mobile view ($390\text{px} - 430\text{px}$ width) and responsive ergonomics.
   - Touch targets must strictly remain $\ge 48\text{px}$ (`min-h-touch min-w-touch`).
   - Respect mobile safe-area insets (`env(safe-area-inset-top)` and `env(safe-area-inset-bottom)`).
   - High-contrast daylight readability for senior fathers (Rajnish Ji & Uncle Ji).

2. **Local-First Supremacy (Zero-Signal Resilience):**
   - The app must function 100% offline in Himalayan cellular dead zones (NH-7 Alaknanda valley).
   - Store all travel passes, tickets, and vouchers as binary Blobs in client IndexedDB (`Dexie.js`).
   - Queue telemetry, GPS pings, checkpoint checks, and expenses locally when offline, and auto-flush to MongoDB Atlas upon network reconnection.

3. **Paired Family Identity (`Family A` & `Family B`):**
   - Strictly maintain separation and filtering between:
     - `Family A`: Utkarsh (Son/Coordinator) & Rajnish Ji (Father/Elder)
     - `Family B`: Shreyas (Son/Coordinator) & Sanjay (Father/Elder / Uncle Ji)

4. **Zero-Cost Production Stack:**
   - Free tier `@google/genai` (`gemini-2.5-flash`) via Google AI Studio.
   - Free tier OpenStreetMap tiles via Leaflet (zero Google Maps API billing).
   - Free tier MongoDB Atlas M0 + Vercel PWA + Render backend.

---

## 3. Autonomous Command Execution Permission

The developer has granted explicit, standing permission to execute development commands proactively:
- Run all necessary `node`, `npm`, `npx`, `git`, `bash`, and PowerShell commands (installs, builds, tests, file inspections, dev server launches) directly and autonomously without asking for frequent permission prompts.
- Proactively verify and debug code changes via terminal execution to maintain high velocity and autonomous pair programming.
