import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { GoogleSpreadsheet } from 'google-spreadsheet';
import { JWT } from 'google-auth-library';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Initialize Google Service Account Auth
// This reads from the local secure .env file that is NEVER sent to the browser
const serviceAccountAuth = new JWT({
    email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
    key: process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, '\n'),
    scopes: ['https://www.googleapis.com/auth/spreadsheets'],
});

const doc = new GoogleSpreadsheet(process.env.GOOGLE_SPREADSHEET_ID, serviceAccountAuth);

app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', message: 'Backend is running' });
});

// The sync endpoint that connects our Bulk Data Entry grid to Google Sheets
app.post('/api/sync', async (req, res) => {
    try {
        await doc.loadInfo();
        console.log(`[Google Sheets] Connected to Document: ${doc.title}`);

        // Auto-create the "Oak Lodge Monthly Ledger" sheet if it does not exist today
        let sheet = doc.sheetsByTitle['Oak Lodge Monthly Ledger'];
        if (!sheet) {
            console.log("[Google Sheets] Creating new Oak Lodge Ledger sheet...");
            sheet = await doc.addSheet({
                title: 'Oak Lodge Monthly Ledger',
                headerValues: ['BillingMonth', 'UnitID', 'UnitName', 'RentStatus', 'RentAmount', 'Electricity', 'Water', 'Garbage', 'TotalCollectable']
            });
        }

        const { month, rows: payloadRows } = req.body;

        // For this PWA workflow, the easiest, fastest, and most API quota friendly (Free) way 
        // to handle arbitrary Grid submissions is to clear existing entries for this month, and bulk insert.

        const existingRows = await sheet.getRows();

        // Find rows matching this month
        const rowsToDelete = existingRows.filter(r => r.get('BillingMonth') === month);

        if (rowsToDelete.length > 0) {
            console.log(`[Google Sheets] Removing ${rowsToDelete.length} stale rows for ${month}...`);
            // In a production app with thousands of rows, you would batch this.
            // Since a building has < 50 units, deleting sequentially is perfectly fast.
            for (const row of rowsToDelete) {
                await row.delete();
            }
        }

        // Now bulk append the fresh data grid straight from the UI!
        console.log(`[Google Sheets] Saving ${payloadRows.length} units for ${month}...`);
        await sheet.addRows(payloadRows);

        res.json({ success: true, message: `Successfully synchronized ${payloadRows.length} units for ${month}` });
    } catch (error) {
        console.error("[Google Sheets API Error]:", error);
        res.status(500).json({ success: false, error: "Failed to sync with Google Sheets Backend" });
    }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`\n=======================================================`);
    console.log(`🛡️  Oak Lodge Secure Backend running on port ${PORT}`);
    console.log(`=======================================================\n`);
});
