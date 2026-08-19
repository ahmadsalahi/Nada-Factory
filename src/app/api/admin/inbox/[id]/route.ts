import { neon } from '@neondatabase/serverless';
import { NextResponse } from 'next/server';

export async function PUT(request: Request, props: { params: Promise<{ id: string }> }) {
  try {
    const params = await props.params;
    const { status } = await request.json();
    const sql = neon(process.env.DATABASE_URL!);
    
    await sql`UPDATE inbox SET status = ${status} WHERE id = ${params.id}`;
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}

export async function DELETE(request: Request, props: { params: Promise<{ id: string }> }) {
  try {
    const params = await props.params;
    const sql = neon(process.env.DATABASE_URL!);
    await sql`DELETE FROM inbox WHERE id = ${params.id}`;
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}
