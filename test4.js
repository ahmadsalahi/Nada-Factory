require('dotenv').config({path: '.env.local'});
const { neon } = require('@neondatabase/serverless');
const sql = neon(process.env.DATABASE_URL);
async function run() {
  const res = await sql`SELECT project_id, COUNT(*) as count FROM gallery GROUP BY project_id`;
  console.log('Gallery counts:', res);
}
run();
