import * as admin from 'firebase-admin';

if (!admin.apps.length) {
  // If in development, point to the Emulator
  if (process.env.NODE_ENV === 'development') {
    process.env.FIREBASE_AUTH_EMULATOR_HOST = '127.0.0.1:9099';
    process.env.FIRESTORE_EMULATOR_HOST = '127.0.0.1:8080';
    console.log("Firebase Admin: Using Emulator Hosts", {
        auth: process.env.FIREBASE_AUTH_EMULATOR_HOST,
        firestore: process.env.FIRESTORE_EMULATOR_HOST
    });
  } else {
      console.log("Firebase Admin: Using Production", { env: process.env.NODE_ENV });
  }

  admin.initializeApp({
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || 'pose-6e546',
  });
}

export const db = admin.firestore();
export const auth = admin.auth();
