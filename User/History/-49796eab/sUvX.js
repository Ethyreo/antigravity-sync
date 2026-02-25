import { pushBuildingStateToCloud } from '../src/utils/cloudSync.js';

console.log("Preparing to seed Firebase Firestore with local building topology...");

// The selected month must match the current mock environment (e.g. 2026-02)
const selectedMonth = "2026-02";

pushBuildingStateToCloud(selectedMonth)
    .then(res => {
        if (res.success) {
            console.log("✅ Successfully generated NoSQL collections (Units, Tenants, Ledger) in Firebase!");
            process.exit(0);
        } else {
            console.error("❌ Firebase Seeding Failed:", res.error);
            process.exit(1);
        }
    })
    .catch(err => {
        console.error("Critical Execution Error:", err);
        process.exit(1);
    });
