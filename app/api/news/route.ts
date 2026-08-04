import { NextRequest, NextResponse } from "next/server";
import { pool } from "@/lib/db";
import { requireMember } from "@/lib/auth";

export async function GET(req: NextRequest) {
  const session = await requireMember(req);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const result = await pool.query(
    `SELECT p.id, p.content, p.image_url, p.created_at,
            a.id AS author_id, a.full_name AS author_name, a.designation AS author_designation, a.photo_url AS author_photo,
            (SELECT COUNT(*) FROM news_likes l WHERE l.post_id = p.id) AS like_count,
            (SELECT COUNT(*) FROM news_comments c WHERE c.post_id = p.id) AS comment_count,
            EXISTS(SELECT 1 FROM news_likes l WHERE l.post_id = p.id AND l.member_id = $1) AS liked_by_me
     FROM news_posts p
     JOIN registrations a ON a.id = p.author_id
     ORDER BY p.created_at DESC
     LIMIT 50`,
    [session.id]
  );
  return NextResponse.json(result.rows);
}

export async function POST(req: NextRequest) {
  const session = await requireMember(req);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { content, image_url } = await req.json();
  if (!content || !String(content).trim()) {
    return NextResponse.json({ error: "Post content is required" }, { status: 400 });
  }

  const result = await pool.query(
    `INSERT INTO news_posts (author_id, content, image_url) VALUES ($1, $2, $3)
     RETURNING id, content, image_url, created_at`,
    [session.id, content, image_url || null]
  );
  return NextResponse.json(result.rows[0], { status: 201 });
}
