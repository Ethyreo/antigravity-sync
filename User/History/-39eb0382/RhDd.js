import { initializeApp } from "firebase/app";
import { getFirestore, collection, getDocs, deleteDoc, doc } from "firebase/firestore";
import fs from "fs";

try {
    const content = fs.readFileSync('./src/config/firebase.js', 'utf8');
    const apiKey = content.match(/apiKey:\s*"(.*?)"/)[1];
    const authDomain = content.match(/authDomain:\s*"(.*?)"/)[1];
    const projectId = content.match(/projectId:\s*"(.*?)"/)[1];
    const storageBucket = content.match(/storageBucket:\s*"(.*?)"/)[1];
    const messagingSenderId = content.match(/messagingSenderId:\s*"(.*?)"/)[1];
    const appId = content.match(/appId:\s*"(.*?)"/)[1];

    const app = initializeApp({ apiKey, authDomain, projectId, storageBucket, messagingSenderId, appId });
    const db = getFirestore(app);

    async function checkTenants() {
        console.log("Fetching Tenants collection...");
        const snap = await getDocs(collection(db, "Tenants"));
        const data = [];
        snap.forEach(d => data.push({ _id: d.id, ...d.data() }));

        // Group by UnitID to find duplicates
        const byUnit = {};
        data.forEach(t => {
            const key = `${t.UnitID}_${t.TenantName}`;
            if (!byUnit[key]) byUnit[key] = [];
            byUnit[key].push(t);
        });

        // Show duplicates
        let rogueCount = 0;
        Object.entries(byUnit).forEach(([key, entries]) => {
            if (entries.length > 1) {
                console.log(`\nDUPLICATE: ${key} (${entries.length} entries)`);
                entries.forEach(e => console.log(`  ID: "${e._id}" | trailing space: ${e._id.endsWith(' ')}`));
                rogueCount += entries.filter(e => e._id.endsWith(' ')).length;
            }
        });

        // Also check for any docs with trailing spaces
        const rogues = data.filter(d => d._id.endsWith(' '));
        console.log(`\nTotal docs: ${data.length}`);
        console.log(`Rogue docs (trailing space): ${rogues.length}`);

        // Delete rogue docs
        if (rogues.length > 0) {
            console.log("\nDeleting rogue tenant docs...");
            await Promise.all(rogues.map(r => deleteDoc(doc(db, "Tenants", r._id))));
            console.log(`Deleted ${rogues.length} rogue tenant documents.`);
        }

        // Also check Units collection
        console.log("\n--- Checking Units collection ---");
        const unitsSnap = await getDocs(collection(db, "Units"));
        const unitRogues = [];
        unitsSnap.forEach(d => {
            if (d.id.endsWith(' ')) unitRogues.push(d.id);
        });
        console.log(`Units with trailing space: ${unitRogues.length}`);
        if (unitRogues.length > 0) {
            await Promise.all(unitRogues.map(id => deleteDoc(doc(db, "Units", id))));
            console.log(`Deleted ${unitRogues.length} rogue unit documents.`);
        }

        process.exit(0);
    }

    checkTenants();
} catch (e) {
    console.error("Error:", e);
}
