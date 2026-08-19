const { neon } = require('@neondatabase/serverless');
require('dotenv').config({ path: '.env.local' });
const sql = neon(process.env.DATABASE_URL);

async function setup() {
  await sql`
    INSERT INTO settings (key, value) VALUES 
    ('smtp_email', 'ahmadsalahi1996@gmail.com'),
    ('smtp_password', 'tvev tqzv agro susm')
    ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value;
  `;
  console.log('SMTP settings saved to DB');
}
setup().catch(console.error);
