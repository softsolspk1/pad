import { NextRequest, NextResponse } from "next/server";
import { pool } from "@/lib/db";
import { requireAdmin } from "@/lib/auth";

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await requireAdmin(req);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { title, description, event_type, event_date, location, banner_url } = await req.json();
  const result = await pool.query(
    `UPDATE events SET title = $2, description = $3, event_type = $4, event_date = $5, location = $6, banner_url = $7
     WHERE id = $1 RETURNING *`,
    [params.id, title, description || null, event_type, event_date, location || null, banner_url || null]
  );
  if (!result.rows.length) return NextResponse.json({ error: "Event not found" }, { status: 404 });
  return NextResponse.json(result.rows[0]);
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await requireAdmin(req);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  await pool.query(`DELETE FROM events WHERE id = $1`, [params.id]);
  return NextResponse.json({ ok: true });
}
