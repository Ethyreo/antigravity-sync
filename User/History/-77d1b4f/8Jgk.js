import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDVvyHLg2qPDb4jLb6fyINjXMGwLaizNFk",
  authDomain: "shimla-building-app.firebaseapp.com",
  projectId: "shimla-building-app",
  storageBucket: "shimla-building-app.firebasestorage.app",
  messagingSenderId: "616524927374",
  appId: "1:616524927374:web:b91221ce849a40291a14df",
  measurementId: "G-9FNZGSW5N6"
};

// Initialize Firebase App Singleton
const app = initializeApp(firebaseConfig);

// Initialize Cloud Firestore and get a reference to the service
const db = getFirestore(app);

export { db, app };
