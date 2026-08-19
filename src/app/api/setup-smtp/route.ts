import { neon } from '@neondatabase/serverless';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const sql = neon(process.env.DATABASE_URL!);
    await sql`
      INSERT INTO settings (key, value) VALUES 
      ('smtp_email', 'ahmadsalahi1996@gmail.com'),
      ('smtp_password', 'tvevtqzvagrosusm') -- removing spaces from app password just in case
      ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value;
    `;
    return NextResponse.json({ success: true, message: 'SMTP configured' });
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}
