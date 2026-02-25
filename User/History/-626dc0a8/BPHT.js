import { GoogleSpreadsheet } from 'google-spreadsheet';
import { JWT } from 'google-auth-library';
import dotenv from 'dotenv';
dotenv.config();

// Simple integration test script to verify Google service account credentials and Spreadsheet ID
async function testGoogleSheetsConnection() {
    console.log("Testing Google Sheets Connection...");
    try {
        const serviceAccountAuth = new JWT({
            email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
            key: process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, '\n'),
            scopes: ['https://www.googleapis.com/auth/spreadsheets'],
        });

        const doc = new GoogleSpreadsheet(process.env.GOOGLE_SPREADSHEET_ID, serviceAccountAuth);

        console.log("Authenticating...");
        await doc.loadInfo();

        console.log(`✅ Success! Connected to Document: "${doc.title}"`);
        console.log(`Found ${doc.sheetCount} sheets.`);

        let sheet = doc.sheetsByTitle['Oak Lodge Monthly Ledger'];
        if (sheet) {
            console.log(`✅ "Oak Lodge Monthly Ledger" sheet exists.`);
            await sheet.loadHeaderRow();
            console.log(`Header columns:`, sheet.headerValues);
        } else {
            console.log(`⚠️ "Oak Lodge Monthly Ledger" does not exist yet.`);
            console.log(`Creating it now...`);
            sheet = await doc.addSheet({
                title: 'Oak Lodge Monthly Ledger',
                headerValues: ['BillingMonth', 'UnitID', 'UnitName', 'RentStatus', 'RentAmount', 'Electricity', 'Water', 'Garbage', 'TotalCollectable']
            });
            console.log(`✅ Successfully created the sheet and set up the header row.`);
        }

    } catch (error) {
        console.error("❌ Google Sheets Connection Failed:");
        console.error(error.message);
        if (error.response?.data?.error) {
            console.error("API Error Details:", error.response.data.error.message);
        }
    }
}

testGoogleSheetsConnection();
