import { NextRequest, NextResponse } from "next/server";
import { pool } from "@/lib/db";
import { requireAdmin } from "@/lib/auth";

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await requireAdmin(req);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  await pool.query(`DELETE FROM research_items WHERE id = $1`, [params.id]);
  return NextResponse.json({ ok: true });
}
