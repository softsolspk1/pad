"use client";

import { useEffect, useState } from "react";
import { ShieldCheck, Calendar, Building2, Loader2 } from "lucide-react";

type Member = {
  full_name: string;
  designation: string;
  institute_name: string;
  photo_url: string;
  membership_number: string;
  approved_at: string | null;
  status: string;
};

export default function MembershipPage() {
  const [member, setMember] = useState<Member | null>(null);

  useEffect(() => {
    fetch("/api/auth/me")
      .then((res) => res.json())
      .then((data) => setMember(data));
  }, []);

  if (!member) {
    return (
      <div className="flex justify-center py-20 text-muted">
        <Loader2 className="animate-spin" />
      </div>
    );
  }

  const memberSince = member.approved_at
    ? new Date(member.approved_at).toLocaleDateString("en-GB", { year: "numeric", month: "long" })
    : "—";

  return (
    <div className="max-w-xl mx-auto space-y-6">
      <div>
        <h2 className="text-xl font-bold">Digital Membership Card</h2>
        <p className="text-muted text-sm">Your verified PAD Rederm Connect membership.</p>
      </div>

      <div
        className="rounded-3xl p-6 text-white relative overflow-hidden shadow-lg"
        style={{ background: "linear-gradient(135deg, #a6192e 0%, #5f131f 100%)" }}
      >
        <div className="absolute -top-10 -right-10 w-40 h-40 rounded-full bg-white/10" />
        <div className="absolute -bottom-16 -left-10 w-48 h-48 rounded-full bg-white/5" />

        <div className="relative z-10 flex items-center justify-between mb-8">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-crimson-700 font-bold text-sm">R</div>
            <span className="font-bold tracking-tight text-sm">REDERM CONNECT</span>
          </div>
          <ShieldCheck size={22} className="text-white/80" />
        </div>

        <div className="relative z-10 flex items-center gap-4 mb-6">
          <img
            src={member.photo_url}
            alt={member.full_name}
            className="w-20 h-20 rounded-2xl object-cover border-2 border-white/40"
          />
          <div>
            <p className="font-bold text-lg leading-tight">{member.full_name}</p>
            <p className="text-sm text-red-100">{member.designation}</p>
            <p className="text-xs text-red-100/80 flex items-center gap-1 mt-1">
              <Building2 size={12} /> {member.institute_name}
            </p>
          </div>
        </div>

        <div className="relative z-10 flex items-end justify-between pt-4 border-t border-white/20">
          <div>
            <p className="text-[10px] uppercase tracking-wider text-red-100/70">Membership No.</p>
            <p className="font-mono font-bold tracking-wider">{member.membership_number || "Pending"}</p>
          </div>
          <div className="text-right">
            <p className="text-[10px] uppercase tracking-wider text-red-100/70 flex items-center gap-1 justify-end">
              <Calendar size={11} /> Member Since
            </p>
            <p className="text-sm font-semibold">{memberSince}</p>
          </div>
        </div>
      </div>

      <div className="card text-sm text-muted">
        This digital card verifies your active membership with the Pakistan Association of Dermatologists (PAD).
        Present it at events and conferences for member check-in.
      </div>
    </div>
  );
}
