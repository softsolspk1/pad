import { NextRequest, NextResponse } from "next/server";
import { pool } from "@/lib/db";
import { requireMember, requireAdmin } from "@/lib/auth";

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await requireMember(req);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const thread = await pool.query(
    `SELECT t.id, t.title, t.content, t.image_url, t.created_at,
            a.id AS author_id, a.full_name AS author_name, a.designation AS author_designation, a.photo_url AS author_photo
     FROM expert_threads t JOIN registrations a ON a.id = t.member_id WHERE t.id = $1`,
    [params.id]
  );
  if (!thread.rows.length) return NextResponse.json({ error: "Thread not found" }, { status: 404 });

  const replies = await pool.query(
    `SELECT r.id, r.content, r.created_at, a.id AS author_id, a.full_name AS author_name, a.photo_url AS author_photo
     FROM expert_replies r JOIN registrations a ON a.id = r.member_id
     WHERE r.thread_id = $1 ORDER BY r.created_at ASC`,
    [params.id]
  );

  return NextResponse.json({ ...thread.rows[0], replies: replies.rows });
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await requireAdmin(req);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  await pool.query(`DELETE FROM expert_threads WHERE id = $1`, [params.id]);
  return NextResponse.json({ ok: true });
}
