const { neon } = require('@neondatabase/serverless');
require('dotenv').config({ path: '.env.local' });
const sql = neon(process.env.DATABASE_URL);

async function setup() {
  await sql`
    CREATE TABLE IF NOT EXISTS inbox (
      id SERIAL PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      phone VARCHAR(50) NOT NULL,
      service VARCHAR(255),
      message TEXT,
      status VARCHAR(20) DEFAULT 'unread',
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `;
  console.log('Inbox table created successfully');
}
setup().catch(console.error);
