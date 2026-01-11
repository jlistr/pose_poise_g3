import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

export async function POST(req: NextRequest) {
  try {
    const apiKey = process.env.GEMINI_API_KEY;
    
    if (!apiKey) {
        console.error('SERVER ERROR: GEMINI_API_KEY is not set in environment variables.');
        return NextResponse.json(
          { error: 'Server configuration error: Missing API Key' },
          { status: 500 }
        );
    }
    
    const genAI = new GoogleGenerativeAI(apiKey);
    const { name, aesthetic, description, careerGoals } = await req.json();

    const prompt = `
      Act as a high-end luxury fashion branding consultant.
      Suggest 6 unique, available-sounding, and premium domain names for a model/creative professional's portfolio website.

      User Profile:
      - Name: ${name}
      - Aesthetic/Vibe: ${aesthetic || 'Editorial'}
      - Description: ${description || 'Professional Model'}
      - Goals: ${careerGoals || 'Fashion, Runway, Print'}

      CREATIVE DIRECTION:
      The user wants domain names that feel like a "Digital Signature" tailored to their specific vibe.
      Do NOT strictly follow generic formulas like "FirstNameLastName.com" unless it fits their vibe perfectly.
      "Loosen up" the suggestions to include creative, evocative, and stylistic options that reflect their personal brand data (Vibes, Goals).

      SUGGESTION STRATEGIES (Mix & Match):
      1. THE VIBE-DRIVEN BRAND: Use their aesthetic (e.g. if 'Dark/Gothic', suggest names like '[Name]Noir.com' or 'The[Name]Archive.com'). 
      2. THE INDUSTRY STANDARD: Modern variations like [Name].fashion, [Name].model, [Name].agency.
      3. THE CREATIVE PORTFOLIO: [Name]Book.com, [Name]Folio.studio, [Name]Visuals.com.
      4. THE AUTHORITY: Official[Name].com (Only if it fits a commercial vibe).
      5. ABSTRACT/ARTISTIC: Use initials or middle names with creative suffixes (e.g. [Initials].studio, [Name]Lab.com).

      Rules:
      1. ENSURE at least 3 suggestions directly incorporate the model's professional name (${name}).
      2. PRIORITY: Reflect the 'Aesthetic/Vibe' provided in the naming style.
      3. Use premium TLDs like .com, .studio, .model, .fashion, .agency, .art.
      4. Keep them short (under 20 chars).
      5. Return ONLY a raw JSON array of strings, e.g. ["name.studio", "the-name.com"].
      6. Do not include markdown formatting or explanations.
    `;

    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" }); // Fast & Cheap for text
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    // Clean markdown if present
    const cleanText = text.replace(/```json/g, '').replace(/```/g, '').trim();
    const suggestions = JSON.parse(cleanText);

    return NextResponse.json({ suggestions });
  } catch (error) {
    console.error('Domain suggestion error:', error);
    return NextResponse.json({ error: 'Failed to generate suggestions' }, { status: 500 });
  }
}
