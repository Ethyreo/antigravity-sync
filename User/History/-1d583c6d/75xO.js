import { buildingData } from '../config/buildingLayout';

/**
 * Parses the entire physical state of buildingData into Google Sheets flat-rows
 * and POSTs them to the Netlify Serverless Sync API.
 */
export const pushBuildingStateToCloud = async (selectedMonth) => {
    // 1. Build the Row Payload for Google Sheets
    const payloadRows = [];
    const tenantRows = [];
    const configRows = [];

    buildingData.floors.forEach(floor => {
        floor.units.forEach(unit => {
            if (unit.isPrivate) return;

            // Sync Static Config Data
            configRows.push({
                UnitID: unit.id,
                UnitName: unit.name,
                Type: unit.type || '',
                ContactNum: unit.contact || '',
                ElectricityMeter: unit.elecUnit || '',
                WaterMeter: unit.waterConn || ''
            });

            // Sync Tenant Directory
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

            // Sync Monthly Ledger (only for the requested month)
            const draft = unit.monthlyRecords?.[selectedMonth];
            if (draft) {
                let activeTenant = 'Vacant';
                if (unit.tenantHistory && unit.tenantHistory.length > 0) {
                    const current = unit.tenantHistory.find(t => !t.leaveDate || t.leaveDate === 'Current');
                    if (current) activeTenant = current.name;
                    else activeTenant = unit.tenantHistory[unit.tenantHistory.length - 1].name;
                }

                payloadRows.push({
                    BillingMonth: selectedMonth,
                    UnitID: unit.id,
                    UnitName: unit.name,
                    TenantName: activeTenant,
                    RentStatus: draft.rentStatus || 'unpaid',
                    RentAmount: unit.rentHistory?.length > 0 ? unit.rentHistory[unit.rentHistory.length - 1].amount : 0,
                    Electricity: draft.elecBill || 0,
                    Water: draft.waterBill || 0,
                    Garbage: draft.garbageBill || 0
                });
            }
        });
    });

    // 2. Push to Netlify Serverless Function
    try {
        const res = await fetch('/.netlify/functions/sync', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ month: selectedMonth, rows: payloadRows, tenantRows, configRows })
        });

        if (res.ok) {
            return { success: true };
        } else {
            console.error("Cloud Sync failed with status:", res.status);
            return { success: false, error: "HTTP Error" };
        }
    } catch (err) {
        console.error("Critical Cloud Fetch Error:", err);
        return { success: false, error: err.message };
    }
};
