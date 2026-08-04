import { NextRequest, NextResponse } from "next/server";
import { pool } from "@/lib/db";
import { requireMember, requireAdmin } from "@/lib/auth";

export async function GET(req: NextRequest) {
  const member = await requireMember(req);
  const admin = member ? null : await requireAdmin(req);
  if (!member && !admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const result = await pool.query(
    `SELECT id, title, description, event_type, event_date, location, banner_url, created_at
     FROM events ORDER BY event_date DESC`
  );
  return NextResponse.json(result.rows);
}

export async function POST(req: NextRequest) {
  const session = await requireAdmin(req);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { title, description, event_type, event_date, location, banner_url } = await req.json();
  if (!title || !event_date) {
    return NextResponse.json({ error: "Title and event date are required" }, { status: 400 });
  }

  const result = await pool.query(
    `INSERT INTO events (title, description, event_type, event_date, location, banner_url)
     VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
    [title, description || null, event_type || "conference", event_date, location || null, banner_url || null]
  );
  return NextResponse.json(result.rows[0], { status: 201 });
}
