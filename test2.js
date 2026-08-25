require('dotenv').config({path: '.env.local'});
const { neon } = require('@neondatabase/serverless');
const sql = neon(process.env.DATABASE_URL);
async function run() {
  const res = await sql`SELECT * FROM gallery`;
  console.log('Total gallery images:', res.length);
}
run();
