import { buildingData } from '../config/buildingLayout';

/**
 * Parses the entire physical state of buildingData into Google Sheets flat-rows
 * and POSTs them to the Netlify Serverless Sync API.
 */
export const pushBuildingStateToCloud = async (selectedMonth) => {
    // 1. Build the Row Payload for Google Sheets
    const payloadRows = [];
    const tenantRows = [];

    buildingData.floors.forEach(floor => {
        floor.units.forEach(unit => {
            if (unit.isPrivate) return;

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
                payloadRows.push({
                    BillingMonth: selectedMonth,
                    UnitID: unit.id,
                    UnitName: unit.name,
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
            body: JSON.stringify({ month: selectedMonth, rows: payloadRows, tenantRows })
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
