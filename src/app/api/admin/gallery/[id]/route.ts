import { neon } from '@neondatabase/serverless';
import { NextResponse } from 'next/server';

export async function DELETE(request: Request, props: { params: Promise<{ id: string }> }) {
  try {
    const params = await props.params;
    const sql = neon(process.env.DATABASE_URL!);
    
    await sql`DELETE FROM gallery WHERE id = ${params.id}`;
    
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
      UPDATE gallery 
      SET project_id = ${data.project_id}
      WHERE id = ${params.id}
      RETURNING *
    `;
    
    return NextResponse.json(result[0]);
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}
