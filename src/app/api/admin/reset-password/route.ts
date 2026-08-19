import { NextResponse } from 'next/server';
import { neon } from '@neondatabase/serverless';
import bcrypt from 'bcryptjs';

export async function POST(request: Request) {
  try {
    const { otp, newPassword } = await request.json();
    const sql = neon(process.env.DATABASE_URL!);
    
    // Fetch OTP and Expiry
    const settingsRes = await sql`SELECT key, value FROM settings WHERE key IN ('admin_reset_otp', 'admin_reset_expiry')`;
    const settings = settingsRes.reduce((acc: any, row) => {
      acc[row.key] = row.value;
      return acc;
    }, {});

    const validOtp = settings.admin_reset_otp;
    const expiry = new Date(settings.admin_reset_expiry);

    if (!validOtp || new Date() > expiry) {
      return NextResponse.json({ error: 'Reset code has expired or is invalid.' }, { status: 401 });
    }

    if (otp !== validOtp) {
      return NextResponse.json({ error: 'Invalid reset code.' }, { status: 401 });
    }

    // Success! Update password
    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(newPassword, salt);
    
    await sql`
      INSERT INTO settings (key, value) VALUES ('admin_password_hash', ${hash})
      ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value;
    `;

    // Clear reset OTP from DB
    await sql`UPDATE settings SET value = NULL WHERE key IN ('admin_reset_otp', 'admin_reset_expiry')`;

    return NextResponse.json({ success: true });

  } catch (error) {
    console.error("Password Reset Error:", error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
