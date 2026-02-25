import { GoogleSpreadsheet } from 'google-spreadsheet';
import { JWT } from 'google-auth-library';

export const handler = async (event, context) => {
    // Only allow GET requests for querying the entire database payload
    if (event.httpMethod !== 'GET') {
        return { statusCode: 405, body: 'Method Not Allowed' };
    }

    try {
        const privateKey = process.env.GOOGLE_PRIVATE_KEY;
        if (!privateKey) throw new Error("Missing GOOGLE_PRIVATE_KEY environment variable.");

        const serviceAccountAuth = new JWT({
            email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
            key: privateKey.replace(/\\n/g, '\n'),
            scopes: ['https://www.googleapis.com/auth/spreadsheets'],
        });

        const doc = new GoogleSpreadsheet(process.env.GOOGLE_SPREADSHEET_ID, serviceAccountAuth);
        await doc.loadInfo();

        const dataResponse = {
            ledger: [],
            tenants: []
        };

        // 1. Fetch the Monthly Ledger (Rent & Bills)
        const ledgerSheet = doc.sheetsByTitle['Oak Lodge Monthly Ledger'];
        if (ledgerSheet) {
            const rows = await ledgerSheet.getRows();
            dataResponse.ledger = rows.map(r => ({
                BillingMonth: r.get('BillingMonth'),
                UnitID: r.get('UnitID'),
                UnitName: r.get('UnitName'),
                RentStatus: r.get('RentStatus'),
                RentAmount: Number(r.get('RentAmount')),
                Electricity: Number(r.get('Electricity')),
                Water: Number(r.get('Water')),
                Garbage: Number(r.get('Garbage')),
                TotalCollectable: Number(r.get('TotalCollectable'))
            }));
        }

        // 2. Fetch the Tenant History Profiles
        const tenantSheet = doc.sheetsByTitle['Oak Lodge Tenant Directory'];
        if (tenantSheet) {
            const rows = await tenantSheet.getRows();
            dataResponse.tenants = rows.map(r => ({
                UnitID: r.get('UnitID'),
                UnitName: r.get('UnitName'),
                TenantName: r.get('TenantName'),
                Company: r.get('Company'),
                JoinDate: r.get('JoinDate'),
                LeaveDate: r.get('LeaveDate'),
                CurrentRent: Number(r.get('CurrentRent')) || 0 // Included if available backwards-compat
            }));
        }

        return {
            statusCode: 200,
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(dataResponse)
        };

    } catch (error) {
        console.error("[Netlify Fetch Error]:", error);
        return {
            statusCode: 500,
            body: JSON.stringify({ success: false, error: "Failed to fetch building data from Google Sheets API" })
        };
    }
};
