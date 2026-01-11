const admin = require('firebase-admin');
const fs = require('fs');
const path = require('path');

// Check for Service Account Key
const serviceAccountPath = path.resolve(__dirname, '../service-account.json');
if (!fs.existsSync(serviceAccountPath)) {
  console.error("ERROR: service-account.json not found in root directory.");
  console.error("Please download it from Firebase Console -> Project Settings -> Service Accounts");
  process.exit(1);
}

const serviceAccount = require(serviceAccountPath);

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

async function exportCollection(collectionPath) {
  console.log(`Exporting ${collectionPath}...`);
  const snapshot = await db.collection(collectionPath).get();
  const data = {};
  snapshot.forEach(doc => {
    data[doc.id] = doc.data();
  });
  return data;
}

// Recursively export all subcollections for a doc? 
// For this MVP migration, we know the structure:
// users/{uid}/profile/data
// artifacts/{APP_ID}/users/{uid}/portfolio/data
// artifacts/{APP_ID}/users/{uid}/compositeCards
// artifacts/{APP_ID}/users/{uid}/library

const APP_ID = 'pose-and-poise'; 

async function run() {
  const exportData = {
    users: {},     // keyed by uid
    portfolios: {}, // keyed by uid (conceptually)
    cards: {},
    library: {}
  };

  // 1. Get all users
  const usersSnap = await db.collection('users').get();
  for (const userDoc of usersSnap.docs) {
    const uid = userDoc.id;
    // Get Profile for this user
    const profileDoc = await db.doc(`users/${uid}/profile/data`).get();
    if (profileDoc.exists) {
      exportData.users[uid] = profileDoc.data();
    }

    // Get Portfolio for this user (in artifacts)
    const portfolioDoc = await db.doc(`artifacts/${APP_ID}/users/${uid}/portfolio/data`).get();
    if (portfolioDoc.exists) {
      exportData.portfolios[uid] = portfolioDoc.data();
    }

    // Get Composite Cards
    const cardsSnap = await db.collection(`artifacts/${APP_ID}/users/${uid}/compositeCards`).get();
    exportData.cards[uid] = [];
    cardsSnap.forEach(card => {
       exportData.cards[uid].push({ id: card.id, ...card.data() });
    });

    // Get Library
    const libSnap = await db.collection(`artifacts/${APP_ID}/users/${uid}/library`).get();
    exportData.library[uid] = [];
    libSnap.forEach(item => {
      exportData.library[uid].push({ id: item.id, ...item.data() });
    });
  }

  fs.writeFileSync(path.join(__dirname, '../data/export.json'), JSON.stringify(exportData, null, 2));
  console.log("Export complete! Saved to data/export.json");
}

run().catch(console.error);
