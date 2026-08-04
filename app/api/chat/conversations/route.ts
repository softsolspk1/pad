import { NextRequest, NextResponse } from "next/server";
import { pool } from "@/lib/db";
import { requireMember } from "@/lib/auth";

export async function GET(req: NextRequest) {
  const session = await requireMember(req);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const result = await pool.query(
    `SELECT c.id, c.is_group, c.name, c.created_at,
            (SELECT content FROM chat_messages m WHERE m.conversation_id = c.id ORDER BY m.created_at DESC LIMIT 1) AS last_message,
            (SELECT created_at FROM chat_messages m WHERE m.conversation_id = c.id ORDER BY m.created_at DESC LIMIT 1) AS last_message_at,
            (SELECT json_agg(json_build_object('id', r.id, 'full_name', r.full_name, 'photo_url', r.photo_url))
               FROM chat_participants p JOIN registrations r ON r.id = p.member_id
               WHERE p.conversation_id = c.id AND p.member_id != $1) AS other_participants
     FROM chat_conversations c
     JOIN chat_participants me ON me.conversation_id = c.id AND me.member_id = $1
     ORDER BY COALESCE(
       (SELECT created_at FROM chat_messages m WHERE m.conversation_id = c.id ORDER BY m.created_at DESC LIMIT 1),
       c.created_at
     ) DESC`,
    [session.id]
  );
  return NextResponse.json(result.rows);
}

export async function POST(req: NextRequest) {
  const session = await requireMember(req);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { participantIds, isGroup, name } = await req.json();
  if (!Array.isArray(participantIds) || participantIds.length === 0) {
    return NextResponse.json({ error: "At least one participant is required" }, { status: 400 });
  }

  const allParticipants = Array.from(new Set([session.id, ...participantIds]));
  const group = Boolean(isGroup) || allParticipants.length > 2;

  const client = await pool.connect();
  try {
    await client.query("BEGIN");

    if (!group && allParticipants.length === 2) {
      const existing = await client.query(
        `SELECT c.id FROM chat_conversations c
         WHERE c.is_group = false
           AND (SELECT COUNT(*) FROM chat_participants p WHERE p.conversation_id = c.id) = 2
           AND EXISTS (SELECT 1 FROM chat_participants p WHERE p.conversation_id = c.id AND p.member_id = $1)
           AND EXISTS (SELECT 1 FROM chat_participants p WHERE p.conversation_id = c.id AND p.member_id = $2)`,
        [allParticipants[0], allParticipants[1]]
      );
      if (existing.rows.length) {
        await client.query("ROLLBACK");
        return NextResponse.json({ id: existing.rows[0].id });
      }
    }

    const conv = await client.query(
      `INSERT INTO chat_conversations (is_group, name) VALUES ($1, $2) RETURNING id`,
      [group, group ? name || "Group Chat" : null]
    );

    for (const memberId of allParticipants) {
      await client.query(
        `INSERT INTO chat_participants (conversation_id, member_id) VALUES ($1, $2)`,
        [conv.rows[0].id, memberId]
      );
    }

    await client.query("COMMIT");
    return NextResponse.json({ id: conv.rows[0].id }, { status: 201 });
  } catch (err) {
    await client.query("ROLLBACK");
    console.error("Conversation creation failed:", err);
    return NextResponse.json({ error: "Failed to create conversation" }, { status: 500 });
  } finally {
    client.release();
  }
}
