import { NextRequest, NextResponse } from "next/server";
import { pool } from "@/lib/db";
import { requireMember } from "@/lib/auth";

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await requireMember(req);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const result = await pool.query(
    `SELECT c.id, c.content, c.created_at, a.id AS author_id, a.full_name AS author_name, a.photo_url AS author_photo
     FROM news_comments c
     JOIN registrations a ON a.id = c.member_id
     WHERE c.post_id = $1
     ORDER BY c.created_at ASC`,
    [params.id]
  );
  return NextResponse.json(result.rows);
}

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await requireMember(req);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { content } = await req.json();
  if (!content || !String(content).trim()) {
    return NextResponse.json({ error: "Comment cannot be empty" }, { status: 400 });
  }

  const result = await pool.query(
    `INSERT INTO news_comments (post_id, member_id, content) VALUES ($1, $2, $3)
     RETURNING id, content, created_at`,
    [params.id, session.id, content]
  );
  return NextResponse.json(result.rows[0], { status: 201 });
}
