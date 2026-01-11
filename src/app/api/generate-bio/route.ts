
import { GoogleGenerativeAI } from '@google/generative-ai';
import { NextResponse } from 'next/server';
import { generateContentWithFallback } from '@/lib/ai-helper';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

export async function POST(req: Request) {
  try {
    const { imageUrls, profile } = await req.json();

    if (!process.env.GEMINI_API_KEY) {
        return NextResponse.json({ error: 'Missing API Key' }, { status: 500 });
    }

    if (!imageUrls || imageUrls.length === 0) {
      // Logic for generation without images? Or fail? The request says "analyzing their images".
      // We can try with just profile if images fail, but let's assume images are needed for the "story".
       return NextResponse.json({ error: 'No images provided' }, { status: 400 });
    }



    // Fetch images limited to 5-10 to avoid payload issues
    const validUrls = imageUrls.slice(0, 8); 
    
    // Helper to fetch image buffer
    const imageParts = await Promise.all(
      validUrls.map(async (url: string) => {
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
    
    const validImages = imageParts.filter(p => p !== null);

    const prompt = `
      You are a professional fashion biographer and copywriter.
      
      MODEL STATS:
      Name: ${profile.name}
      Height: ${profile.height}
      Hair: ${profile.hairColor}
      Eyes: ${profile.eyeColor}
      Vibe: based on the attached portfolio images.

      TASK:
      Write a compelling, professional 1-paragraph "About Me" / "Professional Bio" for this model.
      - Analyze the visual style of the provided images (e.g., editorial, commercial, edgy, soft).
      - Incorporate their physical stats subtly if relevant to their look (e.g., "Standing tall at 5'10...").
      - The tone should be industry-standard but engaging.
      - Keep it under 80 words.
      - Do NOT use flowery or cringey language. Keep it "Quiet Luxury" and professional.

      OUTPUT:
      Return ONLY the text of the bio. No JSON, no markdown code blocks.
    `;

    // Use fallback helper
    const text = await generateContentWithFallback(genAI, prompt, validImages);
    
    return NextResponse.json({ bio: text.trim() });

  } catch (error: any) {
    console.error('AI Bio Gen Error:', error);
    const msg = error.message || 'Generation failed';
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
