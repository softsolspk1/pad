import { NextRequest, NextResponse } from "next/server";
import { pool } from "@/lib/db";
import { requireMember } from "@/lib/auth";

export async function GET(req: NextRequest) {
  const session = await requireMember(req);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const result = await pool.query(
    `SELECT t.id, t.title, t.content, t.image_url, t.created_at,
            a.id AS author_id, a.full_name AS author_name, a.designation AS author_designation, a.photo_url AS author_photo,
            (SELECT COUNT(*) FROM expert_replies r WHERE r.thread_id = t.id) AS reply_count
     FROM expert_threads t
     JOIN registrations a ON a.id = t.member_id
     ORDER BY t.created_at DESC`
  );
  return NextResponse.json(result.rows);
}

export async function POST(req: NextRequest) {
  const session = await requireMember(req);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { title, content, image_url } = await req.json();
  if (!title || !content) {
    return NextResponse.json({ error: "Title and content are required" }, { status: 400 });
  }

  const result = await pool.query(
    `INSERT INTO expert_threads (member_id, title, content, image_url) VALUES ($1, $2, $3, $4)
     RETURNING id, title, content, image_url, created_at`,
    [session.id, title, content, image_url || null]
  );
  return NextResponse.json(result.rows[0], { status: 201 });
}
