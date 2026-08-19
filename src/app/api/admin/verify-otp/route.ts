import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { neon } from '@neondatabase/serverless';

export async function POST(request: Request) {
  try {
    const { otp, trustDevice } = await request.json();
    const cookieStore = await cookies();
    
    // Ensure they passed step 1
    if (!cookieStore.get('pending_2fa')?.value) {
      return NextResponse.json({ error: 'Session expired, please login again' }, { status: 401 });
    }

    const sql = neon(process.env.DATABASE_URL!);
    
    // Fetch OTP and Expiry
    const settingsRes = await sql`SELECT key, value FROM settings WHERE key IN ('admin_otp', 'admin_otp_expiry')`;
    const settings = settingsRes.reduce((acc: any, row) => {
      acc[row.key] = row.value;
      return acc;
    }, {});

    const validOtp = settings.admin_otp;
    const expiry = new Date(settings.admin_otp_expiry);

    if (!validOtp || new Date() > expiry) {
      return NextResponse.json({ error: 'OTP has expired' }, { status: 401 });
    }

    if (otp !== validOtp) {
      return NextResponse.json({ error: 'Invalid OTP' }, { status: 401 });
    }

    // Success! Clear OTP from DB
    await sql`UPDATE settings SET value = NULL WHERE key IN ('admin_otp', 'admin_otp_expiry')`;

    // Clear pending_2fa
    cookieStore.delete('pending_2fa');

    // Issue auth token
    cookieStore.set('admin_token', 'authenticated', { 
      httpOnly: true, 
      secure: process.env.NODE_ENV === 'production', 
      path: '/' 
    });

    // Handle Trust Device
    if (trustDevice) {
      cookieStore.set('trusted_device', 'true', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        path: '/',
        maxAge: 30 * 24 * 60 * 60 // 30 days
      });
    }

    return NextResponse.json({ success: true });

  } catch (error) {
    console.error("OTP Verification Error:", error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
