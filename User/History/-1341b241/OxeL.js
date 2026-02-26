import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs, deleteDoc } from 'firebase/firestore';

const firebaseConfig = {
    apiKey: "AIzaSyDVvyHLg2qPDb4jLb6fyINjXMGwLaizNFk",
    authDomain: "shimla-building-app.firebaseapp.com",
    projectId: "shimla-building-app",
    storageBucket: "shimla-building-app.firebasestorage.app",
    messagingSenderId: "616524927374",
    appId: "1:616524927374:web:b91221ce849a40291a14df"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function wipeDatabase() {
    console.log("Preparing to wipe ALL old data from Units, Ledger, and Tenants collections...");

    const collectionsToWipe = ["Units", "Ledger", "Tenants"];

    for (const collName of collectionsToWipe) {
        console.log(`Fetching all documents in ${collName}...`);
        try {
            const snapshot = await getDocs(collection(db, collName));
            if (snapshot.empty) {
                console.log(`  -> ${collName} is already empty.`);
                continue;
            }

            console.log(`  -> Deleting ${snapshot.size} documents from ${collName}...`);
            const deletePromises = [];
            snapshot.forEach((docSnap) => {
                deletePromises.push(deleteDoc(docSnap.ref));
            });

            await Promise.all(deletePromises);
            console.log(`  -> Successfully wiped ${collName}.`);
        } catch (err) {
            console.error(`Error wiping ${collName}:`, err.message);
        }
    }

    console.log("✅ Master Architecture Wipe Complete.");
    process.exit(0);
}

wipeDatabase();
