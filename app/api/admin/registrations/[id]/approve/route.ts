import { NextRequest, NextResponse } from "next/server";
import { pool } from "@/lib/db";
import { requireAdmin } from "@/lib/auth";
import { sendApprovalEmail } from "@/lib/email";

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await requireAdmin(req);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const year = new Date().getFullYear();
  const seqResult = await pool.query(
    `SELECT COUNT(*) FROM registrations WHERE membership_number LIKE $1`,
    [`PAD-${year}-%`]
  );
  const seq = parseInt(seqResult.rows[0].count, 10) + 1;
  const membershipNumber = `PAD-${year}-${String(seq).padStart(5, "0")}`;

  const result = await pool.query(
    `UPDATE registrations
     SET status = 'approved', approved_at = now(), membership_number = COALESCE(membership_number, $2)
     WHERE id = $1
     RETURNING id, full_name, email, membership_number`,
    [params.id, membershipNumber]
  );

  if (!result.rows.length) {
    return NextResponse.json({ error: "Registration not found" }, { status: 404 });
  }

  const member = result.rows[0];
  await sendApprovalEmail(member.email, member.full_name);

  return NextResponse.json(member);
}
