import { NextRequest, NextResponse } from "next/server";
import { pool } from "@/lib/db";
import { requireMember } from "@/lib/auth";

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await requireMember(req);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  await pool.query(
    `UPDATE notifications SET is_read = true WHERE id = $1 AND member_id = $2`,
    [params.id, session.id]
  );
  return NextResponse.json({ ok: true });
}
