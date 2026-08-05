import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { pool } from "@/lib/db";
import { sendRegistrationEmail } from "@/lib/email";

const REQUIRED_FIELDS = [
  "full_name",
  "father_husband_name",
  "designation",
  "gender",
  "date_of_birth",
  "cnic_number",
  "member_residence",
  "country",
  "province",
  "city",
  "home_address",
  "institute_name",
  "pmdc_number",
  "phone",
  "email",
  "institute_address",
  "photo_url",
  "mbbs_certificate_url",
  "cnic_copy_url",
  "degree_url",
] as const;

export async function POST(req: NextRequest) {
  const body = await req.json();

  const missing = REQUIRED_FIELDS.filter((field) => !body[field] || String(body[field]).trim() === "");
  if (missing.length > 0) {
    return NextResponse.json({ error: `Missing required fields: ${missing.join(", ")}` }, { status: 400 });
  }

  if (!body.password || String(body.password).length < 8) {
    return NextResponse.json({ error: "Password must be at least 8 characters" }, { status: 400 });
  }

  try {
    const passwordHash = await bcrypt.hash(body.password, 10);

    const result = await pool.query(
      `INSERT INTO registrations (
        full_name, father_husband_name, designation, gender, date_of_birth, cnic_number,
        member_residence, country, province, city, home_address,
        institute_name, pmdc_number, phone, email, institute_address,
        photo_url, mbbs_certificate_url, cnic_copy_url, degree_url, password_hash
      ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18,$19,$20,$21)
      RETURNING id, created_at`,
      [...REQUIRED_FIELDS.map((field) => body[field]), passwordHash]
    );

    const newRegistration = result.rows[0];
    await sendRegistrationEmail(body.email, body.full_name);

    return NextResponse.json({ id: newRegistration.id, createdAt: newRegistration.created_at }, { status: 201 });
  } catch (err: any) {
    if (err.code === "23505") {
      const field = err.constraint?.includes("email")
        ? "email address"
        : err.constraint?.includes("cnic")
        ? "CNIC number"
        : err.constraint?.includes("pmdc")
        ? "PMDC number"
        : "record";
      return NextResponse.json({ error: `A registration with this ${field} already exists.` }, { status: 409 });
    }
    console.error("Registration insert failed:", err);
    return NextResponse.json({ error: "Failed to submit registration" }, { status: 500 });
  }
}
