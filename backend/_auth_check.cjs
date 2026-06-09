const { Pool } = require('pg');
require('dotenv').config();
const pool = new Pool({ connectionString: process.env.DATABASE_URL, connectionTimeoutMillis: 5000 });
(async () => {
  try {
    const client = await pool.connect();
    const users = await client.query("SELECT id, email, role, suspended FROM users");
    console.log("All users:", JSON.stringify(users.rows));
    const admin = await client.query("SELECT email, password_hash FROM users WHERE email='admin@internops.com'");
    console.log("Admin record:", JSON.stringify(admin.rows[0]));
    client.release();
  } catch (e) {
    console.error("DB error:", e.message);
  }
  pool.end();
  process.exit(0);
})();