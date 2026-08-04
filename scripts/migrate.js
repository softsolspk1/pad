const fs = require("fs");
const path = require("path");
const { Client } = require("pg");

// Minimal .env loader (no extra dependency needed for this one-off script)
const envPath = path.join(__dirname, "..", ".env");
for (const line of fs.readFileSync(envPath, "utf-8").split("\n")) {
  const match = line.match(/^([A-Z_]+)=(.*)$/);
  if (match) {
    const [, key, rawValue] = match;
    process.env[key] = rawValue.trim().replace(/^"(.*)"$/, "$1");
  }
}

async function run() {
  const client = new Client({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false },
  });
  await client.connect();

  const sql = fs.readFileSync(path.join(__dirname, "..", "sql", "schema.sql"), "utf-8");
  await client.query(sql);

  console.log("Migration applied successfully.");
  await client.end();
}

run().catch((err) => {
  console.error("Migration failed:", err);
  process.exit(1);
});
