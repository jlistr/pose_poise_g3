import { initializeApp, getApps, getApp, FirebaseApp } from "firebase/app";
import { getAnalytics, isSupported, Analytics } from "firebase/analytics";
import { getAuth, Auth } from "firebase/auth";
import { getFirestore, Firestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID
};

// Initialize Firebase
let app: FirebaseApp;
let auth: Auth;
let db: Firestore;
let analytics: Analytics | undefined;

try {
  // Check if config is valid (at least apiKey)
  if (!firebaseConfig.apiKey) {
    if (typeof window !== 'undefined') {
       console.warn("Firebase config missing. Please set NEXT_PUBLIC_FIREBASE_API_KEY in .env.local");
    }
    // Create a dummy app or let it fail at runtime? 
    // For build to pass, we might need to skip init or use a mock.
    // However, getAuth(app) needs a valid app.
    // We will let it throw specific errors or handle it.
    // If we are in build time (Server), we might skip.
  }

  app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
  auth = getAuth(app);
  db = getFirestore(app);

  if (typeof window !== "undefined") {
    isSupported().then((supported) => {
      if (supported) {
        analytics = getAnalytics(app);
      }
    });
  }
} catch (error: any) {
  console.warn("Firebase initialization failed (Is your .env.local set?):", error.code || error.message);
  // Export mocks or undefined to prevent crash during import, 
  // but usage will still fail - which is correct for missing config.
  
  // NOTE: This allows the build to finish even if keys are missing, 
  // provided we don't try to USE these exports during static generation.
  // The 'auth/invalid-api-key' error is thrown Synchronously by initializeApp.
  
  // We can't easily mock the complex Auth/Firestore objects typesafe.
  // So we re-throw if it's critical, but here we want to survive build.
  
  // Actually, if we just define them as 'any' for the fallback it works for build...
  app = {} as any;
  auth = {} as any;
  db = {} as any;
}

export { app, analytics, auth, db };
