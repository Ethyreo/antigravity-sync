import { buildingData } from '../config/buildingLayout';
import { db } from '../config/firebase';
import { collection, doc, setDoc, getDocs } from 'firebase/firestore';
import { getActiveTenant } from './tenantLogic';

/**
 * Pushes the current local memory state to Firebase Cloud Firestore.
 * Breaks down the data into scalable NoSQL collections: Units, Tenants, Ledger.
 */
export const pushBuildingStateToCloud = async (selectedMonth) => {
    try {
        const promises = [];

        buildingData.floors.forEach(floor => {
            floor.units.forEach(unit => {
                if (unit.isPrivate) return;

                // 1. Sync Static Config Data -> Units Collection
                promises.push(setDoc(doc(db, "Units", unit.id), {
                    UnitID: unit.id,
                    UnitName: unit.name,
                    Type: unit.type || '',
                    ContactNum: unit.contact || '',
                    ElectricityMeter: unit.elecUnit || '',
                    WaterMeter: unit.waterConn || '',
                    GarbageId: unit.garbageId || ''
                }));

                // 2. Sync Tenant Directory -> Tenants Collection
                if (unit.tenantHistory && unit.tenantHistory.length > 0) {
                    unit.tenantHistory.forEach(tenant => {
                        const tId = `${unit.id}_${tenant.name.replace(/\s+/g, '_')}`;
                        promises.push(setDoc(doc(db, "Tenants", tId), {
                            UnitID: unit.id,
                            UnitName: unit.name,
                            TenantName: tenant.name,
                            Company: tenant.company || '',
                            JoinDate: tenant.joinDate,
                            LeaveDate: tenant.leaveDate || 'Current'
                        }));
                    });
                }

                // 3. Sync Monthly Ledger -> Ledger Collection
                const draft = unit.monthlyRecords?.[selectedMonth];
                if (draft) {
                    let activeTenantName = 'Vacant';
                    const activeT = getActiveTenant(unit.tenantHistory);

                    if (activeT) {
                        activeTenantName = activeT.name;
                    } else if (unit.tenantHistory && unit.tenantHistory.length > 0) {
                        // Fallback to the very last person who lived there if strictly vacant
                        activeTenantName = unit.tenantHistory[unit.tenantHistory.length - 1].name;
                    }

                    const ledgerId = `${selectedMonth}_${unit.id}`;
                    promises.push(setDoc(doc(db, "Ledger", ledgerId), {
                        BillingMonth: selectedMonth,
                        UnitID: unit.id,
                        UnitName: unit.name,
                        TenantName: activeTenantName,
                        RentStatus: draft.rentStatus || 'unpaid',
                        RentAmount: unit.rentHistory?.length > 0 ? unit.rentHistory[unit.rentHistory.length - 1].amount : 0,
                        Electricity: draft.elecBill || 0,
                        Water: draft.waterBill || 0,
                        Garbage: draft.garbageBill || 0
                    }));
                }
            });
        });

        // Execute all writes massively in parallel
        await Promise.all(promises);
        return { success: true };
    } catch (err) {
        console.error("Critical Cloud Push Error:", err);
        return { success: false, error: err.message };
    }
};

/**
 * Native Firebase query to pull the Ledger, Tenants, and Units down to the client.
 */
export const fetchBuildingStateFromCloud = async () => {
    try {
        const unitsSnap = await getDocs(collection(db, "Units"));
        const ledgerSnap = await getDocs(collection(db, "Ledger"));
        const tenantsSnap = await getDocs(collection(db, "Tenants"));

        const units = [];
        unitsSnap.forEach(doc => units.push(doc.data()));

        const ledger = [];
        ledgerSnap.forEach(doc => ledger.push(doc.data()));

        const tenants = [];
        tenantsSnap.forEach(doc => tenants.push(doc.data()));

        return { success: true, units, ledger, tenants };
    } catch (err) {
        console.error("Critical Cloud Fetch Error:", err);
        return { success: false, error: err.message };
    }
};
