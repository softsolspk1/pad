"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { UserCheck, Users, Newspaper, Calendar, ClipboardList, MessageCircleQuestion, XCircle, ArrowRight } from "lucide-react";

type Stats = {
  pendingRegistrations: number;
  approvedMembers: number;
  rejectedRegistrations: number;
  totalNewsPosts: number;
  upcomingEvents: number;
  activeSurveys: number;
  expertThreads: number;
};

export default function AdminOverview() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/admin/stats")
      .then((res) => {
        if (!res.ok) throw new Error("Failed to load stats");
        return res.json();
      })
      .then(setStats)
      .catch(() => setError("Could not load dashboard stats."));
  }, []);

  const cards = stats
    ? [
        { label: "Pending Registrations", value: stats.pendingRegistrations, icon: UserCheck, href: "/admin/registrations", accent: "text-amber-600 bg-amber-50" },
        { label: "Approved Members", value: stats.approvedMembers, icon: Users, href: "/admin/members", accent: "text-crimson-600 bg-crimson-50" },
        { label: "Rejected Registrations", value: stats.rejectedRegistrations, icon: XCircle, href: "/admin/registrations", accent: "text-gray-600 bg-gray-100" },
        { label: "News Posts", value: stats.totalNewsPosts, icon: Newspaper, href: "/admin/news", accent: "text-blue-600 bg-blue-50" },
        { label: "Upcoming Events", value: stats.upcomingEvents, icon: Calendar, href: "/admin/events", accent: "text-emerald-600 bg-emerald-50" },
        { label: "Active Surveys", value: stats.activeSurveys, icon: ClipboardList, href: "/admin/surveys", accent: "text-purple-600 bg-purple-50" },
        { label: "Ask the Expert Threads", value: stats.expertThreads, icon: MessageCircleQuestion, href: "/admin/experts", accent: "text-cyan-600 bg-cyan-50" },
      ]
    : [];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Overview</h1>
        <p className="text-muted mt-1">Snapshot of Rederm Connect activity.</p>
      </div>

      {error && <div className="bg-red-50 border border-red-200 text-red-700 text-sm p-4 rounded-xl">{error}</div>}

      {!stats && !error && <p className="text-muted">Loading...</p>}

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {cards.map((c) => (
          <Link key={c.label} href={c.href} className="card !rounded-2xl hover:shadow-lg transition-shadow flex items-center justify-between">
            <div>
              <p className="text-xs text-muted font-medium mb-1">{c.label}</p>
              <p className="text-3xl font-bold text-gray-900">{c.value}</p>
            </div>
            <div className={`w-11 h-11 rounded-xl flex items-center justify-center ${c.accent}`}>
              <c.icon size={22} />
            </div>
          </Link>
        ))}
      </div>

      {stats && stats.pendingRegistrations > 0 && (
        <div className="card !rounded-2xl bg-amber-50 border-amber-200 flex items-center justify-between">
          <div>
            <p className="font-semibold text-amber-900">
              {stats.pendingRegistrations} registration{stats.pendingRegistrations === 1 ? "" : "s"} awaiting review
            </p>
            <p className="text-sm text-amber-700">New members can't log in until you approve their application.</p>
          </div>
          <Link href="/admin/registrations" className="btn-primary flex items-center gap-2 !py-2 !px-4 text-sm whitespace-nowrap">
            Review now <ArrowRight size={16} />
          </Link>
        </div>
      )}
    </div>
  );
}
