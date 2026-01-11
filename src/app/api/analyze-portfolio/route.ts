
import { GoogleGenerativeAI } from '@google/generative-ai';
import { NextResponse } from 'next/server';
import { generateContentWithFallback } from '@/lib/ai-helper';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

export async function POST(req: Request) {
  try {
    const { imageUrls, profile, careerGoals } = await req.json();

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
      You are an expert fashion editor and casting director. 
      I am providing you with ${validImages.length} images from a model's portfolio.
      
      Model Profile:
      Name: ${profile.name}
      Bio: ${profile.description || 'N/A'}
      
      CAREER GOALS: "${careerGoals || 'General Modeling'}"

      TASK:
      1. Select the SINGLE BEST "Front Image" (headshot or strong editorial/commercial opener) that best aligns with the Career Goals.
      2. Select 4 "Back Images" that show versatility and support the career goals.
      3. Recommend the best 'frontLayout' ('classic', 'modern', 'minimal') and 'backLayout' ('grid', 'masonry', 'triptych', 'agency', 'focus', 'band', 'quad').
      
      OUTPUT FORMAT:
      Return ONLY a JSON object with the indices (0-based) of the selected images AND the layout choices.
      Example: { "frontIndex": 2, "backIndices": [0, 4, 1, 5], "frontLayout": "modern", "backLayout": "agency" }
    `;

    // Use fallback helper
    const text = await generateContentWithFallback(genAI, prompt, validImages);
    
    // Clean markdown if present
    const cleanText = text.replace(/```json/g, '').replace(/```/g, '').trim();
    const selection = JSON.parse(cleanText);

    return NextResponse.json(selection);

  } catch (error) {
    console.error('AI Analysis Error:', error);
    return NextResponse.json({ error: 'Analysis failed' }, { status: 500 });
  }
}
