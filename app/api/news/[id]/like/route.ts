import { NextRequest, NextResponse } from "next/server";
import { pool } from "@/lib/db";
import { requireMember } from "@/lib/auth";

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await requireMember(req);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const existing = await pool.query(
    `SELECT id FROM news_likes WHERE post_id = $1 AND member_id = $2`,
    [params.id, session.id]
  );

  if (existing.rows.length) {
    await pool.query(`DELETE FROM news_likes WHERE post_id = $1 AND member_id = $2`, [params.id, session.id]);
    return NextResponse.json({ liked: false });
  }

  await pool.query(`INSERT INTO news_likes (post_id, member_id) VALUES ($1, $2)`, [params.id, session.id]);
  return NextResponse.json({ liked: true });
}
