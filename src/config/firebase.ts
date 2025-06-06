import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getStorage } from 'firebase/storage';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyA-mDsyQ1nAOB0Od7hP3GiNfgfDA0lDrJU",
  authDomain: "trustrx-eb780.firebaseapp.com",
  projectId: "trustrx-eb780",
  storageBucket: "trustrx-eb780.firebasestorage.app",
  messagingSenderId: "654309006706",
  appId: "1:654309006706:web:0e74b1652c85d6656cd1eb",
  measurementId: "G-4BXLNFTCJ1"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const storage = getStorage(app);
export const db = getFirestore(app);

export default app;