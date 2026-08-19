const { neon } = require('@neondatabase/serverless');
require('dotenv').config({ path: '.env.local' });

async function run() {
  const sql = neon(process.env.DATABASE_URL);
  await sql`
    CREATE TABLE IF NOT EXISTS gallery (
      id SERIAL PRIMARY KEY, 
      image_url TEXT NOT NULL, 
      project_id INTEGER REFERENCES projects(id) ON DELETE CASCADE, 
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `;
  console.log('Table gallery created');
}
run().catch(console.error);
