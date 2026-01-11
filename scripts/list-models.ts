
import { GoogleGenerativeAI } from "@google/generative-ai";
import * as dotenv from "dotenv";
import path from "path";

// Load env from .env.local
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const apiKey = process.env.GEMINI_API_KEY;

if (!apiKey) {
  console.error("❌ No GEMINI_API_KEY found in .env.local");
  process.exit(1);
}

console.log("Found API Key:", apiKey.substring(0, 8) + "...");

const genAI = new GoogleGenerativeAI(apiKey);

async function listModels() {
  try {
    // There isn't a direct listModels method on the SDK instance exposed easily in all versions, 
    // but we can try hitting the REST endpoint if the SDK doesn't expose it, 
    // OR we can just try to instantiate a few common ones and see if they work (invoke a simple prompt).
    // actually, the user provided a fetch snippet. let's use that but adapted for node.
    
    console.log("Fetching available models via REST API...");
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`
    );
    
    if (!response.ok) {
        throw new Error(`HTTP Error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    
    console.log("\n✅ Available Models for this API Key:");
    const generationModels = data.models.filter((m: any) => m.supportedGenerationMethods.includes("generateContent"));
    
    generationModels.forEach((model: any) => {
      console.log(`- ${model.name} (${model.displayName})`);
    });

    if (generationModels.length === 0) {
        console.warn("\n⚠️ No models found with 'generateContent' capability.");
    }

  } catch (error) {
    console.error("Error listing models:", error);
  }
}

listModels();
