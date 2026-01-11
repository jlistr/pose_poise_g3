
import { GoogleGenerativeAI } from '@google/generative-ai';
import { NextResponse } from 'next/server';
import { generateContentWithFallback } from '@/lib/ai-helper';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

export async function POST(req: Request) {
  try {
    const { imageUrls, profile, settings } = await req.json();

    if (!process.env.GEMINI_API_KEY) {
        return NextResponse.json({ error: 'Missing API Key' }, { status: 500 });
    }

    if (!imageUrls || imageUrls.length === 0) {
      return NextResponse.json({ error: 'No images provided' }, { status: 400 });
    }

    // Helper to fetch image buffer
    const imageParts = await Promise.all(
      imageUrls.map(async (url: string) => {
        try {
            const response = await fetch(url);
            const arrayBuffer = await response.arrayBuffer();
            return {
              inlineData: {
                data: Buffer.from(arrayBuffer).toString("base64"),
                mimeType: "image/jpeg", 
              },
            };
        } catch (e) {
            console.error("Failed to fetch image for AI", url);
            return null;
        }
      })
    );
    
    // Filter out failed fetches
    const validImages = imageParts.filter(p => p !== null);
    
    if (validImages.length === 0) {
        return NextResponse.json({ error: 'Failed to access images' }, { status: 400 });
    }

    const prompt = `
      You are an expert modeling career coach and editor. 
      Analyze this modeling portfolio of ${validImages.length} images.
      
      Model Profile: ${JSON.stringify(profile)}
      Current Layout Settings: ${JSON.stringify(settings)}

      TASK:
      1. Provide a positive, energy-boosting 2-sentence summary of the portfolio's vibe.
      2. Analyze the image quality and professional standard.
      3. Identify any DUPLICATE or NEAR-IDENTICAL photographs (visually the same shot or highly similar). Provide their 0-based indices from the input list.
      4. Suggest 2-3 specific layout changes for better impact.
      5. Provide a paragraph tying the portfolio to the career goals: "${profile?.careerGoals || 'Professional modeling'}"
      6. Select the single BEST image to be the "Hero" (cover) images. It should be striking, high resolution, and have good negative space or composition. Return its index.
      7. Select 1-3 images that are "Standouts" or "High Impact" that should be highlighted (larger size in grid). Return their indices.

      OUTPUT FORMAT:
      Return ONLY a JSON object with the following structure:
      {
        "summary": "string",
        "imageQuality": {
          "status": "excellent" | "good" | "needs_work",
          "details": "string",
          "upscaleRecommendation": ["string"]
        },
        "duplicateIndices": [number],
        "layoutSuggestions": ["string"],
        "careerAlignment": "string",
        "suggestedAutomations": {
           "heroIndex": number,
           "highlightIndices": [number],
           "rationale": "string"
        }
      }
    `;

    // Use fallback helper
    const text = await generateContentWithFallback(genAI, prompt, validImages);
    
    // Clean markdown if present
    const cleanText = text.replace(/```json/g, '').replace(/```/g, '').trim();
    const result = JSON.parse(cleanText);

    return NextResponse.json(result);

  } catch (error) {
    console.error('Enhance Portfolio Error:', error);
    return NextResponse.json({ error: 'Enhancement failed' }, { status: 500 });
  }
}
