import { NextRequest, NextResponse } from "next/server";
import { pool } from "@/lib/db";
import { requireMember } from "@/lib/auth";

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await requireMember(req);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { content } = await req.json();
  if (!content || !String(content).trim()) {
    return NextResponse.json({ error: "Reply cannot be empty" }, { status: 400 });
  }

  const result = await pool.query(
    `INSERT INTO expert_replies (thread_id, member_id, content) VALUES ($1, $2, $3)
     RETURNING id, content, created_at`,
    [params.id, session.id, content]
  );
  return NextResponse.json(result.rows[0], { status: 201 });
}
