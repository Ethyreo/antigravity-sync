import 'dotenv/config';
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
            // Find current tenant
            let activeTenant = 'Vacant';
            if (unit.tenantHistory && unit.tenantHistory.length > 0) {
                // In our mock logic, the last added tenant without a leaveDate is current
                const current = unit.tenantHistory.find(t => !t.leaveDate || t.leaveDate === 'Current');
                if (current) activeTenant = current.name;
                else activeTenant = unit.tenantHistory[unit.tenantHistory.length - 1].name;
            }

            payloadRows.push({
                BillingMonth: selectedMonth,
                UnitID: unit.id,
                UnitName: unit.name,
                TenantName: activeTenant,
                RentStatus: 'unpaid',
                RentAmount: unit.rentHistory?.length > 0 ? unit.rentHistory[0].amount : 0,
                Electricity: 0,
                Water: 0,
                Garbage: 0
            });
        });
    });

    console.log(`Sending ${configRows.length} configurations, ${tenantRows.length} tenants, and ${payloadRows.length} ledger rows to Local Handler...`);

    // Dynamically import the handler to bypass HTTP network binding
    const { handler } = await import('../netlify/functions/sync.js');

    try {
        const mockEvent = {
            httpMethod: 'POST',
            body: JSON.stringify({ month: selectedMonth, rows: payloadRows, tenantRows, configRows })
        };

        const res = await handler(mockEvent);

        if (res.statusCode === 200) {
            console.log("✅ Database Seeded Successfully! Google Sheets now has all required tabs.");
            console.log(JSON.parse(res.body));
        } else {
            console.error("❌ Sync Failed", res);
        }
    } catch (err) {
        console.error("❌ Execution Error", err);
    }
};

seedDatabase();
