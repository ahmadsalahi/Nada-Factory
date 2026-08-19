import { neon } from '@neondatabase/serverless';
import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';

export async function GET() {
  try {
    const sql = neon(process.env.DATABASE_URL!);
    
    // Default admin details
    const email = 'ahmadsalahi1996@gmail.com';
    const password = 'admin123';
    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(password, salt);
    
    await sql`
      INSERT INTO settings (key, value) VALUES 
      ('admin_email', ${email}),
      ('admin_password_hash', ${hash})
      ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value;
    `;
    
    return NextResponse.json({ success: true, message: 'Admin auth configured successfully' });
  } catch (error) {
    console.error("Setup error:", error);
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}
