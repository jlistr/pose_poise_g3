import { list, del } from '@vercel/blob';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  try {
    const { blobs } = await list({
        token: process.env.BLOB_READ_WRITE_TOKEN
    });
    return NextResponse.json(blobs);
  } catch (error) {
    return NextResponse.json(
      { error: (error as Error).message },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  const { searchParams } = new URL(request.url);
  const urlToDelete = searchParams.get('url');

  if (!urlToDelete) {
    return NextResponse.json({ error: 'Missing url parameter' }, { status: 400 });
  }

  try {
    await del(urlToDelete, {
        token: process.env.BLOB_READ_WRITE_TOKEN
    });
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { error: (error as Error).message },
      { status: 500 }
    );
  }
}
