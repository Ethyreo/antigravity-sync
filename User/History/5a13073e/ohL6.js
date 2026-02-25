import { buildingData } from '../src/config/buildingLayout.js';

const seedDatabase = async () => {
    const selectedMonth = "2026-02"; // Arbitrary snapshot month for the seed
    const payloadRows = [];
    const tenantRows = [];
    const configRows = [];

    console.log("Extracting local Building Data into JSON Flat Maps...");

    buildingData.floors.forEach(floor => {
        floor.units.forEach(unit => {
            if (unit.isPrivate) return;

            // 1. Configs
            configRows.push({
                UnitID: unit.id,
                UnitName: unit.name,
                Type: unit.type || '',
                ContactNum: unit.contact || '',
                ElectricityMeter: unit.elecUnit || '',
                WaterMeter: unit.waterConn || ''
            });

            // 2. Tenants
            if (unit.tenantHistory && unit.tenantHistory.length > 0) {
                unit.tenantHistory.forEach(tenant => {
                    tenantRows.push({
                        UnitID: unit.id,
                        UnitName: unit.name,
                        TenantName: tenant.name,
                        Company: tenant.company || '',
                        JoinDate: tenant.joinDate,
                        LeaveDate: tenant.leaveDate || 'Current'
                    });
                });
            }

            // 3. Ledger
            payloadRows.push({
                BillingMonth: selectedMonth,
                UnitID: unit.id,
                UnitName: unit.name,
                RentStatus: 'unpaid',
                RentAmount: unit.rentHistory?.length > 0 ? unit.rentHistory[0].amount : 0,
                Electricity: 0,
                Water: 0,
                Garbage: 0
            });
        });
    });

    console.log(`Sending ${configRows.length} configurations, ${tenantRows.length} tenants, and ${payloadRows.length} ledger rows to local Netlify Sync Endpoint...`);

    try {
        const res = await fetch('http://localhost:8888/.netlify/functions/sync', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ month: selectedMonth, rows: payloadRows, tenantRows, configRows })
        });

        const json = await res.json();
        console.log("Server Response:", res.status, json);
        if (res.ok) {
            console.log("✅ Database Seeded Successfully! Google Sheets now has all required tabs.");
        } else {
            console.error("❌ Sync Failed", json);
        }
    } catch (err) {
        console.error("❌ Network Error targeting localhost:8888. Ensure 'npm run dev' is running.", err);
    }
};

seedDatabase();
