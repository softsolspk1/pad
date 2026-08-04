import { NextRequest, NextResponse } from "next/server";
import { pool } from "@/lib/db";
import { verifySession, SESSION_COOKIE, ADMIN_COOKIE } from "@/lib/auth";

export async function GET(req: NextRequest) {
  const memberToken = req.cookies.get(SESSION_COOKIE)?.value;
  const adminToken = req.cookies.get(ADMIN_COOKIE)?.value;

  if (adminToken) {
    const session = await verifySession(adminToken);
    if (session) return NextResponse.json({ ...session, role: "admin" });
  }

  if (memberToken) {
    const session = await verifySession(memberToken);
    if (session) {
      const result = await pool.query(
        `SELECT id, full_name, email, designation, institute_name, photo_url, membership_number, status
         FROM registrations WHERE id = $1`,
        [session.id]
      );
      const member = result.rows[0];
      if (member) {
        return NextResponse.json({ role: "member", ...member });
      }
    }
  }

  return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
}
