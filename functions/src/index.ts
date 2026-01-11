/**
 * Import function triggers from their respective submodules:
 *
 * import {onCall, HttpsError, CallableRequest} from "firebase-functions/v2/https";
 * import {onDocumentWritten} from "firebase-functions/v2/firestore";
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */

import {setGlobalOptions} from "firebase-functions";
import {onCall, HttpsError, onRequest, CallableRequest} from "firebase-functions/v2/https";
import {onObjectFinalized} from "firebase-functions/v2/storage";
import {defineSecret} from "firebase-functions/params";
import * as admin from "firebase-admin";
import {getStorage} from "firebase-admin/storage";
import {FieldValue} from "firebase-admin/firestore";
import cors = require("cors");

// Initialize Admin SDK for database access
if (admin.apps.length === 0) {
  admin.initializeApp();
}

const corsHandler = cors({origin: "http://localhost:3000"});


// Start writing functions
// https://firebase.google.com/docs/functions/typescript

// For cost control, you can set the maximum number of containers that can be
// running at the same time. This helps mitigate the impact of unexpected
// traffic spikes by instead downgrading performance. This limit is a
// per-function limit. You can override the limit for each function using the
// `maxInstances` option in the function's options, e.g.
// `onRequest({ maxInstances: 5 }, (req, res) => { ... })`.
// NOTE: setGlobalOptions does not apply to functions using the v1 API. V1
// functions should each use functions.runWith({ maxInstances: 10 }) instead.
// In the v1 API, each function can only serve one request per container, so
// this will be the maximum concurrent request count.
setGlobalOptions({ maxInstances: 10 });

// export const helloWorld = onRequest((request, response) => {
//   logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });



// 1. Define the secret key so we can access it securely
const lateApiKey = defineSecret("LATE_API_KEY");
const vercelApiToken = defineSecret("VERCEL_API_TOKEN");

// Configuration for Vercel Integration
const VERCEL_PROJECT_ID = "prj_YOUR_PROJECT_ID_HERE"; // Replace with actual Project ID
const VERCEL_TEAM_ID = ""; // Optional: Add Team ID if using a Vercel Team

/**
 * @param {string} profileId - The ID of the profile to fetch (e.g., from your database).
 */
export const getConnectedProfile = onCall({ secrets: [lateApiKey], cors: true }, async (request: CallableRequest) => {
  // 2. Reject requests from unauthenticated users
  if (!request.auth) {
    throw new HttpsError("unauthenticated", "User must be logged in to view profiles.");
  }

  const { profileId } = request.data;
  const apiKey = lateApiKey.value(); // Retrieve the secret value securely

  // 3. Validation
  if (!profileId) {
    throw new HttpsError("invalid-argument", "The function must be called with a 'profileId'.");
  }

  try {
    // 4. Call Late API to get the profile details
    // Note: Verify the exact endpoint URL in the Late API documentation.
    // It is typically /profiles/{id} or /accounts/{id}
    const response = await fetch(`https://api.getlate.dev/profiles/${profileId}`, {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json"
      }
    });

    if (!response.ok) {
      // Handle non-200 responses (e.g., 404 Not Found, 401 Unauthorized)
      const errorData = await response.json();
      console.error("Late API Error:", errorData);
      throw new HttpsError("internal", `Late API Failed: ${errorData.message || response.statusText}`);
    }

    const profileData = await response.json();

    // 5. Return the clean data to your frontend
    return {
      success: true,
      platform: profileData.platform, // e.g., 'instagram', 'tiktok'
      username: profileData.username,
      avatarUrl: profileData.profile_picture_url,
      stats: {
        followers: profileData.followers_count,
        following: profileData.following_count
      }
    };

  } catch (error) {
    console.error("Fetch Error:", error);
    // Re-throw valid HttpsErrors, wrap others
    if (error instanceof HttpsError) throw error;
    throw new HttpsError("internal", "Unable to reach social media provider.");
  }
});

/**
 * Checks if a domain is available for purchase via Vercel.
 * @param {string} domain - The domain to check (e.g., "example.com")
 */
export const checkDomainAvailability = onCall({ secrets: [vercelApiToken], cors: true }, async (request: CallableRequest) => {
  if (!request.auth) {
    throw new HttpsError("unauthenticated", "User must be logged in.");
  }

  const { domain } = request.data;
  if (!domain) {
    throw new HttpsError("invalid-argument", "Domain name is required.");
  }

  const token = vercelApiToken.value();

  try {
    const teamParam = VERCEL_TEAM_ID ? `&teamId=${VERCEL_TEAM_ID}` : '';
    const response = await fetch(`https://api.vercel.com/v4/domains/status?name=${domain}${teamParam}`, {
      headers: { "Authorization": `Bearer ${token}` }
    });
    
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error?.message || "Failed to check domain.");
    }

    return {
      available: data.available,
      price: data.price,
      currency: "USD",
      period: 1 // 1 year
    };

  } catch (error: any) {
    console.error("Domain Check Error:", error);
    throw new HttpsError("internal", error.message || "Failed to check domain availability.");
  }
});

