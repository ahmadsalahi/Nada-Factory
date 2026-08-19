import { neon } from '@neondatabase/serverless';
import { NextResponse } from 'next/server';

export async function PUT(request: Request) {
  try {
    const sql = neon(process.env.DATABASE_URL!);
    const { orderedIds } = await request.json();
    for (let i = 0; i < orderedIds.length; i++) {
      await sql`UPDATE about_images SET order_index =  WHERE id = `;
    }
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}
