"use client";

import { useEffect, useState } from "react";
import { Plus, Trash2, X, Power } from "lucide-react";

type Survey = {
  id: number;
  title: string;
  description: string | null;
  is_active: boolean;
  options: { id: number; option_text: string; vote_count: string }[];
};

export default function AdminSurveysPage() {
  const [surveys, setSurveys] = useState<Survey[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [options, setOptions] = useState(["", ""]);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function load() {
    setLoading(true);
    fetch("/api/surveys")
      .then((res) => res.json())
      .then((data) => setSurveys(Array.isArray(data) ? data : []))
      .finally(() => setLoading(false));
  }

  useEffect(load, []);

  function resetForm() {
    setTitle("");
    setDescription("");
    setOptions(["", ""]);
    setError(null);
  }

  async function save() {
    const cleanOptions = options.map((o) => o.trim()).filter(Boolean);
    if (!title || cleanOptions.length < 2) {
      setError("Title and at least 2 options are required");
      return;
    }
    setSaving(true);
    setError(null);
    try {
      const res = await fetch("/api/surveys", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, description, options: cleanOptions }),
      });
      if (!res.ok) throw new Error();
      resetForm();
      setShowForm(false);
      load();
    } catch {
      setError("Failed to create survey");
    } finally {
      setSaving(false);
    }
  }

  async function toggleActive(s: Survey) {
    await fetch(`/api/surveys/${s.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ is_active: !s.is_active }),
    });
    load();
  }

  async function remove(id: number) {
    if (!confirm("Delete this survey?")) return;
    await fetch(`/api/surveys/${id}`, { method: "DELETE" });
    load();
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Surveys</h1>
          <p className="text-muted mt-1">Create polls and monitor results.</p>
        </div>
        <button onClick={() => setShowForm(true)} className="btn-primary !py-2 !px-4 text-sm flex items-center gap-2">
          <Plus size={16} /> New Survey
        </button>
      </div>

      {showForm && (
        <div className="card !rounded-2xl space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-gray-900">New Survey</h3>
            <button onClick={() => setShowForm(false)}><X size={18} className="text-muted" /></button>
          </div>
          <div>
            <label className="label text-sm">Title *</label>
            <input className="input-field" value={title} onChange={(e) => setTitle(e.target.value)} />
          </div>
          <div>
            <label className="label text-sm">Description</label>
            <textarea className="input-field" rows={2} value={description} onChange={(e) => setDescription(e.target.value)} />
          </div>
          <div>
            <label className="label text-sm">Options *</label>
            <div className="space-y-2">
              {options.map((opt, i) => (
                <div key={i} className="flex gap-2">
                  <input
                    className="input-field"
                    placeholder={`Option ${i + 1}`}
                    value={opt}
                    onChange={(e) => setOptions((prev) => prev.map((o, idx) => (idx === i ? e.target.value : o)))}
                  />
                  {options.length > 2 && (
                    <button onClick={() => setOptions((prev) => prev.filter((_, idx) => idx !== i))} className="text-muted hover:text-red-600 px-2">
                      <Trash2 size={16} />
                    </button>
                  )}
                </div>
              ))}
            </div>
            <button onClick={() => setOptions((prev) => [...prev, ""])} className="text-xs font-semibold text-crimson-600 hover:underline mt-2">
              + Add option
            </button>
          </div>
          {error && <p className="text-sm text-red-600">{error}</p>}
          <button onClick={save} disabled={saving} className="btn-primary !py-2 !px-4 text-sm disabled:opacity-60">
            {saving ? "Creating..." : "Create Survey"}
          </button>
        </div>
      )}

      {loading && <p className="text-muted">Loading...</p>}

      <div className="space-y-4">
        {surveys.map((s) => {
          const total = s.options.reduce((sum, o) => sum + Number(o.vote_count), 0);
          return (
            <div key={s.id} className="card !rounded-2xl">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-bold text-gray-900">{s.title}</h3>
                    <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${s.is_active ? "bg-emerald-50 text-emerald-700" : "bg-gray-100 text-gray-500"}`}>
                      {s.is_active ? "Active" : "Closed"}
                    </span>
                  </div>
                  {s.description && <p className="text-sm text-muted mt-1">{s.description}</p>}
                </div>
                <div className="flex gap-1 shrink-0">
                  <button onClick={() => toggleActive(s)} className="p-1.5 text-muted hover:text-crimson-600" title="Toggle active">
                    <Power size={16} />
                  </button>
                  <button onClick={() => remove(s.id)} className="p-1.5 text-muted hover:text-red-600" title="Delete">
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>

              <div className="mt-4 space-y-2">
                {s.options.map((opt) => {
                  const pct = total > 0 ? Math.round((Number(opt.vote_count) / total) * 100) : 0;
                  return (
                    <div key={opt.id}>
                      <div className="flex justify-between text-xs mb-1">
                        <span className="text-gray-700">{opt.option_text}</span>
                        <span className="text-muted">{opt.vote_count} votes ({pct}%)</span>
                      </div>
                      <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                        <div className="h-full bg-crimson-600 rounded-full" style={{ width: `${pct}%` }} />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
        {!loading && surveys.length === 0 && <p className="text-sm text-muted">No surveys yet.</p>}
      </div>
    </div>
  );
}
