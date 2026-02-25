# Development Walkthrough: Oak Lodge Property Management Dashboard

## What was Accomplished?
This session completed Phase 2 of the application's UI development, successfully shifting it from a static viewer into an interactive and highly dynamic management environment under the new "Oak Lodge" brand identity.

### Phase 2 Features Added:
*   **The Oak Lodge Rebranding:** Updated all global references from "Shimla Building" to "Oak Lodge", retaining the sleek futuristic minimalist aesthetic.
*   **Data Editing Superpower:** The `UnitDetailModal` was deeply expanded. You can now tap an "Edit" icon (represented by the pen) internally on any non-private unit to convert the card into an interactive form. You can seamlessly reconfigure Names, Rent, Contact Numbers, and all utility tracking information without leaving the view.
    *   *Note:* The system permits shared utility meter numbers intelligently (e.g. multiple units sharing the same Water or Elec numbers are totally fine and supported).
    *   Upon pressing Save, the specific unit config is mutated directly into memory and triggers a re-render of the Dashboard metrics and interactive map simultaneously to maintain true reality sync.
*   **Animated Analytics Dashboard:** Designed and installed a clean data reporting layer (`Dashboard.jsx`) employing the `recharts` library for smooth data transitions tracking Monthly Revenues vs Utilities by floor and total 6-month Run Rate projections.
*   **Flat 2D Architecture Engine:** The building view (`BuildingVisualMap.jsx`) now relies on a pure, geometrically elegant 2D styling using a custom UI background to eliminate the overlapping visual clutter present in the 3D renders.
*   **Omni-Filter System:** Added a scalable query system controlling what units and analytics appear in the Dashboard and Interactive Map simultaneously, based off of physical logic like Floor, specific Electricity Connections, and precise Unit IDs.

### Phase 3 Features Added (Data Pipeline & Rent Cycles)
*   **Dynamic Rent Cycles:** Shifted the underlying data structure away from a static integer (`rent: 12000`) to a `rentHistory` array that robustly tracks the exact start and end months of each unique rent agreement. Data natively starts logging from **Jan 2026** to prepare for Google Sheets.
*   **Targeted Rent Editing:** Updated the Unit Detail's Edit Mode so that users can input exactly *how much* rent is owed and *how long* the cycle lasts (Start Month → End Month). Saving this mutates the active history cycle instantly.
*   **Expiration Alerts:** Engineered a global `RentAlert.jsx` component that dynamically probes every property's active rent cycle every time the app loads or data is mutated. If a rent agreement is lapsing within 1 month, a high-visibility amber banner automatically populates on the Dashboard.
    *   Clicking the banner immediately opens the offending unit's detail modal for quick re-negotiation and editing in one unified flow.

### Phase 4 Features Added (Bulk Data Collection Operations)
*   **The Global Spreadsheet Pipeline:** Ripped out the old, redundant `VerticalMap` Directory List. Replacing it at the bottom of the app is the new `BulkDataEntry` view. This component provides a lightning-fast spreadsheet-like Grid to process entire building ledgers at the end of the month without manually clicking into units one by one.
*   **Synchronous Time-Travel Editing:** Contains an active Month/Year selector. You can type directly into fields for *Rent, Electricity, Water*, and *Garbage* concurrently for every active unit on site within that billing month.
*   **Granular Render Refresh Engine:** Pressing "Save All" pushes the entire building state mock payload back up into the app context seamlessly, behaving exactly as you want it to for the later Google Sheets massive update endpoint.
*   **New Revenue Analytics:** Expanded the main Dashboard with two extra Metric Cards:
    1.  **Rent Collected:** A live tracking sum aggregating the amount of rent currently tracked as "Paid" within the mock state map.
    2.  **Rent Due:** The inverse, showing total expected revenue outstanding (unpaid or overdue). These instantly update as you alter the dropdown flags down inside the Bulk Data component saving flows.

#### 4. Tenant Archival Engine
- Addressed bugs regarding ephemeral local state by writing a centralized `cloudSync.js` util.
- Wove `cloudSync.js` deeply into `TenantManagementModal.jsx` and `BulkDataEntry.jsx`. 
- When an eviction or a new lease begins, the React app automatically recalculates the physical map and immediately streams the change to Google Sheets.

#### 5. Phase 8: Universal Cloud Architecture [DEPRECATED]
- Built `fetchData.js`, a massive read-only Netlify Serverless Function bridging the PWA directly to Google Servers.
- Modified `App.jsx` to mount a blocking "Cloud Sync" loader.
- Erased all dummy mock-data from `buildingLayout.js`. It now serves only as an empty architectural blueprint, strictly hydrated dynamically upon every app launch.
- Upgraded `sync.js` (The Write Hook) to dynamically spawn an **"Oak Lodge Master Configs"** tab if it does not exist, capturing Unit Type, Phone Numbers, and Utility Meter Strings permanently to the cloud, resolving a core user requirement indicating missing data.

