import { NextRequest, NextResponse } from "next/server";
import { pool } from "@/lib/db";
import { requireMember } from "@/lib/auth";

export async function GET(req: NextRequest) {
  const session = await requireMember(req);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const result = await pool.query(
    `SELECT id, title, body, is_read, created_at FROM notifications
     WHERE member_id = $1 ORDER BY created_at DESC LIMIT 50`,
    [session.id]
  );
  return NextResponse.json(result.rows);
}
