import { neon } from '@neondatabase/serverless';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const sql = neon(process.env.DATABASE_URL!);
    const projects = await sql`SELECT * FROM projects ORDER BY order_index ASC, id DESC`;
    return NextResponse.json(projects);
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const sql = neon(process.env.DATABASE_URL!);
    const data = await request.json();
    
    // Auto-generate slug if empty
    const slug = data.slug || data.title_en.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    
    const result = await sql`
      INSERT INTO projects (slug, title_en, title_ar, desc_en, desc_ar, image_url)
      VALUES (${slug}, ${data.title_en}, ${data.title_ar}, ${data.desc_en}, ${data.desc_ar}, ${data.image_url})
      RETURNING *
    `;
    
    return NextResponse.json(result[0]);
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}
