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
- [ ] Remove the legacy `VerticalMap` list directory component from the application core layout
- [ ] Create `BulkDataEntry.jsx` view featuring a Month/Year selector
- [ ] Build spreadsheet-like Grid inputs for mass updating Rent Status, Elec, Water, and Garbage
- [ ] Implement Bulk Save functionality that updates the target month on the mock `buildingData` schema
- [ ] Ensure that mass updates accurately re-render and flow upwards into the Analytics Dashboard
