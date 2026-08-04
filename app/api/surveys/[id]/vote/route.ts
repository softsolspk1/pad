import { NextRequest, NextResponse } from "next/server";
import { pool } from "@/lib/db";
import { requireMember } from "@/lib/auth";

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await requireMember(req);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { optionId } = await req.json();
  if (!optionId) return NextResponse.json({ error: "optionId is required" }, { status: 400 });

  try {
    await pool.query(
      `INSERT INTO survey_votes (survey_id, option_id, member_id) VALUES ($1, $2, $3)`,
      [params.id, optionId, session.id]
    );
    return NextResponse.json({ ok: true }, { status: 201 });
  } catch (err: any) {
    if (err.code === "23505") {
      return NextResponse.json({ error: "You have already voted in this survey" }, { status: 409 });
    }
    console.error("Vote failed:", err);
    return NextResponse.json({ error: "Failed to submit vote" }, { status: 500 });
  }
}
