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

## Phase 8: Universal Cloud Architecture & System Integrity
- [x] Create centralized Google Sheets Sync utility (`cloudSync.js`).
- [x] Upgrade `sync.js` to spawn and manage a third sub-sheet specifically for Master Configs (Utilities, Unit Types, Contacts).
- [x] Rip out all ephemeral local-storage API logic from `BulkDataEntry` and replace with unified Cloud Push.
- [x] Wire `UnitDetailModal` inline edits to natively invoke cloud sync, preventing data loss.
- [x] Ensure all environment variables gracefully parse without throwing 500 errors if keys are entirely missing.
- [x] Refactor all components (`Dashboard`, `RentAlert`, `BulkDataEntry`) to dynamically compute the current month instead of locking to `2026-02`.
