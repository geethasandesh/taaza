import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { getStorage } from 'firebase/storage';

// Your Firebase configuration
// Replace with your actual Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyCWDF0q_R4LVWKQ-2mosblGDQLPGOKKbyE",
  authDomain: "taaza-adcd9.firebaseapp.com",
  projectId: "taaza-adcd9",
  storageBucket: "taaza-adcd9.firebasestorage.app",
  messagingSenderId: "96118554451",
  appId: "1:96118554451:web:27fb35a5833117164eaba6",
  measurementId: "G-Z7DJWV6QEQ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
export const db = getFirestore(app);
export const auth = getAuth(app);
export const storage = getStorage(app);

export default app; 