import { handleUpload, type HandleUploadBody } from '@vercel/blob/client';
import { NextResponse } from 'next/server';
// Removed unused firebase-admin imports to force rebuild

export async function POST(request: Request): Promise<NextResponse> {
  const body = (await request.json()) as HandleUploadBody;
  
  try {
    const jsonResponse = await handleUpload({
      body,
      request,
      onBeforeGenerateToken: async (pathname, clientPayload) => {
        // 1. Authenticate User (Supabase)
        const { searchParams } = new URL(request.url);
        const token = searchParams.get('auth');
        
        if (!token) throw new Error('Unauthorized: No token');

        // Verify Supabase Token
        // using a temporary client or fetch
        const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
        const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
        
        // We verify by asking Supabase "who is this?"
        const authRes = await fetch(`${supabaseUrl}/auth/v1/user`, {
            headers: {
                Authorization: `Bearer ${token}`,
                apikey: supabaseKey
            }
        });
        
        if (!authRes.ok) {
            console.error("Supabase Auth Failed:", await authRes.text());
            throw new Error('Unauthorized: Invalid Token');
        }
        
        const { id: userId } = await authRes.json();
        
        // 2. Validate Payload
        if (!clientPayload) throw new Error('Missing payload');
        const { imageHash, contentType } = JSON.parse(clientPayload);

        return {
          allowedContentTypes: ['image/jpeg', 'image/png', 'image/webp', 'image/gif'],
          tokenPayload: JSON.stringify({
            userId,
            imageHash,
            contentType,
          }),
        };
      },
      // In development, we use client-side indexing to avoid "callbackUrl" errors.
      // In production, we can enable this if needed, but client-side is faster for UI.
      onUploadCompleted: async ({ blob, tokenPayload }) => {
        // Optional: Server-side logging or indexing
        if (tokenPayload) {
             const { userId } = JSON.parse(tokenPayload);
             console.log(`Upload completed for user ${userId}: ${blob.url}`);
        }
      },
    });

    return NextResponse.json(jsonResponse);
  } catch (error) {
    console.error("Vercel Blob/Auth Error:", error);
    return NextResponse.json(
      { error: (error as Error).message },
      { status: 400 }, // The webhook will retry 5 times automatically
    );
  }
}
