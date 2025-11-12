/**
 * Firebase Configuration and Authentication Setup
 * 
 * Initializes Firebase with authentication and Firestore
 */

import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth, connectAuthEmulator } from "firebase/auth";
import { getFirestore, connectFirestoreEmulator } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDJXN7Fn7DiBaqsZcYeqcJdWR7l6RUA53Y",
  authDomain: "beehive-45129.firebaseapp.com",
  projectId: "beehive-45129",
  storageBucket: "beehive-45129.firebasestorage.app",
  messagingSenderId: "558379125435",
  appId: "1:558379125435:web:9ed58e7d86e72fabce379e",
  measurementId: "G-9E6CMM5YHQ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app);

// Initialize Cloud Firestore and get a reference to the service
export const db = getFirestore(app);

// Initialize Firebase Storage and get a reference to the service
export const storage = getStorage(app);

// Initialize Analytics (only in production)
export const analytics = typeof window !== 'undefined' ? getAnalytics(app) : null;

// Connect to Firebase emulators in development
if (process.env.NODE_ENV === 'development' && typeof window !== 'undefined') {
  // Only connect to emulators if not already connected
  try {
    // Connect to auth emulator if running locally
    // Uncomment these lines if you want to use Firebase emulators for development
    // connectAuthEmulator(auth, "http://localhost:9099", { disableWarnings: true });
    // connectFirestoreEmulator(db, 'localhost', 8080);
  } catch (error) {
    console.log('Firebase emulators already connected or not available');
  }
}

export default app;