# Shimla Building Property Management PWA

## Initial Setup & UI
- [x] Initialize Vite + React project in `shimla-building-pwa`
- [x] Configure Tailwind CSS v4 and install UI dependencies
- [x] Create `buildingLayout.js` config with mock data
- [x] Build main vertical map layout representing the floors
- [x] Implement pure white cards, 1px borders, soft shadows, and #F8FAFC background

## Unit Details & Functionality
- [x] Create detailed unit view showing all 9 tracking points
- [x] Implement smooth transitions and mobile "one-hand" responsive design
- [x] Implement logic to auto-flag "Overdue" status
- [x] Build robust form input interface directly on Unit Detail Cards for rapid editing
- [x] Re-brand application universally to 'Oak Lodge'

## Security & Auth
- [x] Add `robots.txt` disallowing crawlers
- [x] Implement PIN-code splash screen auth gate
- [x] Set up environment variables structure implementation

## Phase 2: Analytics & Visual Map
- [x] Connect `recharts` and create `Dashboard.jsx` for metrics
- [x] Implement animated MetricCards mapping to Total Rent, Run Rate, Elec, and Water.
- [x] Build global Filter system (by Floor, Unit, Elec#, Water#) 
- [x] Create `BuildingVisualMap.jsx` using Grid structures
- [x] Integrate both into the main `App.jsx` above the existing list

## Phase 3: Data Pipeline & Rent Cycles
- [x] Refactor `buildingLayout.js` mock data to use `rentHistory` arrays starting Jan 2026
- [x] Update `UnitDetailModal` to allow adding/editing specific rent cycles (Start Month -> End Month)
- [x] Implement global expiration alert popup for rent cycles ending soon
- [ ] Connect `google-spreadsheet` library to Google Sheets (Future)

## Phase 4: Bulk Data Operations
- [x] Remove the legacy `VerticalMap` list directory component from the application core layout
- [x] Create `BulkDataEntry.jsx` view featuring a Month/Year selector
- [x] Build spreadsheet-like Grid inputs for mass updating Rent Status, Elec, Water, and Garbage
- [x] Implement Bulk Save functionality that updates the target month on the mock `buildingData` schema
- [x] Ensure that mass updates accurately re-render and flow upwards into the Analytics Dashboard
- [x] Added Rent Collected and Rent Due tracking cards based directly on the mass update inputs.

## Phase 5: Google Sheets Integration
- [ ] User generates Google Cloud Service Account credentials
- [ ] Install `google-spreadsheet` library
- [ ] Setup `.env` configuration for API Keys
- [x] Create `GoogleSheetsService.js` mapping layer
- [x] Connect Bulk Data Entry logic back to the live sheet sync

## Phase 6: Tenant History Tracking
- [x] Fix the "Paid" vs "Unknown" default state drift bug in Bulk Entry UI
- [x] Upgrade the `buildingLayout.js` Data Model with nested `tenantHistory` lists (Name, Company, Join Date, Leave Date)
- [x] Create `HistoricalTenants.jsx` component (Table View with search/filters)
- [x] Add navigation routing and a dedicated button beside "Bulk Data" on the Home view
- [x] Upgrade the Netlify Serverless Function `sync.js` to additionally build and sync a "Tenant Directory" tab in Google Sheets

## Phase 7: Tenant Management & Onboarding
- [x] Build `TenantManagementModal.jsx` to handle adding/removing tenants
- [ ] Tie Add/Remove actions to the in-memory `buildingData` layout
- [ ] Move previous active tenants to historical (apply `leaveDate`)
- [ ] Add an action button in `HistoricalTenants.jsx` to trigger the Management Modal
- [ ] Scrub all mock data from `buildingLayout.js` so the user can begin inputting real properties and tenants

## Phase 8: Universal Cloud Architecture & System Integrity (Deprecated)
- [x] Create centralized Google Sheets Sync utility (`cloudSync.js`).
- [x] Upgrade `sync.js` to spawn and manage a third sub-sheet specifically for Master Configs (Utilities, Unit Types, Contacts).
- [x] Rip out all ephemeral local-storage API logic from `BulkDataEntry` and replace with unified Cloud Push.
- [x] Wire `UnitDetailModal` inline edits to natively invoke cloud sync, preventing data loss.
- [x] Ensure all environment variables gracefully parse without throwing 500 errors if keys are entirely missing.
- [x] Refactor all components (`Dashboard`, `RentAlert`, `BulkDataEntry`) to dynamically compute the current month instead of locking to `2026-02`.

## Phase 9: Firebase Architecture Migration
- [x] Receive `firebaseConfig` object from the user
- [x] Install `firebase` SDK and initialize `src/config/firebase.js`
- [x] Rip out Netlify Serverless Functions (`sync.js`, `fetchData.js`) and `google-spreadsheet`
- [x] Rewrite `cloudSync.js` to push and pull from Cloud Firestore collections (`buildingLayout`, `ledger`, `tenantHistory`)
- [x] Migrate `AuthGate.jsx` to natively use Firebase Authentication or unified Firestore secret key
- [x] Implement robust NoSQL data hydration loop in `App.jsx` bypassing Vite HTTP Proxies entirely

## Phase 10: Interactive Ledger Table & Export 
- [x] Install `jspdf` and `jspdf-autotable` dependencies for PDF generation
- [x] Create `LedgerTable.jsx` component representing the raw Firebase tabular output
- [x] Build a filter UI schema (Month, Status, Unit Type) mapping to the table payload
- [x] Code CSV/Excel raw text Blob export utility hook
- [x] Code PDF structured table export utility hook
- [x] Integrate `LedgerTable` into `App.jsx` UI Flow (Beneath the Map/Dashboard)

## Phase 11: Real-World Physical Architecture Mapping (Active)
- [x] Refactor `buildingLayout.js` memory schema to match the live 6-Floor layout exactly
- [x] Basement: Studio 1, Studio 2
- [x] Ground: 2RK AirBnB, 2RK Flat
- [x] First Floor: 2RK Flat, Single Room 1, Single Room 2, 3-Room Unit
- [x] Second Floor: Silver Oak BnB (Full Floor Unit)
- [x] Third Floor: Private Residence
- [x] Fourth Floor: Private Residence (Attic)
- [x] Reset all Firebase instances to prepare for a fresh Cloud Sync against reality

## Phase 12: Ground Floor Expansion & Level Shift (Completed)
- [x] Insert new Ground Floor between Basement and existing Ground Floor.
- [x] Add '1BHK' unit and 'Single Room' unit to the new slot.
- [x] Shift all floors above the Basement up by +1 level (e.g. Ground -> 1st).
- [x] Auto-increment all Unit IDs to maintain the logic (001 -> 101).
- [x] Create surgical Firebase deletion script to destroy old ghost data.
- [x] Reseed the entire Cloud Firestore Database with the correct architecture.

## Phase 13: Tenant Lifecycle & Future-Dating Engine (Active)
- [x] Upgrade the global `isOccupied` function logic to properly evaluate `leaveDate >= today()` for future-dated evictions/handovers.
- [x] Overhaul `TenantManagementModal.jsx` into three distinct modes: Add, Replace, Evict.
- [x] Implement robust date-coordination logic for "Replace" (outgoing Leave Date + incoming Join Date).
- [x] Update `cloudSync.js` to correctly determine the "Active Tenant" for the current month's Ledger based on the overlapping date boundaries.
## Phase 14: Real-World Dataset Initialization (Completed)
- [x] Integrate the user's master list of Resident Names, Electricity Meters, and Water Meters into the root layout array.
- [x] Wipe all dummy instances from the Cloud Firestore database via `wipeFirebase.js`.
- [x] Execute `forceSeed.js` to systematically construct the NoSQL tree representing the live 13-unit real-world data state.
- [x] Upgrade the native `fetch` algorithm inside `App.jsx` to dynamically pull and apply the cloud's real-world Meter IDs on app load.

## Phase 15: Zero-Hardcode & Inclusive Rent Logic (Completed)
- [x] Inject final Unit Names (e.g. 5A, 6B) and tenant Contact Numbers securely into the Cloud Firebase repository.
- [x] Ensure `App.jsx` pulls `UnitName`, `ContactNum`, and `GarbageId` straight from Firebase to eliminate all hardcoded rendering logic.
- [x] Implement "Rent Includes Water & Garbage" toggle within the Bulk Data Entry module to automatically zero and disable utility inputs for specific leases.

## Phase 16: Analytics Refinement & Historical Data Guardrails (Active)
- [ ] Refactor `BulkDataEntry.jsx` to use a per-row `includesUtilities` checkbox.
- [ ] Add a confirmation dialog in `BulkDataEntry.jsx` when saving data for a month prior to the current billing cycle.
- [ ] Refactor `Dashboard.jsx` to replace existing charts with a Water/Electricity dual-line chart tracking from Jan 2026.
- [ ] Ensure all `Dashboard.jsx` top-level KPI cards accurately react to the selected `FilterBar` context.
- [ ] Update the default local state to anchor the application ledger and dashboard analytics to Jan 2026.
