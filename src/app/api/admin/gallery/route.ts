import { neon } from '@neondatabase/serverless';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  try {
    const sql = neon(process.env.DATABASE_URL!);
    
    // Auto-create table if not exists
    await sql`
      CREATE TABLE IF NOT EXISTS gallery (
        id SERIAL PRIMARY KEY,
        image_url TEXT NOT NULL,
        project_id INTEGER REFERENCES projects(id) ON DELETE CASCADE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `;

    // Fetch all gallery images, joining with projects to get project titles
    const result = await sql`
      SELECT g.*, p.title_en as project_title_en, p.title_ar as project_title_ar 
      FROM gallery g
      LEFT JOIN projects p ON g.project_id = p.id
      ORDER BY g.created_at DESC
    `;
    
    return NextResponse.json(result);
  } catch (error) {
    console.error("GET Gallery Error:", error);
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const sql = neon(process.env.DATABASE_URL!);
    const data = await request.json();
    
    const result = await sql`
      INSERT INTO gallery (image_url, project_id)
      VALUES (${data.image_url}, ${data.project_id})
      RETURNING *
    `;
    
    return NextResponse.json(result[0]);
  } catch (error) {
    console.error("POST Gallery Error:", error);
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}
