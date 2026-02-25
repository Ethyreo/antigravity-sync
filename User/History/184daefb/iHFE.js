import { GoogleSpreadsheet } from 'google-spreadsheet';
import { JWT } from 'google-auth-library';
import dotenv from 'dotenv';
dotenv.config();

async function testHistoricalDataPreservation() {
    console.log("=== Testing Multi-Month Data Architecture ===\n");

    try {
        const auth = new JWT({
            email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
            key: process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, '\n'),
            scopes: ['https://www.googleapis.com/auth/spreadsheets'],
        });

        const doc = new GoogleSpreadsheet(process.env.GOOGLE_SPREADSHEET_ID, auth);
        await doc.loadInfo();

        let sheet = doc.sheetsByTitle['Oak Lodge Monthly Ledger'];
        if (!sheet) {
            sheet = await doc.addSheet({
                title: 'Oak Lodge Monthly Ledger',
                headerValues: ['BillingMonth', 'UnitID', 'UnitName', 'RentStatus', 'RentAmount', 'Electricity', 'Water', 'Garbage', 'TotalCollectable']
            });
        }

        // --- 1. First, let's push data for JANUARY 2026 ---
        console.log("1. Simulating saving data for January 2026...");
        const janPayload = [
            { BillingMonth: "2026-01", UnitID: "F1-01", UnitName: "Unit 101", RentStatus: "paid", RentAmount: 15000, Electricity: 500, Water: 200, Garbage: 100, TotalCollectable: 15800 },
            { BillingMonth: "2026-01", UnitID: "F1-02", UnitName: "Unit 102", RentStatus: "paid", RentAmount: 12000, Electricity: 450, Water: 200, Garbage: 100, TotalCollectable: 12750 }
        ];

        // Using our exact backend logic logic: Delete existing Jan rows, then append new Jan rows
        let rows = await sheet.getRows();
        res = rows.filter(r => r.get('BillingMonth') === "2026-01");
        for (const r of res) await r.delete();
        await sheet.addRows(janPayload);
        console.log("   ✅ January data saved.");

        // --- 2. Now, push data for FEBRUARY 2026 ---
        console.log("\n2. Fast forward one month. Simulating saving data for February 2026...");
        const febPayload = [
            { BillingMonth: "2026-02", UnitID: "F1-01", UnitName: "Unit 101", RentStatus: "unpaid", RentAmount: 15000, Electricity: 600, Water: 200, Garbage: 100, TotalCollectable: 15900 },
            { BillingMonth: "2026-02", UnitID: "F1-02", UnitName: "Unit 102", RentStatus: "paid", RentAmount: 12000, Electricity: 400, Water: 200, Garbage: 100, TotalCollectable: 12700 }
        ];

        rows = await sheet.getRows();
        let febToDel = rows.filter(r => r.get('BillingMonth') === "2026-02");
        for (const r of febToDel) await r.delete();
        await sheet.addRows(febPayload);
        console.log("   ✅ February data saved.");

        // --- 3. Verify the final Sheet State ---
        console.log("\n3. Verifying Final Database State:");
        rows = await sheet.getRows();

        const janCount = rows.filter(r => r.get('BillingMonth') === "2026-01").length;
        const febCount = rows.filter(r => r.get('BillingMonth') === "2026-02").length;

        console.log(`   - Found ${janCount} rows for January 2026.`);
        console.log(`   - Found ${febCount} rows for February 2026.`);
        console.log(`   - Total rows in Database: ${rows.length}`);

        if (janCount === 2 && febCount === 2 && rows.length >= 4) {
            console.log("\n✅ ARCHITECTURE VALIDATED: Overwriting February data successfully preserved January's historical analytics!");
        } else {
            console.error("\n❌ ARCHITECTURE FAILED: Historical data was corrupted or lost.");
        }

    } catch (error) {
        console.error("Test Failed:", error.message);
    }
}

testHistoricalDataPreservation();
