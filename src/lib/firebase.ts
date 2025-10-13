import { initializeApp, getApps } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";


// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCu1Dh5GGU9v2hD910qhf_SpfgbTe7T_nc",
  authDomain: "xuna-db.firebaseapp.com",
  projectId: "xuna-db",
  storageBucket: "xuna-db.firebasestorage.app",
  messagingSenderId: "987466044947",
  appId: "1:987466044947:web:692e7a3ca75ecdf69011e6"
};



// Initialize Firebase only if it hasn't been initialized yet
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app)