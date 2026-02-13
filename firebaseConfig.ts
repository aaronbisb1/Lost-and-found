import { initializeApp } from 'firebase/app';
import { getDatabase, ref, onValue, set, update, remove } from 'firebase/database';
import { getAuth } from 'firebase/auth';

// Initialize Firebase with environment variables
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  databaseURL: 'https://lost-and-found-373e3-default-rtdb.europe-west1.firebasedatabase.app',
};

const app = initializeApp(firebaseConfig);
export const database = getDatabase(app);
export const auth = getAuth(app);

// Real-time database references
export const usersRef = ref(database, 'users');
export const itemsRef = ref(database, 'items');

// Helper to wait for Firebase initialization
export const isFirebaseConfigured = (): boolean => {
  return !!(
    import.meta.env.VITE_FIREBASE_API_KEY &&
    import.meta.env.VITE_FIREBASE_PROJECT_ID
  );
};

export { onValue, set, update, remove, ref };
