import { put } from '@vercel/blob';
import { NextResponse } from 'next/server';

export async function POST(request: Request): Promise<NextResponse> {
  try {
    const { searchParams } = new URL(request.url);
    const filename = searchParams.get('filename') || 'uploaded_image';

    // Check if the user has provided the real BLOB token yet
    const token = process.env.BLOB_READ_WRITE_TOKEN;
    if (!token || token.includes('placeholder')) {
      // Return a fake successful response with a placeholder image for testing UI
      return NextResponse.json({ url: 'https://via.placeholder.com/800x600?text=Placeholder+Image+(Add+Vercel+Blob+Token)' });
    }

    const blob = await put(filename, request.body!, {
      access: 'public',
      addRandomSuffix: true,
    });

    return NextResponse.json(blob);
  } catch (error: any) {
    console.error("Upload error details:", error);
    if (String(error).includes("Cannot use public access on a private store")) {
      return NextResponse.json({ error: "Your Vercel Blob store is Private. Please create a new Public store in Vercel." }, { status: 400 });
    }
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}
