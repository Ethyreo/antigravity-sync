import { initializeApp } from "firebase/app";
import { getFirestore, collection, getDocs, deleteDoc, doc } from "firebase/firestore";
import fs from "fs";

try {
    const content = fs.readFileSync('./src/config/firebase.js', 'utf8');

    // Regex extract config
    const apiKey = content.match(/apiKey:\s*"(.*?)"/)[1];
    const authDomain = content.match(/authDomain:\s*"(.*?)"/)[1];
    const projectId = content.match(/projectId:\s*"(.*?)"/)[1];
    const storageBucket = content.match(/storageBucket:\s*"(.*?)"/)[1];
    const messagingSenderId = content.match(/messagingSenderId:\s*"(.*?)"/)[1];
    const appId = content.match(/appId:\s*"(.*?)"/)[1];

    const firebaseConfig = {
        apiKey, authDomain, projectId, storageBucket, messagingSenderId, appId
    };

    const app = initializeApp(firebaseConfig);
    const db = getFirestore(app);

    async function wipeRogueDocs() {
        console.log("Fetching Ledger to find rogue documents...");
        const ledgerSnap = await getDocs(collection(db, "Ledger"));

        const deletePromises = [];

        ledgerSnap.forEach(document => {
            // If the document ID has a trailing space or ends with a space
            if (document.id.endsWith(' ')) {
                console.log(`Deleting rogue document: "${document.id}"`);
                deletePromises.push(deleteDoc(doc(db, "Ledger", document.id)));
            }
        });

        if (deletePromises.length > 0) {
            await Promise.all(deletePromises);
            console.log(`Successfully deleted ${deletePromises.length} rogue NoSQL documents.`);
        } else {
            console.log("No rogue documents found.");
        }

        process.exit(0);
    }

    wipeRogueDocs();
} catch (e) {
    console.error("Deletion Script Error:", e);
}
