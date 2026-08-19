import { neon } from '@neondatabase/serverless';
import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export async function POST(request: Request) {
  try {
    const data = await request.json();
    const { name, phone, service, message } = data;

    if (!name || !phone) {
      return NextResponse.json({ error: 'Name and phone are required' }, { status: 400 });
    }

    // 1. Save to Neon DB
    const sql = neon(process.env.DATABASE_URL!);
    await sql`
      INSERT INTO inbox (name, phone, service, message)
      VALUES (${name}, ${phone}, ${service || ''}, ${message || ''})
    `;

    // 2. Try to send email (fetch credentials from DB)
    const settingsRes = await sql`SELECT key, value FROM settings WHERE key IN ('smtp_email', 'smtp_password', 'email')`;
    const settings = settingsRes.reduce((acc: any, row) => {
      acc[row.key] = row.value;
      return acc;
    }, {});

    const smtpEmail = settings.smtp_email || process.env.SMTP_EMAIL;
    const smtpPassword = settings.smtp_password || process.env.SMTP_PASSWORD;
    const destinationEmail = settings.email || smtpEmail; // Uses company email if set, else falls back to sender

    if (smtpEmail && smtpPassword) {
      try {
        const transporter = nodemailer.createTransport({
          service: 'gmail', // Assuming Gmail for simplicity
          auth: {
            user: smtpEmail,
            pass: smtpPassword,
          },
        });

        const mailOptions = {
          from: smtpEmail,
          to: destinationEmail,
          subject: `✨ New Quote Request from ${name}`,
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #f9f9f9; border: 1px solid #e0e0e0; border-radius: 8px; overflow: hidden;">
              <!-- Header -->
              <div style="background-color: #1a1a1a; padding: 25px; text-align: center; border-bottom: 4px solid #d4af37;">
                <h2 style="color: #d4af37; margin: 0; font-size: 24px;">🌟 New Quote Request</h2>
                <p style="color: #ffffff; margin: 8px 0 0 0; font-size: 14px;">Nada Factory Website</p>
              </div>
              
              <!-- Body -->
              <div style="padding: 30px; background-color: #ffffff;">
                <p style="font-size: 16px; color: #333; margin-top: 0;">You have received a new inquiry from your website. Here are the details:</p>
                
                <table style="width: 100%; border-collapse: collapse; margin-top: 25px;">
                  <tr>
                    <td style="padding: 14px 10px; border-bottom: 1px solid #eee; width: 35%; font-weight: bold; color: #555;">👤 Full Name:</td>
                    <td style="padding: 14px 10px; border-bottom: 1px solid #eee; color: #222; font-weight: bold;">${name}</td>
                  </tr>
                  <tr>
                    <td style="padding: 14px 10px; border-bottom: 1px solid #eee; font-weight: bold; color: #555;">📱 Phone / WhatsApp:</td>
                    <td style="padding: 14px 10px; border-bottom: 1px solid #eee;">
                      <a href="https://wa.me/${phone.replace(/\D/g, '')}" style="color: #25D366; text-decoration: none; font-weight: bold; font-size: 16px;">
                        ${phone}
                      </a>
                    </td>
                  </tr>
                  <tr>
                    <td style="padding: 14px 10px; border-bottom: 1px solid #eee; font-weight: bold; color: #555;">🛠 Service Needed:</td>
                    <td style="padding: 14px 10px; border-bottom: 1px solid #eee;">
                      <span style="background-color: rgba(212, 175, 55, 0.15); color: #b8962e; padding: 6px 12px; border-radius: 4px; font-weight: bold;">
                        ${service || 'N/A'}
                      </span>
                    </td>
                  </tr>
                </table>

                <h3 style="color: #1a1a1a; margin-top: 35px; border-bottom: 2px solid #d4af37; padding-bottom: 8px; display: inline-block;">Message Details:</h3>
                <div style="background-color: #f8f9fa; padding: 20px; border-left: 4px solid #d4af37; border-radius: 4px; color: #444; white-space: pre-wrap; font-size: 15px; line-height: 1.6;">${message || 'No additional details provided.'}</div>
              </div>
              
              <!-- Footer -->
              <div style="background-color: #f1f1f1; padding: 20px; text-align: center; color: #888; font-size: 13px; border-top: 1px solid #e0e0e0;">
                This email was sent automatically from the Nada Factory CMS.
              </div>
            </div>
          `,
        };

        await transporter.sendMail(mailOptions);
        console.log("Email notification sent successfully.");
      } catch (emailError) {
        console.error("Failed to send email notification:", emailError);
      }
    } else {
      console.log("Skipping email: No SMTP credentials configured in DB or ENV.");
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Contact Form Error:", error);
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}
