import { NextResponse } from 'next/server';
import { neon } from '@neondatabase/serverless';
import nodemailer from 'nodemailer';

export async function POST(request: Request) {
  try {
    const { email } = await request.json();
    const sql = neon(process.env.DATABASE_URL!);
    
    // Fetch settings
    const settingsRes = await sql`SELECT key, value FROM settings WHERE key IN ('admin_email', 'smtp_email', 'smtp_password')`;
    const settings = settingsRes.reduce((acc: any, row) => {
      acc[row.key] = row.value;
      return acc;
    }, {});

    if (email !== settings.admin_email) {
      // Don't reveal if email exists, just return success
      return NextResponse.json({ success: true });
    }

    // Generate reset OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString(); 
    const expiry = new Date(Date.now() + 15 * 60 * 1000).toISOString(); // 15 mins

    // Save OTP
    await sql`
      INSERT INTO settings (key, value) VALUES 
      ('admin_reset_otp', ${otp}),
      ('admin_reset_expiry', ${expiry})
      ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value;
    `;

    const smtpEmail = settings.smtp_email || process.env.SMTP_EMAIL;
    const smtpPassword = settings.smtp_password || process.env.SMTP_PASSWORD;

    if (smtpEmail && smtpPassword) {
      const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: { user: smtpEmail, pass: smtpPassword },
      });

      await transporter.sendMail({
        from: smtpEmail,
        to: settings.admin_email,
        subject: 'Password Reset OTP - Nada CMS',
        html: `
          <div style="font-family: Arial, sans-serif; text-align: center; padding: 20px;">
            <h2 style="color: #d4af37;">Nada CMS Password Reset</h2>
            <p>You requested a password reset. Use this OTP to reset your password. It expires in 15 minutes.</p>
            <h1 style="background: #f4f4f4; padding: 15px; letter-spacing: 5px; color: #111;">${otp}</h1>
            <p style="color: #888; font-size: 12px;">If you didn't request this, you can ignore this email.</p>
          </div>
        `
      });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
