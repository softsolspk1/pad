import { NextRequest, NextResponse } from "next/server";
import { pool } from "@/lib/db";
import { requireAdmin } from "@/lib/auth";

export async function GET(req: NextRequest) {
  const session = await requireAdmin(req);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const [pending, approved, rejected, news, events, surveys, threads] = await Promise.all([
    pool.query(`SELECT COUNT(*) FROM registrations WHERE status = 'pending'`),
    pool.query(`SELECT COUNT(*) FROM registrations WHERE status = 'approved'`),
    pool.query(`SELECT COUNT(*) FROM registrations WHERE status = 'rejected'`),
    pool.query(`SELECT COUNT(*) FROM news_posts`),
    pool.query(`SELECT COUNT(*) FROM events WHERE event_date >= now()`),
    pool.query(`SELECT COUNT(*) FROM surveys WHERE is_active = true`),
    pool.query(`SELECT COUNT(*) FROM expert_threads`),
  ]);

  return NextResponse.json({
    pendingRegistrations: parseInt(pending.rows[0].count, 10),
    approvedMembers: parseInt(approved.rows[0].count, 10),
    rejectedRegistrations: parseInt(rejected.rows[0].count, 10),
    totalNewsPosts: parseInt(news.rows[0].count, 10),
    upcomingEvents: parseInt(events.rows[0].count, 10),
    activeSurveys: parseInt(surveys.rows[0].count, 10),
    expertThreads: parseInt(threads.rows[0].count, 10),
  });
}
