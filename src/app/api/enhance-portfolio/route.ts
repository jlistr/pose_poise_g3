
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
      You are a Seasoned Professional Portfolio Curator (AI Agent) with a reputation for creating iconic, cohesive modeling portfolios.
      
      YOUR MISSION:
      "Take the wheel" and reorganize this model's entire image library into a stunning, professional portfolio.
      Do not just analyze; ACT. Group images into cohesive "Shoots" or "Collections", name them creatively, and select the best layout.
      
      INPUT DATA:
      - Model Profile: ${JSON.stringify(profile)}
      - Current Settings: ${JSON.stringify(settings)}
      - Total Image Count: ${validImages.length}
      
      YOUR CURATION PLAN:
      1. **Theme**: Define a "Big Picture Theme" (e.g., "Cinema Verité", "90s Supermodel"). 
      2. **Collections (Crucial)**: 
         - Group the valid images into 1-4 distinct "Shoots" or "Sets". 
         - Name each set creatively (e.g., "Studio Noir", "Golden Hour", "Editorial Print"). 
         - Assign specific images (by 0-based index) to each set. 
         - *Every good image should be used. Discard blurry/bad ones.*
      3. **Hero**: Pick the absolute single best photo index for the MAIN COVER (Hero).
      4. **Highlights**: Pick 2-5 indices that are "Standouts" to be highlighted (large) in the grid.
      5. **Bio**: Write a short, punchy, editorial-style bio line based on the vibe.

      OUTPUT FORMAT (JSON Only):
      {
        "theme": "String",
        "summary": "Your pitch to the model.",
        "curatedShoots": [
          {
            "name": "Creative Set Name",
            "imageIndices": [0, 1, 5], // 0-based indices from input list
            "vibes": ["Tags", "For", "Set"],
            "rationale": "Why these go together."
          }
        ],
        "highlightIndices": [2, 8],
        "heroIndex": 0,
        "bioSuggestion": "Editorial bio update",
        "imageQuality": {
          "status": "excellent" | "good" | "needs_work",
          "details": "Critique",
          "upscaleRecommendation": []
        }
      }
    `;

    // Use fallback helper
    const text = await generateContentWithFallback(genAI, prompt, validImages);
    
    // Clean markdown if present
    const cleanText = text.replace(/```json/g, '').replace(/```/g, '').trim();
    const result = JSON.parse(cleanText);

    // Map indices back to URLs for the frontend convenience
    // (Frontend needs URLs to reconstruct shoots)
    // We return both indices (for debug) and URLs (for action)
    const allUrls = imageUrls; // original list
    
    // Helper to separate mapped result
    const hydration = {
        ...result,
        heroUrl: allUrls[result.heroIndex],
        highlightedUrls: result.highlightIndices?.map((i: number) => allUrls[i]),
        curatedShoots: result.curatedShoots?.map((s: any) => ({
            ...s,
            images: s.imageIndices?.map((i: number) => allUrls[i])
        }))
    };

    return NextResponse.json(hydration);

  } catch (error) {
    console.error('Enhance Portfolio Error:', error);
    return NextResponse.json({ error: 'Enhancement failed' }, { status: 500 });
  }
}
