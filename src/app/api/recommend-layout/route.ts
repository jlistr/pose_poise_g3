
import { GoogleGenerativeAI } from '@google/generative-ai';
import { NextResponse } from 'next/server';
import { generateContentWithFallback } from '@/lib/ai-helper';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

export async function POST(req: Request) {
  try {
    const { images, profile } = await req.json();

    if (!process.env.GEMINI_API_KEY) {
        return NextResponse.json({ error: 'Missing API Key' }, { status: 500 });
    }

    // Front Layouts: 'classic', 'modern', 'minimal'
    // Back Layouts: 'grid', 'masonry', 'triptych', 'agency', 'focus', 'band', 'quad'

    const prompt = `
      You are a high-end fashion art director.
      
      TASK:
      Analyze the Model Profile and the provided images to recommend the best composite card layout combination.

      Model Name: ${profile.name}
      Vibe: ${profile.description || 'Professional Model'}
      
      AVAILABLE FRONT LAYOUTS:
      - 'classic': Traditional, name at bottom.
      - 'modern': Bold, large typography.
      - 'minimal': Clean, white space.

      AVAILABLE BACK LAYOUTS:
      - 'grid': Balanced 2x2 or 3x3.
      - 'masonry': Dynamic collage.
      - 'triptych': 3 images side-by-side.
      - 'agency': Standard strict grid.
      - 'focus': One large image + smaller ones.
      - 'band': Film strip style.
      - 'quad': 4 images.

      INSTRUCTIONS:
      1. Choose the best Front Layout based on the aesthetic (e.g. Edgy -> Modern, Commercial -> Classic).
      2. Choose the best Back Layout based on the image aspect ratios and variety.
      
      OUTPUT FORMAT:
      Return ONLY valid JSON.
      { 
        "frontLayout": "modern", 
        "backLayout": "masonry",
        "reasoning": "The bold images suit a modern front, and the mix of portrait/landscape works best in masonry."
      }
    `;

    // We don't strictly *need* the images to decide layout if we have valid metadata, 
    // but sending 1-2 images helps the AI "see" the vibe.
    // Let's send up to 3 images to save bandwidth/tokens but give context.
    const sampleImages = images.slice(0, 3);
    
    // Fetch buffers
    const imageParts = await Promise.all(
      sampleImages.map(async (url: string) => {
        try {
            const response = await fetch(url);
            const arrayBuffer = await response.arrayBuffer();
            return {
              inlineData: {
                data: Buffer.from(arrayBuffer).toString("base64"),
                mimeType: "image/jpeg", 
              },
            };
        } catch (e) { return null; }
      })
    );
    const validImageParts = imageParts.filter(p => p !== null);

    const text = await generateContentWithFallback(genAI, prompt, validImageParts);
    
    const cleanText = text.replace(/```json/g, '').replace(/```/g, '').trim();
    const result = JSON.parse(cleanText);

    return NextResponse.json(result);

  } catch (error: any) {
    console.error('Layout Recommendation Error:', error);
    return NextResponse.json({ error: error.message || 'Layout generation failed' }, { status: 500 });
  }
}
