"use client";

import { useEffect, useState } from "react";
import { MessageCircleQuestion, Trash2 } from "lucide-react";

type Thread = {
  id: number;
  title: string;
  content: string;
  image_url: string | null;
  created_at: string;
  author_name: string;
  author_designation: string;
  author_photo: string | null;
  reply_count: string;
};

export default function AdminExpertsPage() {
  const [threads, setThreads] = useState<Thread[]>([]);
  const [loading, setLoading] = useState(true);

  function load() {
    setLoading(true);
    fetch("/api/expert-threads")
      .then((res) => res.json())
      .then((data) => setThreads(Array.isArray(data) ? data : []))
      .finally(() => setLoading(false));
  }

  useEffect(load, []);

  async function remove(id: number) {
    if (!confirm("Delete this thread and all its replies?")) return;
    await fetch(`/api/expert-threads/${id}`, { method: "DELETE" });
    setThreads((prev) => prev.filter((t) => t.id !== id));
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Ask the Expert</h1>
        <p className="text-muted mt-1">Moderate discussion threads from members.</p>
      </div>

      {loading && <p className="text-muted">Loading...</p>}
      {!loading && threads.length === 0 && <p className="text-muted">No threads yet.</p>}

      <div className="space-y-3">
        {threads.map((t) => (
          <div key={t.id} className="card !rounded-2xl">
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-center gap-3">
                <img src={t.author_photo || "https://i.pravatar.cc/150?u=" + t.id} alt={t.author_name} className="w-9 h-9 rounded-full object-cover" />
                <div>
                  <p className="font-semibold text-sm text-gray-900">{t.author_name}</p>
                  <p className="text-xs text-muted">{t.author_designation} &middot; {new Date(t.created_at).toLocaleString()}</p>
                </div>
              </div>
              <button onClick={() => remove(t.id)} className="text-red-500 hover:bg-red-50 p-2 rounded-lg" aria-label="Delete thread">
                <Trash2 size={16} />
              </button>
            </div>
            <h4 className="font-bold text-gray-900 mt-3">{t.title}</h4>
            <p className="text-sm mt-1 text-gray-600 line-clamp-3 whitespace-pre-wrap">{t.content}</p>
            {t.image_url && <img src={t.image_url} alt="" className="mt-3 rounded-lg max-h-48 object-cover" />}
            <p className="text-xs text-muted mt-3 flex items-center gap-1.5"><MessageCircleQuestion size={13} /> {t.reply_count} replies</p>
          </div>
        ))}
      </div>
    </div>
  );
}
