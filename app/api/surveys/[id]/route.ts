import { NextRequest, NextResponse } from "next/server";
import { pool } from "@/lib/db";
import { requireAdmin } from "@/lib/auth";

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await requireAdmin(req);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  await pool.query(`DELETE FROM surveys WHERE id = $1`, [params.id]);
  return NextResponse.json({ ok: true });
}

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await requireAdmin(req);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { is_active } = await req.json();
  const result = await pool.query(
    `UPDATE surveys SET is_active = $2 WHERE id = $1 RETURNING *`,
    [params.id, is_active]
  );
  if (!result.rows.length) return NextResponse.json({ error: "Survey not found" }, { status: 404 });
  return NextResponse.json(result.rows[0]);
}
