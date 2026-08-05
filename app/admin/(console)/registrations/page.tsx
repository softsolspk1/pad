"use client";

import { useEffect, useState } from "react";
import { CheckCircle2, XCircle, FileText, ChevronDown, ChevronUp } from "lucide-react";

type Registration = {
  id: number;
  full_name: string;
  email: string;
  phone: string;
  pmdc_number: string;
  designation: string;
  institute_name: string;
  city: string;
  country: string;
  photo_url: string;
  mbbs_certificate_url: string;
  cnic_copy_url: string;
  degree_url: string;
  status: string;
  membership_number: string | null;
  rejected_reason: string | null;
  created_at: string;
  approved_at: string | null;
};

const TABS = ["pending", "approved", "rejected"] as const;

export default function RegistrationsPage() {
  const [tab, setTab] = useState<(typeof TABS)[number]>("pending");
  const [rows, setRows] = useState<Registration[]>([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState<number | null>(null);
  const [busyId, setBusyId] = useState<number | null>(null);
  const [rejectingId, setRejectingId] = useState<number | null>(null);
  const [reason, setReason] = useState("");
  const [error, setError] = useState<string | null>(null);

  function load(status: string) {
    setLoading(true);
    fetch(`/api/admin/registrations?status=${status}`)
      .then((res) => res.json())
      .then((data) => setRows(Array.isArray(data) ? data : []))
      .catch(() => setError("Failed to load registrations"))
      .finally(() => setLoading(false));
  }

  useEffect(() => {
    load(tab);
  }, [tab]);

  async function approve(id: number) {
    setBusyId(id);
    setError(null);
    try {
      const res = await fetch(`/api/admin/registrations/${id}/approve`, { method: "POST" });
      if (!res.ok) throw new Error();
      load(tab);
    } catch {
      setError("Failed to approve registration.");
    } finally {
      setBusyId(null);
    }
  }

  async function reject(id: number) {
    setBusyId(id);
    setError(null);
    try {
      const res = await fetch(`/api/admin/registrations/${id}/reject`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reason }),
      });
      if (!res.ok) throw new Error();
      setRejectingId(null);
      setReason("");
      load(tab);
    } catch {
      setError("Failed to reject registration.");
    } finally {
      setBusyId(null);
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Registrations</h1>
        <p className="text-muted mt-1">Review applications and approve or reject new members.</p>
      </div>

      <div className="flex gap-2 border-b border-gray-200">
        {TABS.map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-4 py-2.5 text-sm font-semibold capitalize border-b-2 -mb-px transition-colors ${
              tab === t ? "border-crimson-600 text-crimson-600" : "border-transparent text-muted hover:text-gray-900"
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      {error && <div className="bg-red-50 border border-red-200 text-red-700 text-sm p-4 rounded-xl">{error}</div>}
      {loading && <p className="text-muted">Loading...</p>}
      {!loading && rows.length === 0 && <p className="text-muted">No {tab} registrations.</p>}

      <div className="space-y-3">
        {rows.map((r) => (
          <div key={r.id} className="card !rounded-2xl">
            <button
              className="w-full flex items-center justify-between text-left"
              onClick={() => setExpanded(expanded === r.id ? null : r.id)}
            >
              <div className="flex items-center gap-3">
                <img src={r.photo_url} alt={r.full_name} className="w-11 h-11 rounded-full object-cover bg-gray-100" />
                <div>
                  <p className="font-semibold text-gray-900">{r.full_name}</p>
                  <p className="text-xs text-muted">{r.designation} &middot; {r.institute_name}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                {r.membership_number && (
                  <span className="text-xs font-semibold text-crimson-700 bg-crimson-50 px-2.5 py-1 rounded-full">
                    {r.membership_number}
                  </span>
                )}
                {expanded === r.id ? <ChevronUp size={18} className="text-muted" /> : <ChevronDown size={18} className="text-muted" />}
              </div>
            </button>

            {expanded === r.id && (
              <div className="mt-5 pt-5 border-t border-gray-100 space-y-4">
                <div className="grid sm:grid-cols-2 gap-3 text-sm">
                  <p><span className="text-muted">Email:</span> {r.email}</p>
                  <p><span className="text-muted">Phone:</span> {r.phone}</p>
                  <p><span className="text-muted">PMDC Number:</span> {r.pmdc_number}</p>
                  <p><span className="text-muted">Location:</span> {r.city}, {r.country}</p>
                  <p><span className="text-muted">Applied:</span> {new Date(r.created_at).toLocaleDateString()}</p>
                  {r.approved_at && <p><span className="text-muted">Approved:</span> {new Date(r.approved_at).toLocaleDateString()}</p>}
                  {r.rejected_reason && <p className="sm:col-span-2"><span className="text-muted">Rejection reason:</span> {r.rejected_reason}</p>}
                </div>

                <div>
                  <p className="text-xs font-semibold text-gray-700 mb-2">Documents</p>
                  <div className="flex flex-wrap gap-2">
                    <a href={r.mbbs_certificate_url} target="_blank" rel="noreferrer" className="btn-outline !py-1.5 !px-3 text-xs flex items-center gap-1.5">
                      <FileText size={14} /> MBBS Certificate
                    </a>
                    <a href={r.cnic_copy_url} target="_blank" rel="noreferrer" className="btn-outline !py-1.5 !px-3 text-xs flex items-center gap-1.5">
                      <FileText size={14} /> CNIC Copy
                    </a>
                    <a href={r.degree_url} target="_blank" rel="noreferrer" className="btn-outline !py-1.5 !px-3 text-xs flex items-center gap-1.5">
                      <FileText size={14} /> Post Graduate Degree
                    </a>
                  </div>
                </div>

                {tab === "pending" && (
                  <div className="space-y-3 pt-2">
                    {rejectingId === r.id ? (
                      <div className="space-y-2">
                        <textarea
                          className="input-field text-sm"
                          rows={2}
                          placeholder="Reason for rejection (optional)"
                          value={reason}
                          onChange={(e) => setReason(e.target.value)}
                        />
                        <div className="flex gap-2">
                          <button
                            onClick={() => reject(r.id)}
                            disabled={busyId === r.id}
                            className="btn-primary !bg-red-600 hover:!bg-red-700 !py-2 !px-4 text-sm"
                          >
                            Confirm Reject
                          </button>
                          <button onClick={() => setRejectingId(null)} className="btn-outline !py-2 !px-4 text-sm">
                            Cancel
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="flex gap-2">
                        <button
                          onClick={() => approve(r.id)}
                          disabled={busyId === r.id}
                          className="btn-primary !py-2 !px-4 text-sm flex items-center gap-1.5 disabled:opacity-60"
                        >
                          <CheckCircle2 size={16} /> {busyId === r.id ? "Approving..." : "Approve"}
                        </button>
                        <button
                          onClick={() => setRejectingId(r.id)}
                          className="btn-outline !py-2 !px-4 text-sm flex items-center gap-1.5 !border-red-300 !text-red-600"
                        >
                          <XCircle size={16} /> Reject
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
