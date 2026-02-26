import * as dotenv from 'dotenv';
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, doc, setDoc } from 'firebase/firestore';
import { buildingData } from '../src/config/buildingLayout.js';

// Load .env variables (which are prefixed with VITE_)
dotenv.config();

const firebaseConfig = {
    apiKey: process.env.VITE_FIREBASE_API_KEY,
    authDomain: process.env.VITE_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.VITE_FIREBASE_PROJECT_ID,
    storageBucket: process.env.VITE_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.VITE_FIREBASE_APP_ID
};

console.log("Initializing Firebase Admin-level Seeder...");
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const selectedMonth = "2026-02"; // Our current tracking month

async function executeSeed() {
    try {
        console.log(`Mapping Building Layout to Firestore Collections (Month: ${selectedMonth})...`);
        const promises = [];

        buildingData.floors.forEach(floor => {
            floor.units.forEach(unit => {
                if (unit.isPrivate) return; // Skip private units if needed, or include them based on logic

                // 1. Sync Static Config Data -> Units Collection
                promises.push(setDoc(doc(db, "Units", unit.id), {
                    UnitID: unit.id,
                    UnitName: unit.name,
                    Type: unit.type || '',
                    ContactNum: unit.contact || '',
                    ElectricityMeter: unit.elecUnit || '',
                    WaterMeter: unit.waterConn || ''
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
                let activeTenant = 'Vacant';
                if (unit.tenantHistory && unit.tenantHistory.length > 0) {
                    const current = unit.tenantHistory.find(t => !t.leaveDate || t.leaveDate === 'Current');
                    if (current) activeTenant = current.name;
                    else activeTenant = unit.tenantHistory[unit.tenantHistory.length - 1].name;
                }

                const ledgerId = `${selectedMonth}_${unit.id}`;
                promises.push(setDoc(doc(db, "Ledger", ledgerId), {
                    BillingMonth: selectedMonth,
                    UnitID: unit.id,
                    UnitName: unit.name,
                    TenantName: activeTenant,
                    RentStatus: 'unpaid',
                    RentAmount: unit.rentHistory?.length > 0 ? unit.rentHistory[unit.rentHistory.length - 1].amount : 0,
                    Electricity: 0,
                    Water: 0,
                    Garbage: 0
                }));
            });
        });

        // Execute all writes massively in parallel
        await Promise.all(promises);
        console.log("✅ Successfully mapped entire physical architecture to Firebase NoSQL!");
        process.exit(0);
    } catch (err) {
        console.error("❌ Critical Firebase Seeding Error:", err);
        process.exit(1);
    }
}

executeSeed();
