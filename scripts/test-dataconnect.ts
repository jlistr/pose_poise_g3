
import { initializeApp } from "firebase/app";
import { getDataConnect, connectDataConnectEmulator } from "firebase/data-connect";
import { getAuth, connectAuthEmulator, createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
import { getProfile, connectorConfig } from "@/dataconnect-generated";

const firebaseConfig = {
  apiKey: "fake-api-key",
  projectId: "pose-6e546", // Using the project ID from earlier conversations, or can be 'demo-project'
};

const app = initializeApp(firebaseConfig);
const dc = getDataConnect(app, connectorConfig);
const auth = getAuth(app);

connectDataConnectEmulator(dc, 'localhost', 9399);
connectAuthEmulator(auth, "http://127.0.0.1:9099");

async function testConnection() {
  console.log("Testing Data Connect connection...");
  try {
    const email = `testuser-${Date.now()}@example.com`;
    const password = "password123";
    let userCred;
    try {
        userCred = await createUserWithEmailAndPassword(auth, email, password);
        console.log("Created user:", userCred.user.uid);
    } catch (e: any) {
        if (e.code === 'auth/email-already-in-use') {
             userCred = await signInWithEmailAndPassword(auth, email, password);
             console.log("Signed in existing user:", userCred.user.uid);
        } else {
            throw e;
        }
    }
    
    // We are passing the UID of the signed-in user to the query
    const result = await getProfile(dc, { uid: userCred.user.uid });
    console.log("Successfully connected!");
    console.log("Result:", JSON.stringify(result, null, 2));
  } catch (error) {
    console.error("Error connecting to Data Connect:", error);
  }
}

testConnection();
