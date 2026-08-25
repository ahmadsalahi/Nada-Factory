require('dotenv').config({path: '.env.local'});
const { neon } = require('@neondatabase/serverless');
const sql = neon(process.env.DATABASE_URL);
async function run() {
  const res = await sql`SELECT id, slug, title_en FROM projects`;
  console.log('Projects:', res);
}
run();
