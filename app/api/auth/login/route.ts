import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { pool } from "@/lib/db";
import { signSession, SESSION_COOKIE } from "@/lib/auth";

export async function POST(req: NextRequest) {
  const { identifier, password } = await req.json();

  if (!identifier || !password) {
    return NextResponse.json({ error: "Please enter your PMDC number/email and password" }, { status: 400 });
  }

  const result = await pool.query(
    `SELECT id, full_name, email, pmdc_number, password_hash, status
     FROM registrations WHERE email = $1 OR pmdc_number = $1`,
    [identifier]
  );

  const member = result.rows[0];
  if (!member || !member.password_hash) {
    return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
  }

  const valid = await bcrypt.compare(password, member.password_hash);
  if (!valid) {
    return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
  }

  if (member.status !== "approved") {
    return NextResponse.json(
      { error: "Your registration is still pending admin approval." },
      { status: 403 }
    );
  }

  const token = await signSession({
    id: member.id,
    role: "member",
    name: member.full_name,
    email: member.email,
  });

  const res = NextResponse.json({ ok: true });
  res.cookies.set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });
  return res;
}
