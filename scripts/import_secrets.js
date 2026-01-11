const fs = require('fs');
const path = require('path');
const { SecretManagerServiceClient } = require('@google-cloud/secret-manager');

// 1. Determine Project ID
let projectId = process.env.GOOGLE_CLOUD_PROJECT;
if (!projectId) {
  try {
    const firebaserc = JSON.parse(fs.readFileSync(path.resolve(__dirname, '../.firebaserc'), 'utf8'));
    projectId = firebaserc.projects.default;
  } catch (e) {
    console.warn("Could not read .firebaserc to determine project ID.");
  }
}

if (!projectId) {
  console.error("ERROR: No project ID found. Set GOOGLE_CLOUD_PROJECT env var or ensure .firebaserc exists.");
  process.exit(1);
}

console.log(`Using Project ID: ${projectId}`);

// 2. Read .env.local
const envPath = path.resolve(__dirname, '../.env.local');
if (!fs.existsSync(envPath)) {
  console.error(`ERROR: ${envPath} not found.`);
  process.exit(1);
}

const content = fs.readFileSync(envPath, 'utf8');
const secrets = {};
content.split('\n').forEach(line => {
  line = line.trim();
  if (!line || line.startsWith('#')) return;
  
  const idx = line.indexOf('=');
  if (idx === -1) return;
  
  const key = line.substring(0, idx).trim();
  let value = line.substring(idx + 1).trim();
  
  // Remove quotes if present
  if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
    value = value.slice(1, -1);
  }
  
  if (key && value) {
    secrets[key] = value;
  }
});

if (Object.keys(secrets).length === 0) {
  console.log("No secrets found in .env.local");
  process.exit(0);
}

// 3. Import to Secret Manager
const client = new SecretManagerServiceClient();

async function importSecrets() {
  for (const [key, value] of Object.entries(secrets)) {
    // Secret Manager requires lowercase/numbers/dashes for IDs if we want to follow convention, 
    // BUT env vars are uppercase. Secret Manager resource IDs DO accept uppercase/underscores.
    // "Secret IDs can only contain alphanumeric characters, underscores, hyphens"
    
    const secretId = key;
    const parent = `projects/${projectId}`;
    
    console.log(`Processing ${secretId}...`);

    // Check if secret exists
    try {
      await client.getSecret({
        name: `${parent}/secrets/${secretId}`
      });
      console.log(`  - Secret ${secretId} exists.`);
    } catch (e) {
      if (e.code === 5) { // NOT_FOUND
        console.log(`  - Creating secret ${secretId}...`);
        await client.createSecret({
          parent,
          secretId,
          secret: {
            replication: {
              automatic: {},
            },
          },
        });
      } else {
        console.error(`  - Error checking secret ${secretId}:`, e.message);
        continue;
      }
    }

    // Add Secret Version
    console.log(`  - Adding new version...`);
    await client.addSecretVersion({
      parent: `${parent}/secrets/${secretId}`,
      payload: {
        data: Buffer.from(value, 'utf8'),
      },
    });
    console.log(`  - Done.`);
  }
  console.log("\nAll secrets processed.");
}

importSecrets().catch(err => {
  console.error("Fatal Error:", err);
  process.exit(1);
});
