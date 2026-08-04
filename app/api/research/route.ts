import { NextRequest, NextResponse } from "next/server";
import { pool } from "@/lib/db";
import { requireMember, requireAdmin } from "@/lib/auth";

export async function GET(req: NextRequest) {
  const member = await requireMember(req);
  const admin = member ? null : await requireAdmin(req);
  if (!member && !admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const category = req.nextUrl.searchParams.get("category");
  const params: any[] = [];
  let where = "";
  if (category) {
    params.push(category);
    where = `WHERE category = $1`;
  }

  const result = await pool.query(
    `SELECT id, category, title, description, author_or_source, file_url, cover_image_url, published_date, created_at
     FROM research_items ${where} ORDER BY published_date DESC NULLS LAST, created_at DESC`,
    params
  );
  return NextResponse.json(result.rows);
}

export async function POST(req: NextRequest) {
  const session = await requireAdmin(req);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { category, title, description, author_or_source, file_url, cover_image_url, published_date } = await req.json();
  if (!title || !category) {
    return NextResponse.json({ error: "Title and category are required" }, { status: 400 });
  }

  const result = await pool.query(
    `INSERT INTO research_items (category, title, description, author_or_source, file_url, cover_image_url, published_date)
     VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`,
    [category, title, description || null, author_or_source || null, file_url || null, cover_image_url || null, published_date || null]
  );
  return NextResponse.json(result.rows[0], { status: 201 });
}
