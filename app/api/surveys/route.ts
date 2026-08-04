import { NextRequest, NextResponse } from "next/server";
import { pool } from "@/lib/db";
import { requireMember, requireAdmin } from "@/lib/auth";

export async function GET(req: NextRequest) {
  const member = await requireMember(req);
  const admin = member ? null : await requireAdmin(req);
  if (!member && !admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const surveys = await pool.query(
    `SELECT id, title, description, is_active, created_at FROM surveys ORDER BY created_at DESC`
  );

  const results = [];
  for (const survey of surveys.rows) {
    const options = await pool.query(
      `SELECT o.id, o.option_text, (SELECT COUNT(*) FROM survey_votes v WHERE v.option_id = o.id) AS vote_count
       FROM survey_options o WHERE o.survey_id = $1 ORDER BY o.id ASC`,
      [survey.id]
    );
    let myVote = null;
    if (member) {
      const voted = await pool.query(
        `SELECT option_id FROM survey_votes WHERE survey_id = $1 AND member_id = $2`,
        [survey.id, member.id]
      );
      myVote = voted.rows[0]?.option_id ?? null;
    }
    results.push({ ...survey, options: options.rows, myVote });
  }

  return NextResponse.json(results);
}

export async function POST(req: NextRequest) {
  const session = await requireAdmin(req);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { title, description, options } = await req.json();
  if (!title || !Array.isArray(options) || options.length < 2) {
    return NextResponse.json({ error: "Title and at least 2 options are required" }, { status: 400 });
  }

  const client = await pool.connect();
  try {
    await client.query("BEGIN");
    const survey = await client.query(
      `INSERT INTO surveys (title, description) VALUES ($1, $2) RETURNING id`,
      [title, description || null]
    );
    for (const opt of options) {
      await client.query(`INSERT INTO survey_options (survey_id, option_text) VALUES ($1, $2)`, [
        survey.rows[0].id,
        opt,
      ]);
    }
    await client.query("COMMIT");
    return NextResponse.json({ id: survey.rows[0].id }, { status: 201 });
  } catch (err) {
    await client.query("ROLLBACK");
    console.error("Survey creation failed:", err);
    return NextResponse.json({ error: "Failed to create survey" }, { status: 500 });
  } finally {
    client.release();
  }
}
