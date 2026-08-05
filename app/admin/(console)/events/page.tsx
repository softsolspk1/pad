"use client";

import { useEffect, useState } from "react";
import { Plus, Trash2, Pencil, X, Calendar, MapPin } from "lucide-react";
import AdminFileUpload from "@/components/AdminFileUpload";

type EventItem = {
  id: number;
  title: string;
  description: string | null;
  event_type: string;
  event_date: string;
  location: string | null;
  banner_url: string | null;
};

const emptyForm = {
  title: "",
  description: "",
  event_type: "conference",
  event_date: "",
  location: "",
  banner_url: "",
};

export default function AdminEventsPage() {
  const [events, setEvents] = useState<EventItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function load() {
    setLoading(true);
    fetch("/api/events")
      .then((res) => res.json())
      .then((data) => setEvents(Array.isArray(data) ? data : []))
      .finally(() => setLoading(false));
  }

  useEffect(load, []);

  function startCreate() {
    setForm(emptyForm);
    setEditingId(null);
    setShowForm(true);
  }

  function startEdit(ev: EventItem) {
    setForm({
      title: ev.title,
      description: ev.description || "",
      event_type: ev.event_type,
      event_date: ev.event_date ? new Date(ev.event_date).toISOString().slice(0, 16) : "",
      location: ev.location || "",
      banner_url: ev.banner_url || "",
    });
    setEditingId(ev.id);
    setShowForm(true);
  }

  async function save() {
    if (!form.title || !form.event_date) {
      setError("Title and date are required");
      return;
    }
    setSaving(true);
    setError(null);
    try {
      const res = await fetch(editingId ? `/api/events/${editingId}` : "/api/events", {
        method: editingId ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error();
      setShowForm(false);
      load();
    } catch {
      setError("Failed to save event");
    } finally {
      setSaving(false);
    }
  }

  async function remove(id: number) {
    if (!confirm("Delete this event?")) return;
    await fetch(`/api/events/${id}`, { method: "DELETE" });
    load();
  }

  const now = Date.now();
  const upcoming = events.filter((e) => new Date(e.event_date).getTime() >= now);
  const past = events.filter((e) => new Date(e.event_date).getTime() < now);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Events</h1>
          <p className="text-muted mt-1">Manage conferences and workshops.</p>
        </div>
        <button onClick={startCreate} className="btn-primary !py-2 !px-4 text-sm flex items-center gap-2">
          <Plus size={16} /> New Event
        </button>
      </div>

      {showForm && (
        <div className="card !rounded-2xl space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-gray-900">{editingId ? "Edit Event" : "New Event"}</h3>
            <button onClick={() => setShowForm(false)}><X size={18} className="text-muted" /></button>
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="label text-sm">Title *</label>
              <input className="input-field" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
            </div>
            <div>
              <label className="label text-sm">Type</label>
              <select className="input-field bg-white" value={form.event_type} onChange={(e) => setForm({ ...form, event_type: e.target.value })}>
                <option value="conference">Conference</option>
                <option value="workshop">Workshop</option>
              </select>
            </div>
            <div>
              <label className="label text-sm">Date &amp; Time *</label>
              <input type="datetime-local" className="input-field" value={form.event_date} onChange={(e) => setForm({ ...form, event_date: e.target.value })} />
            </div>
            <div>
              <label className="label text-sm">Location</label>
              <input className="input-field" value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} />
            </div>
          </div>
          <div>
            <label className="label text-sm">Description</label>
            <textarea className="input-field" rows={3} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
          </div>
          <AdminFileUpload label="Banner Image" accept="image/*" value={form.banner_url} onChange={(url) => setForm({ ...form, banner_url: url })} />
          {error && <p className="text-sm text-red-600">{error}</p>}
          <button onClick={save} disabled={saving} className="btn-primary !py-2 !px-4 text-sm disabled:opacity-60">
            {saving ? "Saving..." : "Save Event"}
          </button>
        </div>
      )}

      {loading && <p className="text-muted">Loading...</p>}

      {[{ label: "Upcoming", list: upcoming }, { label: "Past", list: past }].map((group) => (
        <div key={group.label}>
          <h3 className="font-bold text-gray-900 mb-3">{group.label} ({group.list.length})</h3>
          <div className="grid sm:grid-cols-2 gap-4">
            {group.list.map((ev) => (
              <div key={ev.id} className="card !rounded-2xl">
                {ev.banner_url && <img src={ev.banner_url} alt="" className="w-full h-32 object-cover rounded-lg mb-3" />}
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <span className="text-[10px] font-semibold uppercase text-crimson-600 bg-crimson-50 px-2 py-0.5 rounded-full">{ev.event_type}</span>
                    <h4 className="font-bold text-gray-900 mt-1.5">{ev.title}</h4>
                  </div>
                  <div className="flex gap-1 shrink-0">
                    <button onClick={() => startEdit(ev)} className="p-1.5 text-muted hover:text-crimson-600"><Pencil size={14} /></button>
                    <button onClick={() => remove(ev.id)} className="p-1.5 text-muted hover:text-red-600"><Trash2 size={14} /></button>
                  </div>
                </div>
                <p className="text-xs text-muted mt-2 flex items-center gap-1.5"><Calendar size={12} /> {new Date(ev.event_date).toLocaleString()}</p>
                {ev.location && <p className="text-xs text-muted flex items-center gap-1.5 mt-1"><MapPin size={12} /> {ev.location}</p>}
                {ev.description && <p className="text-sm mt-2 text-gray-600">{ev.description}</p>}
              </div>
            ))}
            {group.list.length === 0 && <p className="text-sm text-muted">No {group.label.toLowerCase()} events.</p>}
          </div>
        </div>
      ))}
    </div>
  );
}
