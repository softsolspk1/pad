const { Pool } = require('pg');
const fs = require('fs');

const pool = new Pool({
  connectionString: 'postgresql://neondb_owner:npg_BDxE3ewy6fTi@ep-royal-fog-ayrbjps5-pooler.c-5.us-east-2.aws.neon.tech/neondb?sslmode=require'
});

async function checkAdmins() {
  try {
    // Check if there is an 'admins' table or 'users' table
    const tablesRes = await pool.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
    `);
    
    let output = "Tables in Database:\n";
    output += JSON.stringify(tablesRes.rows, null, 2) + "\n\n";

    // If there's a table named 'admins', query it
    if (tablesRes.rows.some(r => r.table_name === 'admins')) {
       const adminsRes = await pool.query('SELECT * FROM admins LIMIT 5');
       output += "Admins Table:\n" + JSON.stringify(adminsRes.rows, null, 2);
    } 
    // If there's a 'users' table with a role column
    else if (tablesRes.rows.some(r => r.table_name === 'users')) {
       const usersRes = await pool.query("SELECT * FROM users WHERE role = 'admin' OR role = 'superadmin' LIMIT 5");
       output += "Admin Users in 'users' Table:\n" + JSON.stringify(usersRes.rows, null, 2);
    }

    fs.writeFileSync('db_admin_check.txt', output);
    console.log("Check complete. See db_admin_check.txt");
  } catch (err) {
    fs.writeFileSync('db_admin_check.txt', "Error: " + err.message);
  } finally {
    await pool.end();
  }
}

checkAdmins();
