import { GoogleSpreadsheet } from 'google-spreadsheet';
import { JWT } from 'google-auth-library';

export const handler = async (event, context) => {
    // Only allow POST requests for the data submission
    if (event.httpMethod !== 'POST') {
        return { statusCode: 405, body: 'Method Not Allowed' };
    }

    try {
        const payload = JSON.parse(event.body);
        const { month, rows: payloadRows, tenantRows } = payload;

        // Initialize Google Service Account Auth
        // Natively pulls from Netlify Environment Variables at runtime
        const privateKey = process.env.GOOGLE_PRIVATE_KEY;
        if (!privateKey) throw new Error("Missing GOOGLE_PRIVATE_KEY environment variable.");

        const serviceAccountAuth = new JWT({
            email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
            key: privateKey.replace(/\\n/g, '\n'),
            scopes: ['https://www.googleapis.com/auth/spreadsheets'],
        });

        const doc = new GoogleSpreadsheet(process.env.GOOGLE_SPREADSHEET_ID, serviceAccountAuth);
        await doc.loadInfo();

        console.log(`[Netlify Serverless] Connected to Google Sheet: ${doc.title}`);

        let sheet = doc.sheetsByTitle['Oak Lodge Monthly Ledger'];
        if (!sheet) {
            sheet = await doc.addSheet({
                title: 'Oak Lodge Monthly Ledger',
                headerValues: ['BillingMonth', 'UnitID', 'UnitName', 'RentStatus', 'RentAmount', 'Electricity', 'Water', 'Garbage', 'TotalCollectable']
            });
        }

        const existingRows = await sheet.getRows();
        const rowsToDelete = existingRows.filter(r => r.get('BillingMonth') === month);

        for (const row of rowsToDelete) {
            await row.delete();
        }

        await sheet.addRows(payloadRows);

        // --- 2. Synchronize Tenant Directory ---
        if (tenantRows && tenantRows.length > 0) {
            console.log(`[Netlify Serverless] Syncing Tenant Directory (${tenantRows.length} tenants)...`);
            let tenantSheet = doc.sheetsByTitle['Oak Lodge Tenant Directory'];
            if (!tenantSheet) {
                tenantSheet = await doc.addSheet({
                    title: 'Oak Lodge Tenant Directory',
                    headerValues: ['UnitID', 'UnitName', 'TenantName', 'Company', 'JoinDate', 'LeaveDate']
                });
            }
            // For the global tenant directory, it's safest to rewrite the entire sheet to capture all historical amendments
            await tenantSheet.clearRows();
            await tenantSheet.addRows(tenantRows);
        }

        return {
            statusCode: 200,
            body: JSON.stringify({ success: true, message: `Successfully synchronized ${payloadRows.length} units for ${month}` })
        };
    } catch (error) {
        console.error("[Netlify Serverless Error]:", error);
        return {
            statusCode: 500,
            body: JSON.stringify({ success: false, error: "Failed to sync with Google Sheets via Netlify Backend" })
        };
    }
};
