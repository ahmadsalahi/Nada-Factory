import { neon } from '@neondatabase/serverless';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const sql = neon(process.env.DATABASE_URL!);
    
    // Create settings table (Hero, Contact, Socials)
    await sql`CREATE TABLE IF NOT EXISTS settings (
      key VARCHAR(255) PRIMARY KEY, 
      value TEXT
    )`;

    // Create projects table
    await sql`CREATE TABLE IF NOT EXISTS projects (
      id SERIAL PRIMARY KEY, 
      slug VARCHAR(255) UNIQUE, 
      title_en VARCHAR(255), 
      title_ar VARCHAR(255), 
      desc_en TEXT, 
      desc_ar TEXT, 
      image_url TEXT, 
      order_index INT DEFAULT 0
    )`;

    // Create about images table
    await sql`CREATE TABLE IF NOT EXISTS about_images (
      id SERIAL PRIMARY KEY, 
      image_url TEXT, 
      order_index INT DEFAULT 0
    )`;

    // Create stats table
    await sql`CREATE TABLE IF NOT EXISTS stats (
      id SERIAL PRIMARY KEY, 
      value VARCHAR(255), 
      label_en VARCHAR(255), 
      label_ar VARCHAR(255), 
      order_index INT DEFAULT 0
    )`;

    // Seed initial settings data to prevent empty states
    await sql`INSERT INTO settings (key, value) VALUES ('hero_title_en', 'Pioneering Metal Engineering & Architectural Solutions') ON CONFLICT (key) DO NOTHING`;
    await sql`INSERT INTO settings (key, value) VALUES ('hero_title_ar', 'رواد الهندسة المعدنية والحلول المعمارية') ON CONFLICT (key) DO NOTHING`;
    await sql`INSERT INTO settings (key, value) VALUES ('email', 'info@nadaindustries.com') ON CONFLICT (key) DO NOTHING`;
    await sql`INSERT INTO settings (key, value) VALUES ('phone', '+123 456 7890') ON CONFLICT (key) DO NOTHING`;

    return NextResponse.json({ message: 'Tables created and seeded successfully!' });
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}
