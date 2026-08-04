import { NextRequest, NextResponse } from "next/server";
import { pool } from "@/lib/db";
import { requireAdmin } from "@/lib/auth";

export async function GET(req: NextRequest) {
  const session = await requireAdmin(req);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const search = req.nextUrl.searchParams.get("q");
  const params: any[] = [];
  let where = `WHERE status = 'approved'`;
  if (search) {
    params.push(`%${search}%`);
    where += ` AND (full_name ILIKE $${params.length} OR email ILIKE $${params.length} OR membership_number ILIKE $${params.length})`;
  }

  const result = await pool.query(
    `SELECT id, full_name, email, phone, designation, institute_name, city, country,
            photo_url, membership_number, approved_at
     FROM registrations ${where} ORDER BY full_name ASC`,
    params
  );
  return NextResponse.json(result.rows);
}
