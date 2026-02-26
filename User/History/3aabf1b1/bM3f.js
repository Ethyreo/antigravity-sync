import { initializeApp } from "firebase/app";
import { getFirestore, collection, getDocs } from "firebase/firestore";
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

  async function checkLedger() {
    console.log("Fetching Ledger...");
    const ledgerSnap = await getDocs(collection(db, "Ledger"));
    const data = [];
    ledgerSnap.forEach(doc => data.push({ ...doc.data(), _id: doc.id }));

    // Filter for February
    const febData = data.filter(d => d.BillingMonth === '2026-02');
    console.log(JSON.stringify(febData.map(d => ({ ID: d._id, Unit: d.UnitID, Month: d.BillingMonth, Status: d.RentStatus })), null, 2));
    process.exit(0);
  }

  checkLedger();
} catch (e) {
  console.error("Test Error:", e);
}
