# Oak Lodge Property Management PWA

A secure, offline-capable Progressive Web Application designed for minimalist, high-speed property management. Built initially for "Shimla Building" and rebranded to "Oak Lodge."

## 🏗 Architecture & Stack
This project employs a modern, lightweight frontend with a serverless backend for absolute zero-cost deployment at scale.

*   **Frontend Framework:** React 19 + Vite
*   **Styling:** Tailwind CSS v4 + minimal custom CSS (`index.css`)
*   **Animations:** Framer Motion (Optimized for mobile-first fluid gestures)
*   **Data Visualization:** Recharts
*   **Icons:** Lucide React
*   **Backend / API Strategy:** Netlify Serverless Functions (AWS Lambda)
*   **Database:** Google Sheets API (via `google-spreadsheet` and `google-auth-library`)

---

## 🚀 Key Features

### 1. The Dashboard & Analytics Matrix
A highly visual, Recharts-powered dashboard that calculate real business logic on the fly:
*   **Expected Monthly Rent:** Calculates total rent due based on active rent cycle blocks.
*   **Rent Collected vs Due:** Instantly updates based on Paid vs Unpaid statuses in the ledger.
*   **Floor Breakdown:** A dual-axis Bar Chart comparing Revenue generation vs Electricity consumption per floor.
*   **Omni-Filter:** A global query system that filters *both* the Dashboard analytics and the Building Visual Map simultaneously by Floor, Unit Name, or Water/Electricity connection IDs.

### 2. The Interactive Building Map
Replaced an older vertical list with a responsive, CSS-grid driven 2D block map. Each block represents a physical unit.
*   **Status Indicators:** Units dynamically glow amber or red based on "Unpaid" or "Overdue" statuses to draw manager attention instantly.
*   **Unit Detail Modal:** Clicking a unit opens a Framer-Motion powered bottom-sheet containing all 9 tracking points (Contact, Rent, Status, Utilities). This modal is heavily optimized for one-handed mobile usage.

### 3. Dynamic Rent Cycles & Alerts
Rent is no longer a static integer. It operates on a `rentHistory` timeseries.
*   **Cycle Editing:** Users can set a Start Month and End Month for a specific rent amount.
*   **Global Expiration Alerts:** An automated engine warns the manager via a highly visible Dashboard banner if *any* unit's rent cycle is expiring within exactly 1 month, prompting immediate renegotiation.

### 4. The Bulk Data "Spreadsheet" Entry
To replace the tedious process of clicking into 20+ individual units at the end of every month, we built a dedicated `/bulk` routing view.
*   **Mass Operations:** A spreadsheet-like grid where managers can set the Billing Month, and rapidly type the Electricity, Water, Trash, and Rent Status for every unit on a single screen.
*   **Instant Calculation:** Features a real-time `Total Collectable` column summing all inputs.
*   **Global Sync:** The "Save All" button validates the entire grid and ships it to the unified backend.

---

## 🔒 Security & Deployment

The app uses a 2-tier security model:
1.  **Frontend Auth Gate:** A PIN-code splash screen prevents unauthorized access to the UI. `robots.txt` is configured to disallow web crawlers.
2.  **Backend Key Isolation:** Google Cloud Service Account private keys are **never** bundled into the React code. They are completely isolated inside a Netlify Serverless Function (`/netlify/functions/sync.js`), which acts as a secure proxy bridge between the public-facing React app and the private Google Sheet.

### How to Run Locally

You need two terminal windows to run both the Vite frontend and the Netlify Serverless backend concurrently:

1.  **Install dependencies:**
    ```bash
    npm install
    ```
2.  **Set up Environmental Variables:**
    Create a `.env` file in the root directory and add your Google Cloud credentials. **NEVER COMMIT THIS FILE TO GITHUB.**
    ```env
    GOOGLE_SERVICE_ACCOUNT_EMAIL="your-bot@your-project.iam.gserviceaccount.com"
    GOOGLE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nMIIEvgI...\n-----END PRIVATE KEY-----\n"
    GOOGLE_SPREADSHEET_ID="your-long-spreadsheet-id"
    ```
3.  **Launch the full stack:**
    ```bash
    npm run dev
    ```
    *(This runs `netlify dev` under the hood, compiling the proxy and launching the UI on `http://localhost:8888`)*

### How to Deploy to Production

This app is tailor-made for Netlify.
1.  Push this exact repository to your GitHub account (The API keys will be stripped thanks to `.gitignore`).
2.  Log into Netlify and select "Import from GitHub".
3.  In the Netlify Deploy settings, under **Environment Variables**, paste the exact 3 variables listed above (`GOOGLE_SERVICE_ACCOUNT_EMAIL`, `GOOGLE_PRIVATE_KEY`, `GOOGLE_SPREADSHEET_ID`).
4.  Click **Deploy**. Netlify will natively compile the `sync.js` function and the Vite frontend, creating a completely free, infinitely scalable connection to your Google Sheet!