## Addressed Bugs & Validation
- **Dynamic Chronology**: Replaced statically encoded `2026-02` mock dates with a dynamic `getCurrentBillingMonth` hook in `RentAlert`, `Dashboard`, and `UnitDetailModal`.
- **Badge Robustness**: Tightened the logic array in `HistoricalTenants` so `undefined` and `null` explicitly trigger the "Current Occupant" state.
- **Server Safety Guards**: Injected hard parsing checks inside the Netlify functions to cleanly exit on missing Google Service Account variables rather than crashing ambiguously.
- **Google Sheets Integration (Phase 5)**:
    1. Created `google_sheets_setup.md` guiding the setup of Google Cloud Service Accounts.
    2. Built a secure mapping layer storing credentials exclusively in root `.env` securely isolated from git.
    3. Created `sync.js` Netlify Serverless Function designed to bypass the Vite frontend when sending large POST requests to the `google-spreadsheet` library directly.
    4. Rewired the main `handleMassSave` button in the UI to serialize data payloads and POST to the local/remote Netlify server hook.

### Tenant Tracking History (Phase 6)
1. Addressed the minor UI bug where a completely blank rent status was defaulting to Amber but mapping textually to "Paid". Blank states now explicitly default to "Unpaid" safely.
2. Expanded the data architecture of `buildingLayout.js` to ingest dynamically typed `tenantHistory` lists for any given unit.
3. Designed the brand new `HistoricalTenants.jsx` view. Optimized explicitly for string analysis (Name/Company), this gives the user a highly searchable snapshot of move-in and move-out cycles independent of financial ledger views.
4. Upgraded the `sync.js` serverless function. Every time you hit the "Save All" button in the Bulk Editor, the function will not only synchronize the Monthly Ledger sheet, but will inherently auto-generate or overwrite the "Tenant Directory" sheet. This ensures that the Google Sheets database maintains synchronous fidelity with the PWA structure.

## Resolution of the Hydration Crash (Phase 9 - Firebase Migration)
A critical architectural bottleneck was discovered regarding the reliance on Google Sheets via the Netlify Dev Proxy.

### The Bug ("White Screen of Death")
The user reported that clicking on a specific Unit instantly crashed the application, displaying a blank white screen. Our browser subagents successfully traced the execution path and identified the root cause as a **React Hydration Crash**. 
- The local Vite development server (`localhost:5173`) was attempting to fetch the master ledger database from the Netlify Serverless function (`/.netlify/functions/fetchData`).
- Because the `netlify dev` HTTP environment was uninitialized or bindings were missing on the host machine, the proxy routing broke.
- Instead of returning a JSON payload, Vite returned its default `index.html` 404 fallback.
- The `await response.json()` expression exploded internally. When the fractured mock data fell through to `UnitDetailModal`, undefined variable lookups (e.g. `Zap` missing import, or `cloudDb.ledger.filter`) bypassed the default React DOM and crashed the entire client interface.

### The Fix (Native Firebase NoSQL)
Tracking the instability back to the HTTP API proxy layer, the entire backend paradigm was overhauled to utilize **Cloud Firestore**.

1. **Google Sheets Deprecated:** The unstable Netlify functions (`sync.js` and `fetchData.js`) and `google-spreadsheet` API integrations were deleted alongside their dev dependencies.
2. **Native SDK Integration:** The official `@firebase/app` SDK was configured directly inside the client (`src/config/firebase.js`).
3. **NoSQL Schema Implementation:** `cloudSync.js` was completely rewritten to push and pull data directly to independent, hyper-fast Collections:
   - **`Units`**: Static configuration and meter endpoints.
   - **`Tenants`**: Denormalized history of occupants.
   - **`Ledger`**: Monthly logs isolating the specific billing amounts and utility tallies decoupled from the raw layout logic.
4. **Stable Hydration Loop:** The `App.jsx` engine now simply awaits `fetchBuildingStateFromCloud()`. By utilizing the official Google SDK over WebSockets, the 500 Network Proxy Error has been completely eradicated.
5. **Real-time Synchronization**: As the user modifies values within the `UnitDetailModal` or commits the grid via the `BulkDataEntry` layout, native `Promise.all()` arrays fire parallel `setDoc()` mutations natively across the Cloud array structure.

**Firebase Testing Verification Output:**
![Firebase Click Testing](/Users/gurman/.gemini/antigravity/brain/22bc9e17-ea0e-46a0-b880-b4936723f025/.system_generated/click_feedback/click_feedback_1772035172753.png)
