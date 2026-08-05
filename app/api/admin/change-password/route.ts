import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { pool } from "@/lib/db";
import { requireAdmin } from "@/lib/auth";

export async function POST(req: NextRequest) {
  const session = await requireAdmin(req);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { currentPassword, newPassword } = await req.json();
  if (!currentPassword || !newPassword || newPassword.length < 8) {
    return NextResponse.json({ error: "New password must be at least 8 characters" }, { status: 400 });
  }

  const result = await pool.query(`SELECT password_hash FROM admin_users WHERE id = $1`, [session.id]);
  const admin = result.rows[0];
  if (!admin || !(await bcrypt.compare(currentPassword, admin.password_hash))) {
    return NextResponse.json({ error: "Current password is incorrect" }, { status: 401 });
  }

  const newHash = await bcrypt.hash(newPassword, 10);
  await pool.query(`UPDATE admin_users SET password_hash = $1 WHERE id = $2`, [newHash, session.id]);
  return NextResponse.json({ ok: true });
}
