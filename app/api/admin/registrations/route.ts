import { NextRequest, NextResponse } from "next/server";
import { pool } from "@/lib/db";
import { requireAdmin } from "@/lib/auth";

export async function GET(req: NextRequest) {
  const session = await requireAdmin(req);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const status = req.nextUrl.searchParams.get("status") || "pending";
  const result = await pool.query(
    `SELECT id, full_name, email, phone, pmdc_number, designation, institute_name, city, country,
            photo_url, mbbs_certificate_url, cnic_copy_url, degree_url,
            status, membership_number, rejected_reason, created_at, approved_at
     FROM registrations WHERE status = $1 ORDER BY created_at DESC`,
    [status]
  );
  return NextResponse.json(result.rows);
}
