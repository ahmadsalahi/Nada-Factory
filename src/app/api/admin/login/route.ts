import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { neon } from '@neondatabase/serverless';
import bcrypt from 'bcryptjs';
import nodemailer from 'nodemailer';

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();
    const sql = neon(process.env.DATABASE_URL!);
    
    // Fetch auth settings from DB
    const settingsRes = await sql`SELECT key, value FROM settings WHERE key IN ('admin_email', 'admin_password_hash', 'smtp_email', 'smtp_password')`;
    const settings = settingsRes.reduce((acc: any, row) => {
      acc[row.key] = row.value;
      return acc;
    }, {});

    const adminEmail = settings.admin_email;
    const adminHash = settings.admin_password_hash;

    if (!adminEmail || !adminHash) {
      return NextResponse.json({ error: 'Admin credentials not configured' }, { status: 500 });
    }

    // Verify Email & Password
    if (email !== adminEmail || !bcrypt.compareSync(password, adminHash)) {
      return NextResponse.json({ error: 'Invalid email or password' }, { status: 401 });
    }

    const cookieStore = await cookies();
    const trustedDevice = cookieStore.get('trusted_device')?.value;

    // If device is trusted, skip OTP
    if (trustedDevice === 'true') {
      cookieStore.set('admin_token', 'authenticated', { 
        httpOnly: true, 
        secure: process.env.NODE_ENV === 'production', 
        path: '/' 
      });
      return NextResponse.json({ success: true, requireOtp: false });
    }

    // Device not trusted, generate OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString(); // 6 digits
    const expiry = new Date(Date.now() + 10 * 60 * 1000).toISOString(); // 10 minutes from now

    // Save OTP to DB
    await sql`
      INSERT INTO settings (key, value) VALUES 
      ('admin_otp', ${otp}),
      ('admin_otp_expiry', ${expiry})
      ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value;
    `;

    // Send Email
    const smtpEmail = settings.smtp_email || process.env.SMTP_EMAIL;
    const smtpPassword = settings.smtp_password || process.env.SMTP_PASSWORD;

    if (smtpEmail && smtpPassword) {
      const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: { user: smtpEmail, pass: smtpPassword },
      });

      await transporter.sendMail({
        from: smtpEmail,
        to: adminEmail,
        subject: 'Your Admin Panel Login OTP',
        html: `
          <div style="font-family: Arial, sans-serif; text-align: center; padding: 20px;">
            <h2 style="color: #d4af37;">Nada CMS Admin Panel</h2>
            <p>You requested to log in. Please use the following One-Time Password (OTP) to proceed. It expires in 10 minutes.</p>
            <h1 style="background: #f4f4f4; padding: 15px; letter-spacing: 5px; color: #111;">${otp}</h1>
            <p style="color: #888; font-size: 12px;">If you didn't request this, please change your password immediately.</p>
          </div>
        `
      });
    } else {
      console.log('OTP generated but SMTP not configured. OTP is:', otp);
    }

    // Set a temporary cookie to track that they passed step 1
    cookieStore.set('pending_2fa', 'true', { 
      httpOnly: true, 
      secure: process.env.NODE_ENV === 'production', 
      path: '/',
      maxAge: 10 * 60 // 10 minutes
    });

    return NextResponse.json({ success: true, requireOtp: true });

  } catch (error) {
    console.error("Login Error:", error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
