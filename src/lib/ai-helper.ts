
import { GoogleGenerativeAI } from '@google/generative-ai';

const MODELS_TO_TRY = [
  "gemini-3-pro-image-preview",
  "gemini-3-pro-preview",
  "gemini-3-flash-preview"
];

export async function generateContentWithFallback(genAI: GoogleGenerativeAI, prompt: string, images: any[] = []) {
  let lastError;

  for (const modelName of MODELS_TO_TRY) {
    try {
      console.log(`Attempting generation with model: ${modelName}`);
      const model = genAI.getGenerativeModel({ model: modelName });
      
      const result = await model.generateContent([prompt, ...images]);
      const response = await result.response;
      return response.text();
      
    } catch (e: any) {
      console.warn(`Model ${modelName} failed:`, e.message?.substring(0, 100));
      lastError = e;
      // Continue to next model
    }
  }

  throw lastError || new Error("All models failed");
}
