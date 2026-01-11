
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
      You are a Seasoned Professional Portfolio Curator with decades of experience in high-fashion and commercial modeling.
      Your goal is to transform this raw collection of photos into a cohesive, high-impact visual narrative that tells a story.
      
      You are not just analyzing valid pixels; you are crafting a brand.
      
      INPUT DATA:
      - Model Profile: ${JSON.stringify(profile)}
      - Current Layout Settings: ${JSON.stringify(settings)}
      - Image Count: ${validImages.length} images provided.

      YOUR CURATION TASK:
      1. **Theme Development**: Analyze the content, lighting, and mood of the photos. Synthesize them into a "Big Picture Theme" (e.g., "Urban Ethereal", "90s Minimalism", "Commercial Warmth").
      2. **Layout Strategy**: "Think Ahead" about the best presentation. 
         - Should the Hero image be Full Screen ('full') for drama, or Standard ('standard')?
         - Should the Bio be prominent ('sticky') or subtle?
         - Would a 'timeline' layout work better than a 'grid'?
         - Is the current 'masonry' or 'bento' grid optimal?
      3. **Vibe Check**: Write a positive, exciting summary that makes the model feel inspired about this potential design.
      4. **Critical Eye**: Identify duplicates (0-based indices).
      5. **Star Power**: Select:
         - The HERO image (best cover shot).
         - High Impact images for grid highlights.

      OUTPUT FORMAT (JSON Only):
      {
        "summary": "Your exciting, inspiring pitch of the curated vision.",
        "theme": "The Big Picture Theme Name",
        "imageQuality": {
          "status": "excellent" | "good" | "needs_work",
          "details": "Professional critique of lighting/composition.",
          "upscaleRecommendation": ["string"]
        },
        "duplicateIndices": [number],
        "layoutSuggestions": [
           "Specific advice on Hero Style (Full vs Standard).",
           "Specific advice on Layout (Grid vs Masonry vs Timeline).",
           "Specific advice on Bio presentation."
        ],
        "careerAlignment": "How this specific curation targets their career goals:",
        "suggestedAutomations": {
           "heroIndex": number,
           "highlightIndices": [number],
           "rationale": "Why these specific images anchor the theme."
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
