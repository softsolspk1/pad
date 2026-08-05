import { NextRequest, NextResponse } from "next/server";
import { pool } from "@/lib/db";
import { verifySession, SESSION_COOKIE, ADMIN_COOKIE } from "@/lib/auth";

export async function GET(req: NextRequest) {
  const memberToken = req.cookies.get(SESSION_COOKIE)?.value;
  const adminToken = req.cookies.get(ADMIN_COOKIE)?.value;
  // Both cookies can legitimately coexist in one browser (e.g. an admin also testing
  // the member dashboard). The caller's own route context tells us which identity it
  // wants — admin pages pass ?as=admin, member pages use the default.
  const wantsAdmin = req.nextUrl.searchParams.get("as") === "admin";

  if (wantsAdmin) {
    if (adminToken) {
      const session = await verifySession(adminToken);
      if (session) return NextResponse.json({ ...session, role: "admin" });
    }
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  if (memberToken) {
    const session = await verifySession(memberToken);
    if (session) {
      const result = await pool.query(
        `SELECT id, full_name, email, phone, designation, institute_name, city, country, photo_url,
                membership_number, status, approved_at, qualification, clinic_hospital, experience,
                areas_of_interest, publications, awards, social_links
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