/**
 * Purchases a domain via Vercel and links it to the project.
 * @param {string} domain - The domain to buy
 * @param {number} expectedPrice - Safety check for price
 */
export const purchaseAndLinkDomain = onCall({ secrets: [vercelApiToken], cors: true }, async (request: CallableRequest) => {
  if (!request.auth) {
    throw new HttpsError("unauthenticated", "User must be logged in.");
  }

  const { domain, expectedPrice } = request.data;
  const userId = request.auth.uid;
  const token = vercelApiToken.value();

  if (!domain) throw new HttpsError("invalid-argument", "Domain is required.");

  try {
    const teamParam = VERCEL_TEAM_ID ? `?teamId=${VERCEL_TEAM_ID}` : '';
    
    // 1. Purchase Domain
    const buyResponse = await fetch(`https://api.vercel.com/v5/domains/buy${teamParam}`, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ name: domain, expectedPrice })
    });

    const buyData = await buyResponse.json();
    if (!buyResponse.ok) {
      throw new Error(buyData.error?.message || "Failed to purchase domain.");
    }

    // 2. Link to Vercel Project (Required for routing/SSL)
    const linkResponse = await fetch(`https://api.vercel.com/v9/projects/${VERCEL_PROJECT_ID}/domains${teamParam}`, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ name: domain })
    });

    if (!linkResponse.ok) {
      console.error("Link Error:", await linkResponse.text());
      // We continue because the purchase was successful, we can retry linking later
    }

    // 3. Save Record in Firestore
    const domainRecord = {
      domain,
      userId,
      purchasedAt: FieldValue.serverTimestamp(),
      expiresAt: buyData.expiresAt,
      autoRenew: true,
      provider: "vercel",
      status: "active"
    };

    // Save under user for management
    await admin.firestore().collection("users").doc(userId).collection("domains").doc(domain).set(domainRecord);
    
    // Save global mapping for Middleware routing (Domain -> User)
    await admin.firestore().collection("domains").doc(domain).set({ userId });

    return { success: true, domain: buyData };

  } catch (error: any) {
    console.error("Purchase Error:", error);
    throw new HttpsError("internal", error.message || "Failed to purchase domain.");
  }
});


// ... existing code ...

/**
 * Retrieves the user's library of saved items.
 */
export const getLibrary = onCall({ cors: true }, async (request: CallableRequest) => {
  // ... existing implementation ...
});

/**
 * Creates a signed URL for a client to upload a file after checking for duplicates.
 * @param {string} imageHash - SHA-256 hash of the image file.
 * @param {string} contentType - The MIME type of the file (e.g., "image/jpeg").
 */
export const requestImageUploadURL = onRequest({secrets: [lateApiKey]}, async (request, response) => {
    corsHandler(request, response, async () => {
        const idToken = request.headers.authorization?.split("Bearer ")[1];
        let uid: string | undefined;

        if (idToken) {
            try {
                const decodedToken = await admin.auth().verifyIdToken(idToken);
                uid = decodedToken.uid;
            } catch (error) {
                console.error("Error verifying auth token:", error);
                response.status(401).send({error: "Unauthorized"});
                return;
            }
        }

        if (!uid) {
            response.status(401).send({error: "Unauthorized"});
            return;
        }

        const { imageHash, contentType } = request.body.data || request.body;
        const userId = uid;

        if (!imageHash || !contentType) {
            response.status(400).send({error: "Image hash and content type are required."});
            return;
        }

        try {
            const db = admin.firestore();
            const hashRef = db.collection("image_hashes").doc(imageHash);
            const hashDoc = await hashRef.get();

            if (hashDoc.exists) {
                const existingData = hashDoc.data();
                if (existingData) {
                    const imageRef = db.collection("users").doc(userId).collection("images").doc(existingData.fileId);
                    const imageDoc = await imageRef.get();
                    if (imageDoc.exists) {
                        response.status(200).send({ data: { duplicate: true, ...imageDoc.data() } });
                        return;
                    }
                    await imageRef.set({ ...existingData, createdAt: FieldValue.serverTimestamp() });
                    response.status(200).send({ data: { duplicate: true, ...existingData } });
                    return;
                }
            }

            const fileId = db.collection("users").doc().id;
            const finalPath = `uploads/${userId}/${fileId}`;
            
            await db.collection("image_metadata").doc(fileId).set({
                userId,
                imageHash,
                contentType,
                status: "pending",
                createdAt: FieldValue.serverTimestamp(),
                path: finalPath,
            });

            const bucket = getStorage().bucket();
            const file = bucket.file(finalPath);
            const expires = Date.now() + 60 * 1000 * 5; // 5 minutes

            const [signedUrl] = await file.getSignedUrl({
                action: "write",
                expires,
                contentType,
                version: "v4",
            });

            response.status(200).send({ data: { duplicate: false, signedUrl, fileId } });
        } catch (error) {
            console.error("Error generating signed URL:", error);
            if (error instanceof HttpsError) {
              response.status(error.httpErrorCode.status).send({error: error.message});
            } else {
              response.status(500).send({error: "Internal Server Error"});
            }
        }
    });
});

