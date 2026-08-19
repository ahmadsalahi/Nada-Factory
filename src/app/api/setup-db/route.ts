import { neon } from '@neondatabase/serverless';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const sql = neon(process.env.DATABASE_URL!);
    await sql`
      CREATE TABLE IF NOT EXISTS inbox (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        phone VARCHAR(50) NOT NULL,
        service VARCHAR(255),
        message TEXT,
        status VARCHAR(20) DEFAULT 'unread',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `;
    return NextResponse.json({ success: true, message: 'Table created' });
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}
