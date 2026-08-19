import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { neon } from '@neondatabase/serverless';
import bcrypt from 'bcryptjs';

export async function POST(request: Request) {
  try {
    const cookieStore = await cookies();
    if (cookieStore.get('admin_token')?.value !== 'authenticated') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { newEmail, newPassword } = await request.json();
    const sql = neon(process.env.DATABASE_URL!);

    if (newEmail) {
      await sql`
        INSERT INTO settings (key, value) VALUES ('admin_email', ${newEmail})
        ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value;
      `;
    }

    if (newPassword) {
      const salt = bcrypt.genSaltSync(10);
      const hash = bcrypt.hashSync(newPassword, salt);
      await sql`
        INSERT INTO settings (key, value) VALUES ('admin_password_hash', ${hash})
        ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value;
      `;
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Change Credentials Error:", error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
