const { Pool } = require('pg');

const pool = new Pool({
  connectionString: 'postgresql://neondb_owner:npg_BDxE3ewy6fTi@ep-royal-fog-ayrbjps5-pooler.c-5.us-east-2.aws.neon.tech/neondb?sslmode=require'
});

async function getMembers() {
  try {
    const res = await pool.query("SELECT id, full_name, email, pmdc_number, status FROM registrations WHERE status = 'approved'");
    console.log("Approved Members:");
    console.log(JSON.stringify(res.rows, null, 2));
    
    // Check if there are any members at all
    if (res.rows.length === 0) {
      const allRes = await pool.query("SELECT id, full_name, email, pmdc_number, status FROM registrations");
      console.log("\nAll Registered Users (including pending/rejected):");
      console.log(JSON.stringify(allRes.rows, null, 2));
    }
  } catch (err) {
    console.error("DB Error:", err);
  } finally {
    await pool.end();
  }
}

getMembers();
