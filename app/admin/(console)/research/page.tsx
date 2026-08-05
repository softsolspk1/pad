"use client";

import { useEffect, useState } from "react";
import { Plus, Trash2, X, FileText } from "lucide-react";
import AdminFileUpload from "@/components/AdminFileUpload";

type ResearchItem = {
  id: number;
  category: string;
  title: string;
  description: string | null;
  author_or_source: string | null;
  file_url: string | null;
  cover_image_url: string | null;
  published_date: string | null;
};

const CATEGORIES = [
  { value: "paper", label: "Papers" },
  { value: "ebook", label: "E-Books" },
  { value: "guideline", label: "Guidelines" },
];

const emptyForm = {
  category: "paper",
  title: "",
  description: "",
  author_or_source: "",
  file_url: "",
  cover_image_url: "",
  published_date: "",
};

export default function AdminResearchPage() {
  const [items, setItems] = useState<ResearchItem[]>([]);
  const [tab, setTab] = useState("paper");
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function load() {
    setLoading(true);
    fetch("/api/research")
      .then((res) => res.json())
      .then((data) => setItems(Array.isArray(data) ? data : []))
      .finally(() => setLoading(false));
  }

  useEffect(load, []);

  async function save() {
    if (!form.title) {
      setError("Title is required");
      return;
    }
    setSaving(true);
    setError(null);
    try {
      const res = await fetch("/api/research", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error();
      setForm({ ...emptyForm, category: tab });
      setShowForm(false);
      load();
    } catch {
      setError("Failed to save item");
    } finally {
      setSaving(false);
    }
  }

  async function remove(id: number) {
    if (!confirm("Delete this item?")) return;
    await fetch(`/api/research/${id}`, { method: "DELETE" });
    load();
  }

  const filtered = items.filter((i) => i.category === tab);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Research Library</h1>
          <p className="text-muted mt-1">Papers, e-books, and clinical guidelines.</p>
        </div>
        <button
          onClick={() => { setForm({ ...emptyForm, category: tab }); setShowForm(true); }}
          className="btn-primary !py-2 !px-4 text-sm flex items-center gap-2"
        >
          <Plus size={16} /> Add Item
        </button>
      </div>

      <div className="flex gap-2 border-b border-gray-200">
        {CATEGORIES.map((c) => (
          <button
            key={c.value}
            onClick={() => setTab(c.value)}
            className={`px-4 py-2.5 text-sm font-semibold border-b-2 -mb-px transition-colors ${
              tab === c.value ? "border-crimson-600 text-crimson-600" : "border-transparent text-muted hover:text-gray-900"
            }`}
          >
            {c.label}
          </button>
        ))}
      </div>

      {showForm && (
        <div className="card !rounded-2xl space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-gray-900">Add Research Item</h3>
            <button onClick={() => setShowForm(false)}><X size={18} className="text-muted" /></button>
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="label text-sm">Category</label>
              <select className="input-field bg-white" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}>
                {CATEGORIES.map((c) => <option key={c.value} value={c.value}>{c.label}</option>)}
              </select>
            </div>
            <div>
              <label className="label text-sm">Title *</label>
              <input className="input-field" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
            </div>
            <div>
              <label className="label text-sm">Author / Source</label>
              <input className="input-field" value={form.author_or_source} onChange={(e) => setForm({ ...form, author_or_source: e.target.value })} />
            </div>
            <div>
              <label className="label text-sm">Published Date</label>
              <input type="date" className="input-field" value={form.published_date} onChange={(e) => setForm({ ...form, published_date: e.target.value })} />
            </div>
          </div>
          <div>
            <label className="label text-sm">Description</label>
            <textarea className="input-field" rows={2} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            <AdminFileUpload label="Document (PDF)" accept=".pdf,image/*" value={form.file_url} onChange={(url) => setForm({ ...form, file_url: url })} />
            <AdminFileUpload label="Cover Image" accept="image/*" value={form.cover_image_url} onChange={(url) => setForm({ ...form, cover_image_url: url })} />
          </div>
          {error && <p className="text-sm text-red-600">{error}</p>}
          <button onClick={save} disabled={saving} className="btn-primary !py-2 !px-4 text-sm disabled:opacity-60">
            {saving ? "Saving..." : "Save Item"}
          </button>
        </div>
      )}

      {loading && <p className="text-muted">Loading...</p>}

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((item) => (
          <div key={item.id} className="card !rounded-2xl">
            {item.cover_image_url ? (
              <img src={item.cover_image_url} alt="" className="w-full h-28 object-cover rounded-lg mb-3" />
            ) : (
              <div className="w-full h-28 bg-crimson-50 rounded-lg mb-3 flex items-center justify-center text-crimson-300">
                <FileText size={28} />
              </div>
            )}
            <div className="flex items-start justify-between gap-2">
              <h4 className="font-bold text-sm text-gray-900">{item.title}</h4>
              <button onClick={() => remove(item.id)} className="text-muted hover:text-red-600 shrink-0"><Trash2 size={14} /></button>
            </div>
            {item.author_or_source && <p className="text-xs text-muted mt-1">{item.author_or_source}</p>}
            {item.description && <p className="text-xs text-gray-600 mt-2 line-clamp-2">{item.description}</p>}
            {item.file_url && (
              <a href={item.file_url} target="_blank" rel="noreferrer" className="text-xs font-semibold text-crimson-600 hover:underline mt-2 inline-block">
                View file &rarr;
              </a>
            )}
          </div>
        ))}
        {!loading && filtered.length === 0 && <p className="text-sm text-muted">No items in this category yet.</p>}
      </div>
    </div>
  );
}
