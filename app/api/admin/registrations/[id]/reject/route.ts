import { NextRequest, NextResponse } from "next/server";
import { pool } from "@/lib/db";
import { requireAdmin } from "@/lib/auth";

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await requireAdmin(req);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { reason } = await req.json().catch(() => ({ reason: null }));

  const result = await pool.query(
    `UPDATE registrations SET status = 'rejected', rejected_reason = $2 WHERE id = $1
     RETURNING id, full_name, email`,
    [params.id, reason ?? null]
  );

  if (!result.rows.length) {
    return NextResponse.json({ error: "Registration not found" }, { status: 404 });
  }

  return NextResponse.json(result.rows[0]);
}
