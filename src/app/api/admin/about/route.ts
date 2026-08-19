import { neon } from '@neondatabase/serverless';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const sql = neon(process.env.DATABASE_URL!);
    const images = await sql`SELECT * FROM about_images ORDER BY order_index ASC, id DESC`;
    return NextResponse.json(images);
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const sql = neon(process.env.DATABASE_URL!);
    const data = await request.json();
    const result = await sql`
      INSERT INTO about_images (image_url)
      VALUES (${data.image_url})
      RETURNING *
    `;
    return NextResponse.json(result[0]);
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}
