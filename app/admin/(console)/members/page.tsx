"use client";

import { useEffect, useState } from "react";
import { Search } from "lucide-react";

type Member = {
  id: number;
  full_name: string;
  email: string;
  phone: string;
  designation: string;
  institute_name: string;
  city: string;
  country: string;
  photo_url: string;
  membership_number: string;
  approved_at: string;
};

export default function MembersPage() {
  const [members, setMembers] = useState<Member[]>([]);
  const [q, setQ] = useState("");
  const [loading, setLoading] = useState(true);

  function load(query: string) {
    setLoading(true);
    fetch(`/api/admin/members${query ? `?q=${encodeURIComponent(query)}` : ""}`)
      .then((res) => res.json())
      .then((data) => setMembers(Array.isArray(data) ? data : []))
      .finally(() => setLoading(false));
  }

  useEffect(() => {
    load("");
  }, []);

  useEffect(() => {
    const t = setTimeout(() => load(q), 300);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [q]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Members</h1>
        <p className="text-muted mt-1">{members.length} approved member{members.length === 1 ? "" : "s"}</p>
      </div>

      <div className="relative max-w-sm">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
        <input
          className="input-field !pl-9"
          placeholder="Search by name, email, membership #"
          value={q}
          onChange={(e) => setQ(e.target.value)}
        />
      </div>

      {loading && <p className="text-muted">Loading...</p>}

      <div className="card !rounded-2xl !p-0 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-left text-xs text-muted uppercase">
              <tr>
                <th className="px-4 py-3">Member</th>
                <th className="px-4 py-3">Membership #</th>
                <th className="px-4 py-3">Designation</th>
                <th className="px-4 py-3">Institute</th>
                <th className="px-4 py-3">Contact</th>
                <th className="px-4 py-3">Approved</th>
              </tr>
            </thead>
            <tbody>
              {members.map((m) => (
                <tr key={m.id} className="border-t border-gray-100">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2.5">
                      <img src={m.photo_url} alt={m.full_name} className="w-8 h-8 rounded-full object-cover bg-gray-100" />
                      <span className="font-medium text-gray-900">{m.full_name}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-crimson-700 font-semibold">{m.membership_number}</td>
                  <td className="px-4 py-3 text-muted">{m.designation}</td>
                  <td className="px-4 py-3 text-muted">{m.institute_name}, {m.city}</td>
                  <td className="px-4 py-3 text-muted">
                    <div>{m.email}</div>
                    <div>{m.phone}</div>
                  </td>
                  <td className="px-4 py-3 text-muted">{m.approved_at ? new Date(m.approved_at).toLocaleDateString() : "-"}</td>
                </tr>
              ))}
            </tbody>
          </table>
          {!loading && members.length === 0 && <p className="text-center text-muted py-10">No members found.</p>}
        </div>
      </div>
    </div>
  );
}
