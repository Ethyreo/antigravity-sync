# Shimla Futuristic Property Management PWA Implementation Plan

## Goal Description
Build a secure, private, minimalist property management dashboard for the Shimla Building. The app currently features a vertical list of floors and their respective units, with an aesthetically pleasing "Apple-style" futuristic minimalist design.

This phase extends the application with:
1. An interactive, visual block-style Building Map at the top of the interface.
2. A Data Dashboard with animated graphs (Recharts), financial summaries, and real-time filtering (by Floor, Unit, Electricity #, Water #).

## Proposed Changes

### Configuration & Data Mocking
#### [NEW] `src/config/buildingLayout.js`
Create a centralized configuration file that models the building's architecture and provides mock data for all the 9 tracking points per unit to use during UI development mock mode.

### Visual & UI System
#### [MODIFY] `src/index.css`
Establish the base styles:
- Background: `#F8FAFC`.
- High-contrast typography with high letter spacing.
- Import standard fonts like Inter or Outfit.

#### [NEW] `src/components/ui/`
Create reusable UI building blocks using Tailwind CSS:
- **Card**: Pure white, 1px border (`border-slate-200`), soft shadow (`shadow-sm`, `shadow-md` on hover).
- **Typography components**: Specific styling for names, overdue statuses, etc.

### Core Application Views
#### [NEW] `src/App.jsx`
Will be the main router and layout shell.
#### [NEW] `src/components/AuthGate.jsx`
A PIN-code splash screen to gateaccess to the `VerticalMap`.
#### [NEW] `src/components/VerticalMap.jsx` (Deprecated)
The main screen rendering floors iteratively from a layout configuration. Removed in Phase 4 to streamline the UI.
#### [NEW] `src/components/BuildingVisualMap.jsx`
A visual, CSS-grid based interactive block map of the building. Hovering or clicking blocks will trigger the same `UnitDetailModal`.
#### [NEW] `src/components/Dashboard.jsx`
A unified metrics view rendering top-level sums (Monthly Rent, Annual Run Rate, Total Bills). Uses `recharts` for animated, sleek line/bar graphs. Includes a Filter component.
#### [NEW] `src/components/MetricCard.jsx`
A reusable component for the Dashboard digits.
#### [NEW] `src/components/FloorSection.jsx`
Renders a specifically styled block for a floor.
#### [NEW] `src/components/UnitCard.jsx`
The bento-box style card displaying high-level unit information (Name, Overdue status highlight).
#### [NEW] `src/components/UnitDetailModal.jsx`
A slide-up bottom sheet or modal (for one-handed mobile use) containing the 9 tracking points, with fluid `framer-motion` transitions.

### Security
#### [NEW] `public/robots.txt`
Disallow all general crawlers for privacy.
#### [NEW] `.env.example`
A template outlining what environment variables will be needed when we integrate the Google Sheets API.

### Phase 6: Tenant History Tracking (Active)
- **Extending the Schema:** Expand each unit object in `buildingLayout` to contain an array of `tenantHistory` objects (mapping name, details, and exact tenure).
- **Dedicated View Component:** A full-bleed tabular application (`HistoricalTenants.jsx`) specifically designed to quickly parse strings (names, companies) over integers (rent).
- **Multi-Sheet Syncing:** The `sync.js` google sheet hook must gracefully expand to manage multiple parallel sub-sheets (Monthly Ledger vs Tenant List).

### Phase 7: Tenant Management & Onboarding (Active)
- **Tenant Modals:** Create a `TenantManagementModal` UI allowing the user to select a Unit and either 1) Add a new Tenant or 2) Remove the current Tenant.
- **Historical Logic:** When a new tenant is added or an active tenant removed, the systemic `buildingLayout` must close the loop on the old tenant by attaching today's timestamp to their `leaveDate`, and appending the new tenant with a `joinDate`.
- **Data Scrubbing:** Eliminate all the fake mock tenants from `buildingLayout.js` while keeping the structural hierarchy of the building (floors/units), paving the way for real data entry.

## Data Layer & Rent Cycles (Phase 3)
We are preparing the data pipeline for a future Google Sheets database backend starting from Jan 2026.

### Data Model Changes
- **Rent Cycles**: Instead of a static `rent` string, the data model will use a `rentHistory` array.
- Support specifying rent from `X month` to `Y month`.
- `currentRent` will be dynamically calculated based on the current date falling within a cycle.

### Expiration Alerts
- Implement a global check that flags rent cycles ending within 1 month.
- Show a popup alert/notification prompting the user to update the rent cycle.

### Google Sheets Pipeline Preparation
- Structure the local data mock to precisely match how rows and columns will be formatted in Sheets.

## Bulk Collection Operations (Phase 4)
We are replacing the static vertical directory list with a powerful bulk data entry pipeline optimized for speed at the end of every month.

### Bulk Data View Features
- **Month/Year Selector:** A global control for the specific billing month the user is currently processing.
- **Data Entry Grid:** A fast spreadsheet-like UI showing every specific unit that allows for rapid typing into the following fields simultaneously:
    - `Rent Status` (Paid/Unpaid dropdown)
    - `Rent Amount` (Auto-filled based on the dynamic rent cycle logic, but editable)
    - `Electricity Bill` (Input)
    - `Water Bill` (Input)
    - `Garbage Bill` (Input)
- **Mass Submit:** Pushes the entire updated object structure into the mock configuration (simulating what the Google Sheets pipeline will receive under one API call).

## Verification Plan

### Automated Tests
- Build verification using `npm run build` to ensure the app compiles properly.

### Manual Verification
- Review the aesthetic against the user's specification (Minimalist, Bento-box, Apple-style, white cards on soft background).
- Verify animations and transitions for the detail modal.
- Verify that testing the PIN code auth protects the data.
- Ensure that the console doesn't log any phone numbers by manually inspecting the Developer Tools during navigation.
