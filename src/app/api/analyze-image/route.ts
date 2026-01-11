import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

export const maxDuration = 60; // Allow longer timeout for vision analysis

export async function POST(req: NextRequest) {
  try {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      console.error('SERVER ERROR: GEMINI_API_KEY is missing.');
      return NextResponse.json(
        { error: 'Server configuration error: Missing API Key' },
        { status: 500 }
      );
    }

    const { imageUrl, imageBase64 } = await req.json();

    if (!imageUrl && !imageBase64) {
      return NextResponse.json({ error: 'Image URL or Base64 is required' }, { status: 400 });
    }

    // Initialize Gemini
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

    // Prepare image payload
    let imagePart;

    if (imageBase64) {
         // Client sent base64 directly
         const base64Data = imageBase64.replace(/^data:image\/\w+;base64,/, "");
         imagePart = {
            inlineData: {
                data: base64Data,
                mimeType: "image/jpeg"
            }
         };
    } else {
        // Fetch public URL and convert
        const imageResp = await fetch(imageUrl);
        if (!imageResp.ok) throw new Error(`Failed to fetch image: ${imageResp.statusText}`);
        const arrayBuffer = await imageResp.arrayBuffer();
        const base64Image = Buffer.from(arrayBuffer).toString('base64');
        imagePart = {
            inlineData: {
                data: base64Image,
                mimeType: imageResp.headers.get('content-type') || 'image/jpeg'
            }
        };
    }
    
    const prompt = `
      Analyze this fashion image closely, identifying apparel type (e.g. Swimwear, Activewear), setting, and overall style.
      
      YOUR TASKS:
      1. Vibe Tags: Return exactly 5 single-word tags. 
         PRIORITY TAGS (Select these if they apply): Swim, Active Wear, Bridal, Editorial, Commercial, Lifestyle, High Fashion, Beauty, Runway.
         Fill the rest with highly descriptive stylistic words (e.g. Minimalist, Vintage, Noir, Summer, Golden).
      
      2. Suggested Name: Create a 2-3 word creative, stylistic name for a collection based on this image (e.g. "Sun-Drenched Swim", "Street Noir", "Minimalist Studio").

      Return ONLY a raw JSON object:
      {
        "vibes": ["Tag1", "Tag2", "Tag3", "Tag4", "Tag5"],
        "suggestedName": "Creative Name Here"
      }
      Do not include markdown formatting or explanations.
    `;

    const result = await model.generateContent([
      prompt,
      imagePart
    ]);

    const response = await result.response;
    const text = response.text();
    console.log('Gemini Vision response:', text);

    const cleanText = text.replace(/```json/g, '').replace(/```/g, '').trim();
    let vibes: string[] = [];
    let suggestedName = '';
    
    try {
        const parsed = JSON.parse(cleanText);
        vibes = parsed.vibes || [];
        suggestedName = parsed.suggestedName || '';
    } catch (e) {
        console.error('Failed to parse analysis JSON:', cleanText);
    }

    return NextResponse.json({ vibes, suggestedName });

  } catch (error: any) {
    console.error('Image analysis error:', error);
    return NextResponse.json({ error: 'Failed to analyze image', details: error.message }, { status: 500 });
  }
}
