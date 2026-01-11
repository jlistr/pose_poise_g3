import { handleUpload, type HandleUploadBody } from '@vercel/blob/client';
import { NextResponse } from 'next/server';
import { auth, db } from '@/lib/firebase-admin';
import { FieldValue } from 'firebase-admin/firestore';

export async function POST(request: Request): Promise<NextResponse> {
  const body = (await request.json()) as HandleUploadBody;
  
  try {
    const jsonResponse = await handleUpload({
      body,
      request,
      onBeforeGenerateToken: async (pathname, clientPayload) => {
        // 1. Authenticate User
        const { searchParams } = new URL(request.url);
        const token = searchParams.get('auth');
        
        console.log("Upload Auth: Debug", {
            node_env: process.env.NODE_ENV,
            emulator_host: process.env.FIREBASE_AUTH_EMULATOR_HOST,
            has_token: !!token
        });

        if (!token) throw new Error('Unauthorized');

        // FORCE Emulator Host in Dev (Next.js isolation might hide the side-effect from firebase-admin.ts)
        if (process.env.NODE_ENV === 'development' && !process.env.FIREBASE_AUTH_EMULATOR_HOST) {
             process.env.FIREBASE_AUTH_EMULATOR_HOST = '127.0.0.1:9099';
        }
        
        const decodedToken = await auth.verifyIdToken(token);
        const userId = decodedToken.uid;
        
        // 2. Validate Payload
        if (!clientPayload) throw new Error('Missing payload');
        const { imageHash, contentType } = JSON.parse(clientPayload);

        // 3. Check Duplicates (Optional - simplified for now, or copy logic from Function)
        // For now, allow upload. Dupe check could be done here or in client.

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
      onUploadCompleted: process.env.NODE_ENV === 'development' 
        ? undefined 
        : async ({ blob, tokenPayload }) => {
        if (!tokenPayload) return;
        const { userId, imageHash, contentType } = JSON.parse(tokenPayload);

        try {
            const fileId = db.collection('users').doc().id;
            const downloadURL = blob.url;
            // ... strict server-side indexing ...
            // (Note: If client-side indexing is active, this might duplicate logic unless guarded)
            console.log('File uploaded (Server Callback):', fileId);
        } catch (error) {
            console.error('Error in server callback:', error);
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
