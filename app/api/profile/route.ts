import { NextRequest, NextResponse } from "next/server";
import { pool } from "@/lib/db";
import { requireMember } from "@/lib/auth";

const EDITABLE_FIELDS = [
  "qualification",
  "clinic_hospital",
  "experience",
  "areas_of_interest",
  "publications",
  "awards",
  "social_links",
  "photo_url",
] as const;

export async function PATCH(req: NextRequest) {
  const session = await requireMember(req);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const sets: string[] = [];
  const values: any[] = [];

  for (const field of EDITABLE_FIELDS) {
    if (body[field] !== undefined) {
      values.push(field === "social_links" ? JSON.stringify(body[field]) : body[field]);
      sets.push(`${field} = $${values.length}`);
    }
  }

  if (!sets.length) {
    return NextResponse.json({ error: "No fields to update" }, { status: 400 });
  }

  values.push(session.id);
  const result = await pool.query(
    `UPDATE registrations SET ${sets.join(", ")} WHERE id = $${values.length}
     RETURNING id, full_name, email, designation, institute_name, photo_url, membership_number,
               qualification, clinic_hospital, experience, areas_of_interest, publications, awards, social_links`,
    values
  );

  return NextResponse.json(result.rows[0]);
}