/**
 * Triggered when a new file is uploaded to the temp path; moves it to permanent storage.
 */
export const processUploadedImage = onObjectFinalized({
    cpu: "gcf_gen1" // Explicitly use Gen 1 CPU for background functions if needed
}, async (event) => {
    const fileBucket = event.bucket;
    const filePath = event.data.name; 
    const contentType = event.data.contentType;

    if (!filePath.startsWith("uploads/") || !contentType) {
        console.log(`Object ${filePath} is not a valid upload. Ignoring.`);
        return null;
    }

    const parts = filePath.split("/");
    const userId = parts[1];
    const fileId = parts[2];
    
    const db = admin.firestore();
    const metadataRef = db.collection("image_metadata").doc(fileId);
    const metadataSnapshot = await metadataRef.get();
    const metadataData = metadataSnapshot.data();

    if (!metadataSnapshot.exists || !metadataData || metadataData.userId !== userId) {
        console.error(`Orphaned file or user mismatch for ${fileId}.`);
        return null;
    }

    const { imageHash } = metadataData;
    const permanentPath = filePath; // File is already in the right place
    const bucket = getStorage().bucket(fileBucket);

    // Skip move
    // await bucket.file(filePath).move(permanentPath);

    const file = bucket.file(permanentPath);
    // Make public for simplicity; for private files, generate signed URLs on-demand
    await file.makePublic(); 
    const downloadURL = file.publicUrl();

    // Update metadata
    const finalData = {
        status: "completed",
        path: permanentPath,
        downloadURL,
        updatedAt: FieldValue.serverTimestamp(),
    };
    await metadataRef.update(finalData);

    // Save to the user's personal gallery/collection
    await db.collection("users").doc(userId).collection("images").doc(fileId).set({
        fileId,
        downloadURL,
        path: permanentPath,
        contentType,
        createdAt: metadataData.createdAt, // Preserve original creation time
    });

    // Save hash lookup record
    await db.collection("image_hashes").doc(imageHash).set({
        fileId,
        downloadURL,
        path: permanentPath,
        userId // Track original uploader
    });

    console.log(`Processed and moved ${filePath} to ${permanentPath}.`);
    return null;
});

/**
 * Retrieves all notifications for the authenticated user.
 */
export const getNotifications = onCall({ cors: true }, async (request) => {
    if (!request.auth) {
        throw new HttpsError("unauthenticated", "User must be logged in.");
    }
    const userId = request.auth.uid;

    try {
        const snapshot = await admin.firestore()
            .collection("users")
            .doc(userId)
            .collection("notifications")
            .orderBy("createdAt", "desc")
            .get();

        const notifications = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        return { success: true, notifications };
    } catch (error) {
        console.error("Get Notifications Error:", error);
        throw new HttpsError("internal", "Failed to retrieve notifications.");
    }
});

/**
 * Deletes a specific notification for the authenticated user.
 * @param {string} notificationId - The ID of the notification to delete.
 */
export const removeNotification = onCall({ cors: true }, async (request) => {
    if (!request.auth) {
        throw new HttpsError("unauthenticated", "User must be logged in.");
    }

    const { notificationId } = request.data;
    const userId = request.auth.uid;

    if (!notificationId) {
        throw new HttpsError("invalid-argument", "Notification ID is required.");
    }

    try {
        const notificationRef = admin.firestore()
            .collection("users")
            .doc(userId)
            .collection("notifications")
            .doc(notificationId);
        
        // The security rules would be a better place for this, but for a simple
        // backend check, we ensure the doc belongs to the user via path construction.
        await notificationRef.delete();

        return { success: true };
    } catch (error) {
        console.error("Remove Notification Error:", error);
        throw new HttpsError("internal", "Failed to remove notification.");
    }
});

