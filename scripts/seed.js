const fs = require("fs");
const path = require("path");
const { Client } = require("pg");
const bcrypt = require("bcryptjs");

const envPath = path.join(__dirname, "..", ".env");
for (const line of fs.readFileSync(envPath, "utf-8").split("\n")) {
  const match = line.match(/^([A-Z_]+)=(.*)$/);
  if (match) {
    const [, key, rawValue] = match;
    process.env[key] = rawValue.trim().replace(/^"(.*)"$/, "$1");
  }
}

const ADMIN_EMAIL = "admin@rederm.pk";
const ADMIN_PASSWORD = "Admin@12345";

async function run() {
  const client = new Client({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false },
  });
  await client.connect();

  const adminHash = await bcrypt.hash(ADMIN_PASSWORD, 10);
  await client.query(
    `INSERT INTO admin_users (name, email, password_hash, role)
     VALUES ($1, $2, $3, 'superadmin')
     ON CONFLICT (email) DO UPDATE SET password_hash = EXCLUDED.password_hash`,
    ["PAD Super Admin", ADMIN_EMAIL, adminHash]
  );
  console.log(`Admin seeded: ${ADMIN_EMAIL} / ${ADMIN_PASSWORD}`);

  // Approve the existing test registration (if present) so the full member flow can be tested.
  const memberPassword = "Member@12345";
  const memberHash = await bcrypt.hash(memberPassword, 10);
  const res = await client.query(
    `UPDATE registrations
     SET status = 'approved', approved_at = now(), password_hash = $1,
         membership_number = COALESCE(membership_number, 'PAD-2026-00001')
     WHERE email = 'ayesha.siddiqui.test@example.com'
     RETURNING id, email, membership_number`,
    [memberHash]
  );
  if (res.rows.length) {
    console.log(`Test member approved: ${res.rows[0].email} / ${memberPassword} (membership ${res.rows[0].membership_number})`);
  } else {
    console.log("No test registration found to approve (skipped).");
  }

  await client.end();
}

run().catch((err) => {
  console.error("Seed failed:", err);
  process.exit(1);
});
