import { neon } from '@neondatabase/serverless';
import { NextResponse } from 'next/server';

export async function DELETE(request: Request, props: { params: Promise<{ id: string }> }) {
  try {
    const params = await props.params;
    const sql = neon(process.env.DATABASE_URL!);
    await sql`DELETE FROM projects WHERE id = ${params.id}`;
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}

export async function PUT(request: Request, props: { params: Promise<{ id: string }> }) {
  try {
    const params = await props.params;
    const data = await request.json();
    const sql = neon(process.env.DATABASE_URL!);
    
    const result = await sql`
      UPDATE projects 
      SET 
        title_en = ${data.title_en}, 
        title_ar = ${data.title_ar}, 
        desc_en = ${data.desc_en}, 
        desc_ar = ${data.desc_ar}, 
        image_url = ${data.image_url}
      WHERE id = ${params.id}
      RETURNING *
    `;
    
    return NextResponse.json(result[0]);
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}
