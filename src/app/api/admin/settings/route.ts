import { neon } from '@neondatabase/serverless';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const sql = neon(process.env.DATABASE_URL!);
    const result = await sql`SELECT * FROM settings`;
    
    // Convert array of {key, value} to an object {key: value}
    const settings = result.reduce((acc: any, row) => {
      acc[row.key] = row.value;
      return acc;
    }, {});
    
    return NextResponse.json(settings);
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json();
    const sql = neon(process.env.DATABASE_URL!);
    
    // Update each key-value pair in the database
    for (const [key, value] of Object.entries(data)) {
      if (typeof value === 'string') {
        await sql`
          INSERT INTO settings (key, value) 
          VALUES (${key}, ${value}) 
          ON CONFLICT (key) DO UPDATE SET value = ${value}
        `;
      }
    }
    
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}
