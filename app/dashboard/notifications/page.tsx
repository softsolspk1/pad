"use client";

import { useEffect, useState } from "react";
import { Bell, Loader2, Check } from "lucide-react";

type Notification = {
  id: number;
  title: string;
  body: string | null;
  is_read: boolean;
  created_at: string;
};

export default function NotificationsPage() {
  const [items, setItems] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);

  function load() {
    fetch("/api/notifications")
      .then((res) => res.json())
      .then((data) => setItems(Array.isArray(data) ? data : []))
      .finally(() => setLoading(false));
  }

  useEffect(() => {
    load();
  }, []);

  async function markRead(id: number) {
    setItems((prev) => prev.map((n) => (n.id === id ? { ...n, is_read: true } : n)));
    await fetch(`/api/notifications/${id}/read`, { method: "POST" });
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <h2 className="text-2xl font-bold flex items-center gap-2"><Bell size={22} className="text-crimson" /> Notifications</h2>

      {loading ? (
        <div className="flex justify-center py-16 text-muted"><Loader2 className="animate-spin" /></div>
      ) : items.length === 0 ? (
        <div className="card text-center text-muted py-10">You're all caught up &mdash; no notifications yet.</div>
      ) : (
        <div className="space-y-2">
          {items.map((n) => (
            <div key={n.id} className={`card flex items-start justify-between gap-4 ${n.is_read ? "opacity-70" : "border-l-4 border-l-[var(--primary-color)]"}`}>
              <div>
                <p className="font-semibold text-sm">{n.title}</p>
                {n.body && <p className="text-sm text-muted mt-1">{n.body}</p>}
                <p className="text-xs text-gray-400 mt-1">{new Date(n.created_at).toLocaleString()}</p>
              </div>
              {!n.is_read && (
                <button onClick={() => markRead(n.id)} className="text-xs text-crimson font-semibold flex items-center gap-1 flex-shrink-0 hover:underline">
                  <Check size={14} /> Mark read
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
