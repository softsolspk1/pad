import { NextRequest, NextResponse } from "next/server";
import { pool } from "@/lib/db";
import { requireMember } from "@/lib/auth";

async function assertParticipant(conversationId: string, memberId: number) {
  const result = await pool.query(
    `SELECT 1 FROM chat_participants WHERE conversation_id = $1 AND member_id = $2`,
    [conversationId, memberId]
  );
  return result.rows.length > 0;
}

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await requireMember(req);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  if (!(await assertParticipant(params.id, session.id))) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const after = req.nextUrl.searchParams.get("after");
  const result = await pool.query(
    after
      ? `SELECT m.id, m.content, m.created_at, s.id AS sender_id, s.full_name AS sender_name, s.photo_url AS sender_photo
         FROM chat_messages m JOIN registrations s ON s.id = m.sender_id
         WHERE m.conversation_id = $1 AND m.id > $2 ORDER BY m.created_at ASC`
      : `SELECT m.id, m.content, m.created_at, s.id AS sender_id, s.full_name AS sender_name, s.photo_url AS sender_photo
         FROM chat_messages m JOIN registrations s ON s.id = m.sender_id
         WHERE m.conversation_id = $1 ORDER BY m.created_at ASC LIMIT 200`,
    after ? [params.id, after] : [params.id]
  );
  return NextResponse.json(result.rows);
}

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await requireMember(req);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  if (!(await assertParticipant(params.id, session.id))) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { content } = await req.json();
  if (!content || !String(content).trim()) {
    return NextResponse.json({ error: "Message cannot be empty" }, { status: 400 });
  }

  const result = await pool.query(
    `INSERT INTO chat_messages (conversation_id, sender_id, content) VALUES ($1, $2, $3)
     RETURNING id, content, created_at`,
    [params.id, session.id, content]
  );
  return NextResponse.json(result.rows[0], { status: 201 });
}
