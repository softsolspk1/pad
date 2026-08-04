import { NextRequest, NextResponse } from "next/server";
import { pool } from "@/lib/db";
import { requireMember } from "@/lib/auth";

export async function GET(req: NextRequest) {
  const session = await requireMember(req);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const result = await pool.query(
    `SELECT id, full_name, designation, institute_name, city, photo_url, membership_number
     FROM registrations WHERE status = 'approved' AND id != $1 ORDER BY full_name ASC`,
    [session.id]
  );
  return NextResponse.json(result.rows);
}
